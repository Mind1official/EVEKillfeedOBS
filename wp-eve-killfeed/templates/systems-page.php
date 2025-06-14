<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
$monitored_systems = $systems_manager->get_monitored_systems();
$monitored_regions = $systems_manager->get_monitored_regions();
$system_stats = $systems_manager->get_system_stats();

// Get recently tracked systems from user meta or option
$recently_tracked = get_option('eve_killfeed_recently_tracked', array());
?>

<div class="wrap">
    <h1><?php _e('EVE Systems & Regions Management', 'eve-killfeed'); ?></h1>
    
    <div class="systems-layout">
        <!-- Left Column -->
        <div class="systems-main">
            
            <!-- System Search and Selection -->
            <div class="systems-card">
                <h2><?php _e('System Search & Selection', 'eve-killfeed'); ?></h2>
                <div class="search-container">
                    <input 
                        type="text" 
                        id="system-search" 
                        placeholder="<?php _e('Search EVE systems (e.g., Jita, Tama, EFM-C4)...', 'eve-killfeed'); ?>"
                        autocomplete="off"
                    >
                    <div id="system-search-results" class="search-results"></div>
                </div>
                
                <div class="search-help">
                    <div class="help-grid">
                        <div class="help-item">
                            <span class="help-icon">🔍</span>
                            <span>Type any EVE system name</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">✅</span>
                            <span>Green = Currently monitored</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">⚡</span>
                            <span>Changes take effect immediately</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">🎯</span>
                            <span>Click to add/remove systems</span>
                        </div>
                    </div>
                </div>
                
                <div class="search-actions">
                    <button type="button" class="btn-small secondary" id="check-system-exists">
                        <?php _e('System Not Found? Check ESI & Add', 'eve-killfeed'); ?>
                    </button>
                </div>
            </div>

            <!-- Region Search and Selection -->
            <div class="systems-card">
                <h2><?php _e('Region Search & Selection', 'eve-killfeed'); ?></h2>
                <div class="search-container">
                    <input 
                        type="text" 
                        id="region-search" 
                        placeholder="<?php _e('Search EVE regions (e.g., The Forge, Delve, Black Rise)...', 'eve-killfeed'); ?>"
                        autocomplete="off"
                    >
                    <div id="region-search-results" class="search-results"></div>
                </div>
                
                <div class="search-help">
                    <div class="help-grid">
                        <div class="help-item">
                            <span class="help-icon">🌌</span>
                            <span>Monitor entire regions for activity</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">📊</span>
                            <span>Regions capture more killmails</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">⚡</span>
                            <span>Changes take effect immediately</span>
                        </div>
                        <div class="help-item">
                            <span class="help-icon">🎯</span>
                            <span>Click to add/remove regions</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Select from Previously Tracked -->
            <?php if (!empty($recently_tracked)): ?>
            <div class="systems-card">
                <h2><?php _e('Quick Select - Previously Tracked', 'eve-killfeed'); ?></h2>
                <div class="quick-select-grid">
                    <?php foreach (array_slice($recently_tracked, 0, 12) as $system): ?>
                        <button type="button" class="quick-select-btn" data-system="<?php echo esc_attr($system); ?>">
                            <?php echo esc_html($system); ?>
                        </button>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
            
            <!-- Currently Monitored Systems -->
            <div class="systems-card">
                <h2><?php _e('Currently Monitored Systems', 'eve-killfeed'); ?></h2>
                <div class="monitored-header">
                    <span class="monitored-count"><?php echo count($monitored_systems); ?> systems active</span>
                    <div class="monitored-actions">
                        <button type="button" class="btn-small secondary" id="clear-all-systems">
                            <?php _e('Clear All', 'eve-killfeed'); ?>
                        </button>
                        <button type="button" class="btn-small primary" id="fetch-now">
                            <?php _e('Fetch Now', 'eve-killfeed'); ?>
                        </button>
                    </div>
                </div>
                
                <?php if (!empty($monitored_systems)): ?>
                    <div class="monitored-grid">
                        <?php foreach ($monitored_systems as $system): ?>
                            <div class="monitored-system">
                                <div class="system-info">
                                    <span class="system-name"><?php echo esc_html($system['system_name']); ?></span>
                                    <span class="system-details">
                                        <span class="security-badge <?php echo esc_attr($system['security_class']); ?>">
                                            <?php echo number_format($system['security_status'], 1); ?>
                                        </span>
                                        <span class="region"><?php echo esc_html($system['region_name']); ?></span>
                                    </span>
                                </div>
                                <button class="remove-system-btn" data-system="<?php echo esc_attr($system['system_name']); ?>" title="Remove system">
                                    ×
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="no-systems">
                        <div class="no-systems-icon">🎯</div>
                        <h3><?php _e('No systems monitored', 'eve-killfeed'); ?></h3>
                        <p><?php _e('Search for systems above or use the quick presets to get started.', 'eve-killfeed'); ?></p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Currently Monitored Regions -->
            <div class="systems-card">
                <h2><?php _e('Currently Monitored Regions', 'eve-killfeed'); ?></h2>
                <div class="monitored-header">
                    <span class="monitored-count"><?php echo count($monitored_regions); ?> regions active</span>
                    <div class="monitored-actions">
                        <button type="button" class="btn-small secondary" id="clear-all-regions">
                            <?php _e('Clear All', 'eve-killfeed'); ?>
                        </button>
                        <button type="button" class="btn-small primary" id="fetch-regions-now">
                            <?php _e('Fetch Now', 'eve-killfeed'); ?>
                        </button>
                    </div>
                </div>
                
                <?php if (!empty($monitored_regions)): ?>
                    <div class="monitored-grid">
                        <?php foreach ($monitored_regions as $region): ?>
                            <div class="monitored-region">
                                <div class="region-info">
                                    <span class="region-name"><?php echo esc_html($region['region_name']); ?></span>
                                    <span class="region-details">
                                        <span class="region-description"><?php echo esc_html($region['description'] ?? 'EVE Online region'); ?></span>
                                    </span>
                                </div>
                                <button class="remove-region-btn" data-region="<?php echo esc_attr($region['region_name']); ?>" title="Remove region">
                                    ×
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="no-regions">
                        <div class="no-regions-icon">🌌</div>
                        <h3><?php _e('No regions monitored', 'eve-killfeed'); ?></h3>
                        <p><?php _e('Search for regions above to get started.', 'eve-killfeed'); ?></p>
                    </div>
                <?php endif; ?>
            </div>
            
        <!-- Danger Zone -->
            <div class="systems-card danger-zone">
                <h2>⚠️ <?php _e('Danger Zone', 'eve-killfeed'); ?></h2>
                <p class="danger-warning"><?php _e('These actions can significantly impact your killfeed data. Use with caution.', 'eve-killfeed'); ?></p>
                
                <div class="danger-actions">
                    <!-- Clear Monitored Systems -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Clear All Monitored Systems', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Remove monitoring from ALL systems. This will stop system-based killmail fetching.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-danger" id="clear-monitored-systems">
                            <?php _e('🗑️ Clear All Systems', 'eve-killfeed'); ?>
                        </button>
                    </div>

                    <!-- Clear Monitored Regions -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Clear All Monitored Regions', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Remove monitoring from ALL regions. This will stop region-based killmail fetching.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-danger" id="clear-monitored-regions">
                            <?php _e('🗑️ Clear All Regions', 'eve-killfeed'); ?>
                        </button>
                    </div>
                    
                    <!-- Force Clear Systems -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Force Clear All Systems', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Remove ALL systems from database and repopulate with fresh data. This will reset your monitored systems.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-danger" id="force-clear-systems">
                            <?php _e('🗑️ Force Clear & Repopulate', 'eve-killfeed'); ?>
                        </button>
                    </div>
                    
                    <!-- Import All Systems -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Import All EVE Systems', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Import all ~7,000 EVE systems from ESI API. This process runs in chunks and may take 5-10 minutes.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-primary" id="import-all-systems">
                            <?php _e('📥 Import All Systems', 'eve-killfeed'); ?>
                        </button>
                    </div>

                    <!-- Import All Regions -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Import All EVE Regions', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Import all ~100 EVE regions from ESI API. This is much faster than systems import.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-primary" id="import-all-regions">
                            <?php _e('📥 Import All Regions', 'eve-killfeed'); ?>
                        </button>
                    </div>
                    
                    <!-- Import Missing System -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('Import Missing System', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Search ESI for a specific system and add it to the database if found.', 'eve-killfeed'); ?></p>
                        </div>
                        <div class="input-with-button">
                            <input type="text" id="missing-system-input" placeholder="<?php _e('Enter system name (e.g., Jita, EFM-C4)...', 'eve-killfeed'); ?>">
                            <button type="button" class="button-secondary" id="import-missing-system-btn">
                                <?php _e('🔍 Check & Import', 'eve-killfeed'); ?>
                            </button>
                        </div>
                    </div>

                    <!-- New Session -->
                    <div class="danger-action-group">
                        <div class="action-info">
                            <h4><?php _e('New Session', 'eve-killfeed'); ?></h4>
                            <p class="action-description"><?php _e('Clear ALL data (killmails, systems, regions) and start completely fresh.', 'eve-killfeed'); ?></p>
                        </div>
                        <button type="button" class="button-danger" id="new-session">
                            <?php _e('🆕 New Session', 'eve-killfeed'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Right Column -->
        <div class="systems-sidebar">
            
            <!-- System & Region Statistics -->
            <div class="systems-card">
                <h2><?php _e('Statistics', 'eve-killfeed'); ?></h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number"><?php echo number_format($system_stats['monitored_systems']); ?></span>
                        <span class="stat-label"><?php _e('Systems', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number"><?php echo number_format($system_stats['monitored_regions']); ?></span>
                        <span class="stat-label"><?php _e('Regions', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number"><?php echo number_format($system_stats['total_systems']); ?></span>
                        <span class="stat-label"><?php _e('Available Systems', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number"><?php echo number_format($system_stats['total_regions']); ?></span>
                        <span class="stat-label"><?php _e('Available Regions', 'eve-killfeed'); ?></span>
                    </div>
                </div>
                
                <div class="security-breakdown">
                    <h4><?php _e('Systems by Security:', 'eve-killfeed'); ?></h4>
                    <?php foreach ($system_stats['by_security'] as $class => $count): ?>
                        <div class="security-stat">
                            <span class="security-badge <?php echo esc_attr($class); ?>"><?php echo ucfirst($class); ?></span>
                            <span class="count"><?php echo number_format($count); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- System Presets -->
            <div class="systems-card">
                <h2><?php _e('System Presets', 'eve-killfeed'); ?></h2>
                <div class="presets-grid">
                    <button type="button" class="preset-btn" data-preset="trade-hubs">
                        <span class="preset-icon">🏪</span>
                        <span class="preset-name"><?php _e('Trade Hubs', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Jita, Amarr, Dodixie, Rens, Hek</span>
                    </button>
                    
                    <button type="button" class="preset-btn" data-preset="pvp-hotspots">
                        <span class="preset-icon">⚔️</span>
                        <span class="preset-name"><?php _e('PvP Hotspots', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Tama, Amamake, Rancer, EFM-C4</span>
                    </button>
                    
                    <button type="button" class="preset-btn" data-preset="lowsec-roam">
                        <span class="preset-icon">🌙</span>
                        <span class="preset-name"><?php _e('Lowsec Roam', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Common roaming routes</span>
                    </button>
                </div>
            </div>

            <!-- Region Presets -->
            <div class="systems-card">
                <h2><?php _e('Region Presets', 'eve-killfeed'); ?></h2>
                <div class="presets-grid">
                    <button type="button" class="region-preset-btn" data-preset="trade-regions">
                        <span class="preset-icon">🏪</span>
                        <span class="preset-name"><?php _e('Trade Regions', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">The Forge, Domain, Sinq Laison</span>
                    </button>
                    
                    <button type="button" class="region-preset-btn" data-preset="pvp-regions">
                        <span class="preset-icon">⚔️</span>
                        <span class="preset-name"><?php _e('PvP Regions', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Black Rise, Placid, Genesis</span>
                    </button>
                    
                    <button type="button" class="region-preset-btn" data-preset="null-regions">
                        <span class="preset-icon">🌌</span>
                        <span class="preset-name"><?php _e('Major Null-sec', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Delve, Fountain, Catch</span>
                    </button>
                    
                    <button type="button" class="region-preset-btn" data-preset="npc-regions">
                        <span class="preset-icon">🏴‍☠️</span>
                        <span class="preset-name"><?php _e('NPC Null-sec', 'eve-killfeed'); ?></span>
                        <span class="preset-desc">Curse, Syndicate, Stain</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.systems-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 20px;
    margin-top: 20px;
}

.systems-card {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.systems-card h2 {
    margin: 0 0 15px 0;
    color: #1d2327;
    font-size: 18px;
    border-bottom: 2px solid #0073aa;
    padding-bottom: 8px;
}

/* Danger Zone Styling */
.danger-zone {
    border-color: #dc3232;
    background: linear-gradient(135deg, #fff 0%, #fef7f7 100%);
}

.danger-zone h2 {
    color: #dc3232;
    border-bottom-color: #dc3232;
}

.danger-warning {
    background: rgba(220, 50, 50, 0.1);
    border: 1px solid rgba(220, 50, 50, 0.3);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 20px;
    color: #dc3232;
    font-weight: 500;
}

.danger-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.danger-action-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    gap: 20px;
}

.action-info {
    flex: 1;
}

.action-info h4 {
    margin: 0 0 5px 0;
    color: #1d2327;
    font-size: 16px;
}

.action-description {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
}

.input-with-button {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 300px;
}

.input-with-button input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    font-size: 14px;
}

.button-danger {
    background: #dc3232;
    color: white;
    border: 1px solid #dc3232;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.button-danger:hover {
    background: #c62d2d;
    border-color: #c62d2d;
}

.button-primary {
    background: #0073aa;
    color: white;
    border: 1px solid #0073aa;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.button-primary:hover {
    background: #005a87;
    border-color: #005a87;
}

.button-secondary {
    background: #f0f0f1;
    color: #1d2327;
    border: 1px solid #c3c4c7;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.button-secondary:hover {
    background: #dcdcde;
    border-color: #a7aaad;
}

/* Search */
.search-container {
    position: relative;
    margin-bottom: 15px;
}

#system-search, #region-search {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #c3c4c7;
    border-radius: 8px;
    transition: border-color 0.3s ease;
}

#system-search:focus, #region-search:focus {
    border-color: #0073aa;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 115, 170, 0.2);
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #c3c4c7;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.search-result-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-result-item:hover {
    background-color: #f8f9fa;
}

.search-result-item.monitored {
    background-color: #e8f5e8;
    border-left: 4px solid #46b450;
}

.search-actions {
    margin-top: 10px;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.help-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
}

.help-icon {
    font-size: 16px;
}

/* Quick Select */
.quick-select-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
}

.quick-select-btn {
    padding: 8px 12px;
    background: #f0f0f1;
    border: 1px solid #c3c4c7;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;
}

.quick-select-btn:hover {
    background: #0073aa;
    color: white;
    border-color: #0073aa;
}

/* Monitored Systems & Regions */
.monitored-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.monitored-count {
    font-weight: 600;
    color: #0073aa;
}

.monitored-actions {
    display: flex;
    gap: 8px;
}

.btn-small {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-small.primary {
    background: #0073aa;
    color: white;
}

.btn-small.primary:hover {
    background: #005a87;
}

.btn-small.secondary {
    background: #f0f0f1;
    color: #1d2327;
}

.btn-small.secondary:hover {
    background: #dcdcde;
}

.btn-small.danger {
    background: #dc3232;
    color: white;
}

.btn-small.danger:hover {
    background: #c62d2d;
}

.monitored-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.monitored-system, .monitored-region {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    border-left: 4px solid #46b450;
}

.system-info, .region-info {
    flex: 1;
}

.system-name, .region-name {
    display: block;
    font-weight: 600;
    color: #1d2327;
    margin-bottom: 4px;
}

.system-details, .region-details {
    display: flex;
    align-items: center;
    gap: 8px;
}

.security-badge {
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: bold;
    color: white;
}

.security-badge.highsec { background: #4CAF50; }
.security-badge.lowsec { background: #FF9800; }
.security-badge.nullsec { background: #F44336; }
.security-badge.wormhole { background: #9C27B0; }

.region, .region-description {
    font-size: 12px;
    color: #666;
}

.remove-system-btn, .remove-region-btn {
    width: 24px;
    height: 24px;
    border: none;
    background: #dc3232;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    transition: all 0.2s ease;
}

.remove-system-btn:hover, .remove-region-btn:hover {
    background: #c62d2d;
    transform: scale(1.1);
}

.no-systems, .no-regions {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.no-systems-icon, .no-regions-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.no-systems h3, .no-regions h3 {
    margin: 0 0 10px 0;
    color: #1d2327;
}

/* Statistics */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 6px;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #0073aa;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 12px;
    color: #666;
}

.security-breakdown h4 {
    margin: 0 0 10px 0;
    color: #1d2327;
}

.security-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 6px;
}

.count {
    font-weight: 600;
    color: #1d2327;
}

/* Presets */
.presets-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 20px;
}

.preset-btn, .region-preset-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.preset-btn:hover, .region-preset-btn:hover {
    background: #f0f8ff;
    border-color: #0073aa;
}

.preset-icon {
    font-size: 20px;
    margin-bottom: 5px;
}

.preset-name {
    font-weight: 600;
    color: #1d2327;
    margin-bottom: 2px;
}

.preset-desc {
    font-size: 11px;
    color: #666;
}

.status-badge {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.status-badge.active {
    background: #46b450;
    color: white;
}

.status-badge.inactive {
    background: #ddd;
    color: #666;
}

@media (max-width: 1200px) {
    .systems-layout {
        grid-template-columns: 1fr;
    }
    
    .help-grid {
        grid-template-columns: 1fr;
    }
    
    .monitored-grid {
        grid-template-columns: 1fr;
    }
    
    .danger-action-group {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .input-with-button {
        min-width: auto;
        width: 100%;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .monitored-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-select-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .danger-actions {
        gap: 15px;
    }
    
    .danger-action-group {
        padding: 12px;
    }
    
    .input-with-button {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    let searchTimeout;
    let regionSearchTimeout;
    
    // Region search functionality
    $('#region-search').on('input', function() {
        const query = $(this).val().trim();
        
        clearTimeout(regionSearchTimeout);
        
        if (query.length < 2) {
            $('#region-search-results').hide();
            return;
        }
        
        regionSearchTimeout = setTimeout(function() {
            searchRegions(query);
        }, 300);
    });
    
    function searchRegions(query) {
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_search_regions',
                nonce: eveKillfeedAjax.nonce,
                query: query
            },
            success: function(response) {
                if (response.success && response.data) {
                    showRegionSearchResults(response.data);
                } else {
                    $('#region-search-results').hide();
                }
            },
            error: function() {
                $('#region-search-results').hide();
            }
        });
    }
    
    function showRegionSearchResults(regions) {
        if (regions.length === 0) {
            $('#region-search-results').hide();
            return;
        }
        
        let html = '';
        regions.forEach(function(region) {
            const isMonitored = region.is_monitored == 1;
            
            html += '<div class="search-result-item ' + (isMonitored ? 'monitored' : '') + '" data-region-name="' + region.region_name + '">';
            html += '<div>';
            html += '<div style="font-weight: 600;">' + region.region_name + '</div>';
            html += '<div style="font-size: 12px; color: #666;">';
            html += (region.description || 'EVE Online region');
            if (isMonitored) {
                html += ' <span style="color: #46b450; font-weight: bold;">✓ Monitored</span>';
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        
        $('#region-search-results').html(html).show();
    }
    
    // Handle region search result clicks
    $(document).on('click', '#region-search-results .search-result-item', function() {
        const regionName = $(this).data('region-name');
        const isMonitored = $(this).hasClass('monitored');
        
        if (isMonitored) {
            removeRegionFromMonitoring(regionName);
        } else {
            addRegionToMonitoring(regionName);
        }
    });
    
    // Handle remove region clicks
    $(document).on('click', '.remove-region-btn', function(e) {
        e.stopPropagation();
        const regionName = $(this).data('region');
        removeRegionFromMonitoring(regionName);
    });
    
    function addRegionToMonitoring(regionName) {
        updateRegionMonitoring(regionName, true);
    }
    
    function removeRegionFromMonitoring(regionName) {
        updateRegionMonitoring(regionName, false);
    }
    
    function updateRegionMonitoring(regionName, monitor) {
        // Get current regions
        let currentRegions = [];
        $('.monitored-region .region-name').each(function() {
            const name = $(this).text().trim();
            if (name !== regionName) {
                currentRegions.push(name);
            }
        });
        
        // Add or remove the region
        if (monitor && currentRegions.indexOf(regionName) === -1) {
            currentRegions.push(regionName);
        }
        
        // Save updated list
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_save_regions',
                nonce: eveKillfeedAjax.nonce,
                regions: currentRegions
            },
            success: function(response) {
                if (response.success) {
                    // Reload page to show updated state
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to update regions');
            }
        });
    }
    
    // Clear all monitored regions
    $('#clear-monitored-regions').on('click', function() {
        if (!confirm('Are you sure you want to clear ALL monitored regions? This will stop monitoring all regions until you add new ones.')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.text('Clearing...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_clear_monitored_regions',
                nonce: eveKillfeedAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.message);
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('Error: Failed to clear monitored regions');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
    // Clear all regions
    $('#clear-all-regions').on('click', function() {
        if (confirm('Are you sure you want to clear all monitored regions?')) {
            updateRegionsPreset([]);
        }
    });
    
    function updateRegionsPreset(regions) {
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_save_regions',
                nonce: eveKillfeedAjax.nonce,
                regions: regions
            },
            success: function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to update regions');
            }
        });
    }
    
    // Region preset buttons
    $(document).on('click', '.region-preset-btn', function() {
        const preset = $(this).data('preset');
        loadRegionPreset(preset);
    });
    
    function loadRegionPreset(preset) {
        const presets = {
            'trade-regions': ['The Forge', 'Domain', 'Sinq Laison', 'Heimatar', 'Metropolis'],
            'pvp-regions': ['Black Rise', 'Placid', 'Genesis', 'The Bleak Lands', 'Molden Heath'],
            'null-regions': ['Delve', 'Fountain', 'Catch', 'Providence', 'Querious'],
            'npc-regions': ['Curse', 'Syndicate', 'Stain', 'Venal', 'Great Wildlands']
        };
        
        if (presets[preset]) {
            updateRegionsPreset(presets[preset]);
        }
    }
    
    // Import all regions
    $('#import-all-regions').on('click', function() {
        if (!confirm('This will import all EVE regions from ESI. Continue?')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.text('Importing...').prop('disabled', true);
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_import_regions',
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
                alert('Error: Failed to import regions');
            },
            complete: function() {
                button.text(originalText).prop('disabled', false);
            }
        });
    });
    
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
    
    // Import missing system
    $('#import-missing-system-btn').on('click', function() {
        const systemName = $('#missing-system-input').val().trim();
        
        if (!systemName) {
            alert('Please enter a system name to import');
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Checking ESI...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_check_and_add_system',
                nonce: eveKillfeedAjax.nonce,
                system_name: systemName
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.message);
                    $('#missing-system-input').val('');
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to check and import system');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // Allow Enter key in missing system input
    $('#missing-system-input').on('keypress', function(e) {
        if (e.which === 13) {
            $('#import-missing-system-btn').click();
        }
    });
    
    // Force clear systems
    $('#force-clear-systems').on('click', function() {
        if (!confirm('This will REMOVE ALL SYSTEMS from the database and repopulate with fresh data. Your current monitored systems will be reset. This cannot be undone. Continue?')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Clearing & Repopulating...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_force_clear_systems',
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
                alert('Error: Failed to clear systems');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // System search functionality
    $('#system-search').on('input', function() {
        const query = $(this).val().trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            $('#system-search-results').hide();
            return;
        }
        
        searchTimeout = setTimeout(function() {
            searchSystems(query);
        }, 300);
    });
    
    // Hide search results when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $('#system-search-results, #region-search-results').hide();
        }
    });
    
    function searchSystems(query) {
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_search_systems',
                nonce: eveKillfeedAjax.nonce,
                query: query
            },
            success: function(response) {
                if (response.success && response.data) {
                    showSearchResults(response.data);
                } else {
                    $('#system-search-results').hide();
                }
            },
            error: function() {
                $('#system-search-results').hide();
            }
        });
    }
    
    function showSearchResults(systems) {
        if (systems.length === 0) {
            $('#system-search-results').hide();
            return;
        }
        
        let html = '';
        systems.forEach(function(system) {
            const isMonitored = system.is_monitored == 1;
            
            html += '<div class="search-result-item ' + (isMonitored ? 'monitored' : '') + '" data-system-name="' + system.system_name + '">';
            html += '<div>';
            html += '<div style="font-weight: 600;">' + system.system_name + '</div>';
            html += '<div style="font-size: 12px; color: #666;">';
            html += '<span class="security-badge ' + (system.security_class || 'unknown') + '">' + 
                    (system.security_status !== undefined ? parseFloat(system.security_status).toFixed(1) : 'Unknown') + '</span> ';
            html += (system.region_name || 'Unknown Region');
            if (isMonitored) {
                html += ' <span style="color: #46b450; font-weight: bold;">✓ Monitored</span>';
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        
        $('#system-search-results').html(html).show();
    }
    
    // Handle search result clicks
    $(document).on('click', '#system-search-results .search-result-item', function() {
        const systemName = $(this).data('system-name');
        const isMonitored = $(this).hasClass('monitored');
        
        if (isMonitored) {
            removeSystemFromMonitoring(systemName);
        } else {
            addSystemToMonitoring(systemName);
        }
    });
    
    // Handle quick select clicks
    $(document).on('click', '.quick-select-btn', function() {
        const systemName = $(this).data('system');
        addSystemToMonitoring(systemName);
    });
    
    // Handle remove system clicks
    $(document).on('click', '.remove-system-btn', function(e) {
        e.stopPropagation();
        const systemName = $(this).data('system');
        removeSystemFromMonitoring(systemName);
    });
    
    // Check if system exists and add to DB
    $('#check-system-exists').on('click', function() {
        const query = $('#system-search').val().trim();
        
        if (!query) {
            alert('Please enter a system name to check');
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Checking ESI...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_check_and_add_system',
                nonce: eveKillfeedAjax.nonce,
                system_name: query
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: ' + response.message);
                    // Clear search and refresh
                    $('#system-search').val('');
                    $('#system-search-results').hide();
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to check system');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    function addSystemToMonitoring(systemName) {
        updateSystemMonitoring(systemName, true);
    }
    
    function removeSystemFromMonitoring(systemName) {
        updateSystemMonitoring(systemName, false);
    }
    
    function updateSystemMonitoring(systemName, monitor) {
        // Get current systems
        let currentSystems = [];
        $('.monitored-system .system-name').each(function() {
            const name = $(this).text().trim();
            if (name !== systemName) {
                currentSystems.push(name);
            }
        });
        
        // Add or remove the system
        if (monitor && currentSystems.indexOf(systemName) === -1) {
            currentSystems.push(systemName);
        }
        
        // Save updated list
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_save_systems',
                nonce: eveKillfeedAjax.nonce,
                systems: currentSystems
            },
            success: function(response) {
                if (response.success) {
                    // Update recently tracked
                    updateRecentlyTracked(systemName);
                    // Reload page to show updated state
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to update systems');
            }
        });
    }
    
    function updateRecentlyTracked(systemName) {
        // This would typically be handled server-side
        // For now, we'll just reload to get the updated state
    }
    
    // Preset buttons
    $(document).on('click', '.preset-btn', function() {
        const preset = $(this).data('preset');
        loadPreset(preset);
    });
    
    function loadPreset(preset) {
        const presets = {
            'trade-hubs': ['Jita', 'Amarr', 'Dodixie', 'Rens', 'Hek'],
            'pvp-hotspots': ['Tama', 'Amamake', 'Rancer', 'EFM-C4'],
            'faction-warfare': ['Tama', 'Kamela', 'Kedama', 'Nennamaila'],
            'lowsec-roam': ['Amamake', 'Rancer', 'Old Man Star', 'Tama'],
            'wormhole': ['EFM-C4'],
            'null-staging': ['1DQ1-A', 'T5ZI-S', 'FWST-8', 'O-EIMK']
        };
        
        if (presets[preset]) {
            updateSystemsPreset(presets[preset]);
        }
    }
    
    function updateSystemsPreset(systems) {
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
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to update systems');
            }
        });
    }
    
    // Clear all systems
    $('#clear-all-systems').on('click', function() {
        if (confirm('Are you sure you want to clear all monitored systems?')) {
            updateSystemsPreset([]);
        }
    });
    
    // Fetch now
    $('#fetch-now').on('click', function() {
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
    
    // Fetch regions now
    $('#fetch-regions-now').on('click', function() {
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
    
    // New session
    $('#new-session').on('click', function() {
        if (!confirm('This will:\n• Clear ALL killmail data\n• Clear ALL monitored systems\n• Clear ALL monitored regions\n• Start completely fresh\n\nThis cannot be undone. Continue?')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Resetting...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_new_session',
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
                alert('Error: Failed to start new session');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
});
</script>