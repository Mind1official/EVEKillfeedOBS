jQuery(document).ready(function($) {
    
    // Chunked Import System Variables
    let importInProgress = false;
    let importProgressInterval = null;
    
    // Import all systems with chunked processing
    $('#import-all-systems').on('click', function() {
        var button = $(this);
        var originalText = button.text();
        
        if (importInProgress) {
            alert('Import is already in progress. Please wait for it to complete or cancel it first.');
            return;
        }
        
        if (!confirm('This will import all ~7,000 EVE systems from ESI. This process will run in chunks and may take several minutes. Continue?')) {
            return;
        }
        
        startChunkedImport(button, originalText);
    });
    
    function startChunkedImport(button, originalText) {
        importInProgress = true;
        button.text('Starting Import...').prop('disabled', true);
        
        // Show enhanced progress indicator
        var progressHtml = '<div id="import-progress" style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 6px;">';
        progressHtml += '<h4 style="margin-top: 0;">EVE Systems Import Progress</h4>';
        progressHtml += '<div style="background: #e0e0e0; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">';
        progressHtml += '<div style="background: linear-gradient(90deg, #0073aa, #00a0d2); height: 24px; width: 0%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;" id="progress-bar">0%</div>';
        progressHtml += '</div>';
        progressHtml += '<p id="progress-text" style="margin: 0; font-size: 14px; color: #666;">Initializing import process...</p>';
        progressHtml += '<div id="progress-details" style="margin-top: 10px; font-size: 12px; color: #888;"></div>';
        progressHtml += '<div style="margin-top: 10px;"><button type="button" class="button button-secondary" id="cancel-import">Cancel Import</button></div>';
        progressHtml += '</div>';
        
        button.after(progressHtml);
        
        // Start the import
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_start_import',
                nonce: eveKillfeedAjax.nonce
            },
            timeout: 60000, // 1 minute timeout for start
            success: function(response) {
                if (response.success) {
                    $('#progress-text').text('Import started successfully. Processing chunks...');
                    updateProgressDisplay(response.data.progress);
                    
                    // Start processing chunks
                    processNextChunk();
                    
                    // Start progress polling
                    startProgressPolling();
                } else {
                    handleImportError('Failed to start import: ' + response.data, button, originalText);
                }
            },
            error: function(xhr, status, error) {
                handleImportError('Failed to start import: ' + error, button, originalText);
            }
        });
    }
    
    function processNextChunk() {
        if (!importInProgress) {
            return;
        }
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_process_chunk',
                nonce: eveKillfeedAjax.nonce
            },
            timeout: 60000, // 1 minute timeout per chunk
            success: function(response) {
                if (response.success) {
                    updateProgressDisplay(response.data.progress);
                    
                    if (response.data.completed) {
                        // Import completed
                        handleImportComplete(response.data.progress);
                    } else {
                        // Process next chunk after a short delay
                        setTimeout(processNextChunk, 1000);
                    }
                } else {
                    handleImportError('Chunk processing failed: ' + response.data, $('#import-all-systems'), $('#import-all-systems').data('original-text'));
                }
            },
            error: function(xhr, status, error) {
                if (status === 'timeout') {
                    // Retry on timeout
                    console.log('Chunk processing timed out, retrying...');
                    setTimeout(processNextChunk, 2000);
                } else {
                    handleImportError('Chunk processing error: ' + error, $('#import-all-systems'), $('#import-all-systems').data('original-text'));
                }
            }
        });
    }
    
    function startProgressPolling() {
        importProgressInterval = setInterval(function() {
            if (!importInProgress) {
                clearInterval(importProgressInterval);
                return;
            }
            
            $.ajax({
                url: eveKillfeedAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'eve_killfeed_get_import_progress',
                    nonce: eveKillfeedAjax.nonce
                },
                success: function(response) {
                    if (response.success && response.data.progress) {
                        updateProgressDisplay(response.data.progress);
                        
                        if (response.data.progress.status === 'completed') {
                            handleImportComplete(response.data.progress);
                        } else if (response.data.progress.status === 'error') {
                            handleImportError('Import failed: ' + response.data.progress.error_message, $('#import-all-systems'), $('#import-all-systems').data('original-text'));
                        }
                    }
                }
            });
        }, 3000); // Poll every 3 seconds
    }
    
    function updateProgressDisplay(progress) {
        if (!progress) return;
        
        $('#progress-bar').css('width', progress.progress_percent + '%').text(Math.round(progress.progress_percent) + '%');
        $('#progress-text').text(progress.message || 'Processing...');
        
        var details = '';
        details += 'Processed: ' + (progress.processed || 0) + ' / ' + (progress.total_systems || 0) + ' systems<br>';
        details += 'Imported: ' + (progress.imported || 0) + '<br>';
        details += 'Errors: ' + (progress.errors || 0) + '<br>';
        details += 'Current chunk: ' + (progress.current_chunk || 0) + ' / ' + (progress.total_chunks || 0);
        
        if (progress.recent_errors && progress.recent_errors.length > 0) {
            details += '<br><br><strong>Recent errors:</strong><br>';
            progress.recent_errors.forEach(function(error) {
                details += '• ' + error + '<br>';
            });
        }
        
        $('#progress-details').html(details);
    }
    
    function handleImportComplete(progress) {
        importInProgress = false;
        clearInterval(importProgressInterval);
        
        $('#progress-bar').css('background', '#46b450').css('width', '100%').text('100%');
        $('#progress-text').html('<strong style="color: #46b450;">✅ Import completed successfully!</strong>');
        
        var details = '';
        if (progress) {
            details += 'Final results:<br>';
            details += 'Imported: ' + (progress.imported || 0) + ' systems<br>';
            details += 'Errors: ' + (progress.errors || 0) + '<br>';
            if (progress.execution_time) {
                details += 'Execution time: ' + progress.execution_time + ' seconds<br>';
            }
            details += 'Total processed: ' + (progress.processed || 0) + ' systems';
        }
        $('#progress-details').html(details);
        
        // Hide cancel button
        $('#cancel-import').hide();
        
        // Reset import button
        var button = $('#import-all-systems');
        button.text(button.data('original-text') || 'Import All Systems').prop('disabled', false);
        
        setTimeout(function() {
            location.reload();
        }, 3000);
    }
    
    function handleImportError(errorMessage, button, originalText) {
        importInProgress = false;
        clearInterval(importProgressInterval);
        
        $('#progress-bar').css('background', '#dc3232').css('width', '100%').text('Failed');
        $('#progress-text').html('<strong style="color: #dc3232;">❌ ' + errorMessage + '</strong>');
        
        // Hide cancel button
        $('#cancel-import').hide();
        
        button.text(originalText).prop('disabled', false);
    }
    
    // Cancel import
    $(document).on('click', '#cancel-import', function() {
        if (!confirm('Are you sure you want to cancel the import? Progress will be lost.')) {
            return;
        }
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_cancel_import',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                importInProgress = false;
                clearInterval(importProgressInterval);
                
                $('#import-progress').remove();
                $('#import-all-systems').text('Import All Systems').prop('disabled', false);
                
                if (response.success) {
                    alert('Import cancelled successfully');
                } else {
                    alert('Failed to cancel import: ' + response.data);
                }
            }
        });
    });
    
    // Store original text for import button
    $('#import-all-systems').data('original-text', $('#import-all-systems').text());
    
    // Clear Monitored Systems
    $('#clear-monitored-systems').on('click', function() {
        if (!confirm('Are you sure you want to clear ALL monitored systems? This will stop monitoring all systems until you add new ones.')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.text('Clearing...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_clear_monitored_systems',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.data.message);
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('Error: Failed to clear monitored systems');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
    // Manual fetch killmails
    $('#manual-fetch').on('click', function() {
        var button = $(this);
        var originalText = button.text();
        
        button.text('Fetching...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_manual_fetch',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.message);
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to fetch killmails');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
    // Test API connectivity
    $('#test-apis').on('click', function() {
        var button = $(this);
        var originalText = button.text();
        
        button.text('Testing...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_test_apis',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    var message = 'API Test Results:\n';
                    var data = response.data;
                    
                    message += 'ESI API: ' + (data.esi_status ? 'Online' : 'Offline') + '\n';
                    message += 'zKillboard API: ' + (data.zkb_status ? 'Online' : 'Offline') + '\n';
                    message += 'System Lookup: ' + (data.system_lookup ? 'Working' : 'Failed') + '\n';
                    message += 'Killmail Fetch: ' + (data.killmail_fetch ? 'Working' : 'Failed') + '\n';
                    
                    if (data.diagnostics) {
                        message += '\nDiagnostics:\n';
                        if (data.diagnostics.esi_players) {
                            message += 'ESI Players Online: ' + data.diagnostics.esi_players + '\n';
                        }
                        if (data.diagnostics.jita_system_id) {
                            message += 'Jita System ID: ' + data.diagnostics.jita_system_id + '\n';
                        }
                        if (data.diagnostics.efm_c4_system_id) {
                            message += 'EFM-C4 System ID: ' + data.diagnostics.efm_c4_system_id + '\n';
                        }
                        if (data.diagnostics.jita_killmails_count !== undefined) {
                            message += 'Jita Recent Killmails: ' + data.diagnostics.jita_killmails_count + '\n';
                        }
                    }
                    
                    if (data.errors && data.errors.length > 0) {
                        message += '\nErrors:\n' + data.errors.join('\n');
                    }
                    
                    alert(message);
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to test APIs');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
    // Clear all data
    $('#clear-data').on('click', function() {
        if (!confirm('Are you sure you want to clear all killmail data? This cannot be undone.')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.text('Clearing...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_clear_data',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.message);
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to clear data');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
    // Add system
    $('#add-system').on('click', function() {
        var systemName = $('#new-system').val().trim();
        
        if (!systemName) {
            alert('Please enter a system name');
            return;
        }
        
        var currentSystems = [];
        $('#monitored-systems-list li').each(function() {
            var text = $(this).text().replace(' ×', '');
            currentSystems.push(text);
        });
        
        if (currentSystems.indexOf(systemName) !== -1) {
            alert('System already exists');
            return;
        }
        
        currentSystems.push(systemName);
        
        saveMonitoredSystems(currentSystems);
    });
    
    // Remove system (delegated event)
    $(document).on('click', '.remove-system', function() {
        var systemName = $(this).data('system');
        var currentSystems = [];
        
        $('#monitored-systems-list li').each(function() {
            var text = $(this).text().replace(' ×', '');
            if (text !== systemName) {
                currentSystems.push(text);
            }
        });
        
        saveMonitoredSystems(currentSystems);
    });
    
    // Add popular system buttons
    $(document).on('click', '.add-popular-system', function() {
        var systemName = $(this).data('system');
        $('#new-system').val(systemName);
        $('#add-system').click();
    });
    
    // Enter key in system input
    $('#new-system').on('keypress', function(e) {
        if (e.which === 13) {
            $('#add-system').click();
        }
    });
    
    function saveMonitoredSystems(systems) {
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {  
                action: 'eve_killfeed_save_systems',
                nonce: eveKillfeedAjax.nonce,
                systems: systems
            },
            success: function(response) {
                if (response.success) {
                    updateSystemsList(systems);
                    $('#new-system').val('');
                    
                    // Hide popular system button if it was just added
                    $('.add-popular-system').each(function() {
                        var buttonSystem = $(this).data('system');
                        if (systems.indexOf(buttonSystem) !== -1) {
                            $(this).hide();
                        }
                    });
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to save systems');
            }
        });
    }
    
    function updateSystemsList(systems) {
        var list = $('#monitored-systems-list');
        
        if (systems.length === 0) {
            list.html('<p><em>No systems configured. Add some popular systems below to get started.</em></p>');
            return;
        }
        
        var html = '<ul>';
        systems.forEach(function(system) {
            html += '<li>' + system + ' <span class="remove-system" data-system="' + system + '" style="cursor: pointer; color: #dc3232; font-weight: bold;">×</span></li>';
        });
        html += '</ul>';
        
        list.html(html);
    }
    
    // Auto-refresh data every 5 minutes
    setInterval(function() {
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_get_recent_kills',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success && response.data) {
                    updateRecentKills(response.data);
                }
            }
        });
    }, 300000); // 5 minutes
    
    function updateRecentKills(kills) {
        if (kills.length === 0) {
            $('#recent-killmails').html('<p>No killmails found.</p>');
            return;
        }
        
        var html = '<table class="wp-list-table widefat">';
        html += '<thead><tr>';
        html += '<th>Time</th><th>System</th><th>Ship</th><th>Victim</th><th>Killer</th><th>Value</th><th>Link</th>';
        html += '</tr></thead><tbody>';
        
        kills.forEach(function(kill) {
            var time = new Date(kill.kill_time).toLocaleTimeString();
            var value = formatISK(kill.total_value);
            
            html += '<tr>';
            html += '<td>' + time + '</td>';
            html += '<td>' + kill.system_name + '</td>';
            html += '<td>' + kill.ship_name + '</td>';
            html += '<td>' + kill.victim_name + '</td>';
            html += '<td>' + kill.killer_name + '</td>';
            html += '<td>' + value + ' ISK</td>';
            html += '<td><a href="' + kill.zkb_url + '" target="_blank">zKB</a></td>';
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        $('#recent-killmails').html(html);
    }
    
    function formatISK(value) {
        if (value >= 1000000000000) {
            return (value / 1000000000000).toFixed(2) + 'T';
        } else if (value >= 1000000000) {
            return (value / 1000000000).toFixed(2) + 'B';
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toLocaleString();
        }
    }
});