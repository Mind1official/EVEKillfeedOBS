<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get logs with pagination
$page = isset($_GET['log_page']) ? max(1, intval($_GET['log_page'])) : 1;
$per_page = 50;
$offset = ($page - 1) * $per_page;

// Get filter parameters
$level_filter = isset($_GET['level']) ? sanitize_text_field($_GET['level']) : '';
$search_query = isset($_GET['search']) ? sanitize_text_field($_GET['search']) : '';

// Get logs from database
global $wpdb;
$logs_table = $wpdb->prefix . 'eve_killfeed_logs';

// Build WHERE clause
$where_conditions = array();
$where_values = array();

if (!empty($level_filter)) {
    $where_conditions[] = "level = %s";
    $where_values[] = $level_filter;
}

if (!empty($search_query)) {
    $where_conditions[] = "message LIKE %s";
    $where_values[] = '%' . $wpdb->esc_like($search_query) . '%';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count
$count_sql = "SELECT COUNT(*) FROM {$logs_table} {$where_clause}";
if (!empty($where_values)) {
    $total_logs = $wpdb->get_var($wpdb->prepare($count_sql, $where_values));
} else {
    $total_logs = $wpdb->get_var($count_sql);
}

// Get logs for current page
$logs_sql = "SELECT * FROM {$logs_table} {$where_clause} ORDER BY created_at DESC LIMIT %d OFFSET %d";
$query_values = array_merge($where_values, array($per_page, $offset));
$logs = $wpdb->get_results($wpdb->prepare($logs_sql, $query_values), ARRAY_A);

// Calculate pagination
$total_pages = ceil($total_logs / $per_page);

// Get log level counts
$level_counts = $wpdb->get_results(
    "SELECT level, COUNT(*) as count FROM {$logs_table} GROUP BY level ORDER BY count DESC",
    ARRAY_A
);

function get_level_badge_class($level) {
    switch (strtolower($level)) {
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        case 'success':
            return 'success';
        case 'info':
        default:
            return 'info';
    }
}

function format_log_time($datetime) {
    $time = strtotime($datetime);
    $now = time();
    $diff = $now - $time;
    
    if ($diff < 60) {
        return 'Just now';
    } elseif ($diff < 3600) {
        return floor($diff / 60) . ' minutes ago';
    } elseif ($diff < 86400) {
        return floor($diff / 3600) . ' hours ago';
    } else {
        return date('M j, Y H:i:s', $time);
    }
}
?>

<div class="wrap">
    <h1><?php _e('EVE Killfeed Logs', 'eve-killfeed'); ?></h1>
    
    <div class="logs-layout">
        <!-- Filters and Controls -->
        <div class="logs-controls">
            <div class="logs-filters">
                <form method="get" action="">
                    <input type="hidden" name="page" value="eve-killfeed-logs">
                    
                    <div class="filter-group">
                        <label for="level-filter"><?php _e('Level:', 'eve-killfeed'); ?></label>
                        <select name="level" id="level-filter">
                            <option value=""><?php _e('All Levels', 'eve-killfeed'); ?></option>
                            <option value="error" <?php selected($level_filter, 'error'); ?>><?php _e('Error', 'eve-killfeed'); ?></option>
                            <option value="warning" <?php selected($level_filter, 'warning'); ?>><?php _e('Warning', 'eve-killfeed'); ?></option>
                            <option value="info" <?php selected($level_filter, 'info'); ?>><?php _e('Info', 'eve-killfeed'); ?></option>
                            <option value="success" <?php selected($level_filter, 'success'); ?>><?php _e('Success', 'eve-killfeed'); ?></option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="search-filter"><?php _e('Search:', 'eve-killfeed'); ?></label>
                        <input type="text" name="search" id="search-filter" value="<?php echo esc_attr($search_query); ?>" placeholder="<?php _e('Search log messages...', 'eve-killfeed'); ?>">
                    </div>
                    
                    <div class="filter-group">
                        <button type="submit" class="button button-primary"><?php _e('Filter', 'eve-killfeed'); ?></button>
                        <a href="<?php echo admin_url('admin.php?page=eve-killfeed-logs'); ?>" class="button"><?php _e('Clear', 'eve-killfeed'); ?></a>
                    </div>
                </form>
            </div>
            
            <div class="logs-actions">
                <button type="button" class="button button-secondary" id="refresh-logs"><?php _e('Refresh', 'eve-killfeed'); ?></button>
                <button type="button" class="button button-danger" id="clear-all-logs"><?php _e('Clear All Logs', 'eve-killfeed'); ?></button>
            </div>
        </div>
        
        <!-- Log Level Summary -->
        <div class="logs-summary">
            <h3><?php _e('Log Summary', 'eve-killfeed'); ?></h3>
            <div class="summary-stats">
                <div class="summary-item">
                    <span class="summary-number"><?php echo number_format($total_logs); ?></span>
                    <span class="summary-label"><?php _e('Total Logs', 'eve-killfeed'); ?></span>
                </div>
                
                <?php foreach ($level_counts as $level_count): ?>
                    <div class="summary-item">
                        <span class="summary-number"><?php echo number_format($level_count['count']); ?></span>
                        <span class="summary-label">
                            <span class="level-badge <?php echo get_level_badge_class($level_count['level']); ?>">
                                <?php echo ucfirst($level_count['level']); ?>
                            </span>
                        </span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <!-- Logs Table -->
        <div class="logs-table-container">
            <?php if (!empty($logs)): ?>
                <table class="wp-list-table widefat fixed striped logs-table">
                    <thead>
                        <tr>
                            <th scope="col" class="column-time"><?php _e('Time', 'eve-killfeed'); ?></th>
                            <th scope="col" class="column-level"><?php _e('Level', 'eve-killfeed'); ?></th>
                            <th scope="col" class="column-message"><?php _e('Message', 'eve-killfeed'); ?></th>
                            <th scope="col" class="column-context"><?php _e('Context', 'eve-killfeed'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($logs as $log): ?>
                            <tr class="log-entry log-level-<?php echo esc_attr($log['level']); ?>">
                                <td class="column-time">
                                    <div class="log-time">
                                        <span class="time-relative"><?php echo format_log_time($log['created_at']); ?></span>
                                        <span class="time-absolute"><?php echo date('Y-m-d H:i:s', strtotime($log['created_at'])); ?></span>
                                    </div>
                                </td>
                                <td class="column-level">
                                    <span class="level-badge <?php echo get_level_badge_class($log['level']); ?>">
                                        <?php echo ucfirst($log['level']); ?>
                                    </span>
                                </td>
                                <td class="column-message">
                                    <div class="log-message">
                                        <?php echo esc_html($log['message']); ?>
                                    </div>
                                </td>
                                <td class="column-context">
                                    <?php if (!empty($log['context'])): ?>
                                        <details class="log-context">
                                            <summary><?php _e('View Context', 'eve-killfeed'); ?></summary>
                                            <pre><?php echo esc_html($log['context']); ?></pre>
                                        </details>
                                    <?php else: ?>
                                        <span class="no-context"><?php _e('No context', 'eve-killfeed'); ?></span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <!-- Pagination -->
                <?php if ($total_pages > 1): ?>
                    <div class="logs-pagination">
                        <div class="pagination-info">
                            <?php
                            $start = $offset + 1;
                            $end = min($offset + $per_page, $total_logs);
                            printf(__('Showing %d-%d of %d logs', 'eve-killfeed'), $start, $end, $total_logs);
                            ?>
                        </div>
                        
                        <div class="pagination-links">
                            <?php
                            $base_url = admin_url('admin.php?page=eve-killfeed-logs');
                            if (!empty($level_filter)) {
                                $base_url .= '&level=' . urlencode($level_filter);
                            }
                            if (!empty($search_query)) {
                                $base_url .= '&search=' . urlencode($search_query);
                            }
                            
                            // Previous page
                            if ($page > 1): ?>
                                <a href="<?php echo $base_url . '&log_page=' . ($page - 1); ?>" class="button"><?php _e('Previous', 'eve-killfeed'); ?></a>
                            <?php endif;
                            
                            // Page numbers
                            $start_page = max(1, $page - 2);
                            $end_page = min($total_pages, $page + 2);
                            
                            for ($i = $start_page; $i <= $end_page; $i++): ?>
                                <a href="<?php echo $base_url . '&log_page=' . $i; ?>" 
                                   class="button <?php echo $i === $page ? 'button-primary' : ''; ?>">
                                    <?php echo $i; ?>
                                </a>
                            <?php endfor;
                            
                            // Next page
                            if ($page < $total_pages): ?>
                                <a href="<?php echo $base_url . '&log_page=' . ($page + 1); ?>" class="button"><?php _e('Next', 'eve-killfeed'); ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
                
            <?php else: ?>
                <div class="no-logs">
                    <div class="no-logs-icon">📝</div>
                    <h3><?php _e('No logs found', 'eve-killfeed'); ?></h3>
                    <p><?php _e('No log entries match your current filters. Try adjusting your search criteria or clear the filters to see all logs.', 'eve-killfeed'); ?></p>
                    
                    <?php if (!empty($level_filter) || !empty($search_query)): ?>
                        <a href="<?php echo admin_url('admin.php?page=eve-killfeed-logs'); ?>" class="button button-primary">
                            <?php _e('View All Logs', 'eve-killfeed'); ?>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
.logs-layout {
    margin-top: 20px;
}

.logs-controls {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

.logs-filters {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-group label {
    font-weight: 600;
    color: #1d2327;
    white-space: nowrap;
}

.filter-group select,
.filter-group input[type="text"] {
    padding: 6px 10px;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    font-size: 14px;
}

.logs-actions {
    display: flex;
    gap: 10px;
}

.button-danger {
    background: #dc3232;
    border-color: #dc3232;
    color: white;
}

.button-danger:hover {
    background: #c62d2d;
    border-color: #c62d2d;
}

.logs-summary {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.logs-summary h3 {
    margin: 0 0 15px 0;
    color: #1d2327;
    border-bottom: 2px solid #0073aa;
    padding-bottom: 8px;
}

.summary-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 6px;
    min-width: 100px;
}

.summary-number {
    font-size: 24px;
    font-weight: bold;
    color: #0073aa;
    margin-bottom: 5px;
}

.summary-label {
    font-size: 12px;
    color: #666;
    text-align: center;
}

.level-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
}

.level-badge.error {
    background: #dc3232;
}

.level-badge.warning {
    background: #ff9800;
}

.level-badge.success {
    background: #46b450;
}

.level-badge.info {
    background: #0073aa;
}

.logs-table-container {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 8px;
    overflow: hidden;
}

.logs-table {
    margin: 0;
    border: none;
}

.logs-table th {
    background: #f6f7f7;
    border-bottom: 1px solid #c3c4c7;
    padding: 12px;
    font-weight: 600;
}

.logs-table td {
    padding: 12px;
    vertical-align: top;
    border-bottom: 1px solid #f0f0f0;
}

.column-time {
    width: 180px;
}

.column-level {
    width: 100px;
}

.column-context {
    width: 120px;
}

.log-time {
    display: flex;
    flex-direction: column;
}

.time-relative {
    font-weight: 600;
    color: #1d2327;
    margin-bottom: 2px;
}

.time-absolute {
    font-size: 12px;
    color: #666;
    font-family: monospace;
}

.log-message {
    line-height: 1.4;
    word-break: break-word;
}

.log-context details {
    cursor: pointer;
}

.log-context summary {
    color: #0073aa;
    font-size: 12px;
    padding: 4px 8px;
    background: #f0f8ff;
    border-radius: 4px;
    border: 1px solid #0073aa;
}

.log-context pre {
    margin-top: 8px;
    padding: 10px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 11px;
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
}

.no-context {
    color: #999;
    font-style: italic;
    font-size: 12px;
}

.log-entry.log-level-error {
    border-left: 4px solid #dc3232;
}

.log-entry.log-level-warning {
    border-left: 4px solid #ff9800;
}

.log-entry.log-level-success {
    border-left: 4px solid #46b450;
}

.log-entry.log-level-info {
    border-left: 4px solid #0073aa;
}

.logs-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f9f9f9;
    border-top: 1px solid #f0f0f0;
}

.pagination-info {
    color: #666;
    font-size: 14px;
}

.pagination-links {
    display: flex;
    gap: 5px;
}

.pagination-links .button {
    padding: 6px 12px;
    font-size: 13px;
}

.no-logs {
    text-align: center;
    padding: 60px 20px;
    color: #666;
}

.no-logs-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.no-logs h3 {
    margin: 0 0 10px 0;
    color: #1d2327;
}

.no-logs p {
    margin-bottom: 20px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 1200px) {
    .logs-controls {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .summary-stats {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .logs-filters {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }
    
    .filter-group {
        width: 100%;
        justify-content: space-between;
    }
    
    .filter-group select,
    .filter-group input[type="text"] {
        flex: 1;
        max-width: 200px;
    }
    
    .logs-pagination {
        flex-direction: column;
        gap: 10px;
    }
    
    .column-time,
    .column-level,
    .column-context {
        width: auto;
    }
    
    .logs-table {
        font-size: 14px;
    }
    
    .logs-table th,
    .logs-table td {
        padding: 8px;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    // Refresh logs
    $('#refresh-logs').on('click', function() {
        location.reload();
    });
    
    // Clear all logs
    $('#clear-all-logs').on('click', function() {
        if (!confirm('Are you sure you want to clear ALL log entries? This cannot be undone.')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Clearing...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_clear_logs',
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
                alert('Error: Failed to clear logs');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // Auto-refresh every 30 seconds if on first page with no filters
    <?php if ($page === 1 && empty($level_filter) && empty($search_query)): ?>
    setInterval(function() {
        // Only auto-refresh if user hasn't interacted recently
        if (document.hidden === false) {
            var lastActivity = localStorage.getItem('eve_logs_last_activity');
            var now = Date.now();
            
            if (!lastActivity || (now - parseInt(lastActivity)) > 30000) {
                location.reload();
            }
        }
    }, 30000);
    
    // Track user activity
    $(document).on('click keypress scroll', function() {
        localStorage.setItem('eve_logs_last_activity', Date.now());
    });
    <?php endif; ?>
});
</script>