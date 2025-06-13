<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$database = EVE_Killfeed_Database::get_instance();
$stats = $database->get_statistics();
$cron_status = EVE_Killfeed_Cron::get_cron_status();
$systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
$monitored_systems = $systems_manager->get_monitored_systems();
$monitored_regions = $systems_manager->get_monitored_regions();
$api_status = get_option('eve_killfeed_api_status', array());
$last_fetch = get_option('eve_killfeed_last_fetch', array());

// Format ISK values
function format_isk($value) {
    if ($value >= 1000000000000) {
        return number_format($value / 1000000000000, 2) . 'T';
    } elseif ($value >= 1000000000) {
        return number_format($value / 1000000000, 2) . 'B';
    } elseif ($value >= 1000000) {
        return number_format($value / 1000000, 2) . 'M';
    } elseif ($value >= 1000) {
        return number_format($value / 1000, 1) . 'K';
    } else {
        return number_format($value);
    }
}

// Get current cron schedule
$current_interval = get_option('eve_killfeed_fetch_interval', 3);
$cron_intervals = array(
    1 => '1 minute',
    2 => '2 minutes', 
    3 => '3 minutes',
    5 => '5 minutes',
    10 => '10 minutes',
    15 => '15 minutes',
    30 => '30 minutes',
    60 => '1 hour'
);

$is_cron_scheduled = $cron_status['is_scheduled'] ?? false;
?>

<div class="wrap">
    <h1><?php _e('EVE Killfeed Dashboard', 'eve-killfeed'); ?></h1>
    
    <div class="dashboard-grid">
        <!-- System Status -->
        <div class="dashboard-card">
            <h2><?php _e('System Status', 'eve-killfeed'); ?></h2>
            <div class="status-grid">
                <div class="status-item">
                    <div class="status-indicator <?php echo $is_cron_scheduled ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('Cron Jobs', 'eve-killfeed'); ?></span>
                        <span class="status-value"><?php echo $is_cron_scheduled ? 'Active' : 'Stopped'; ?></span>
                    </div>
                </div>
                
                <div class="status-item">
                    <div class="status-indicator <?php echo !empty($last_fetch) ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('Last Fetch', 'eve-killfeed'); ?></span>
                        <span class="status-value">
                            <?php 
                            if (!empty($last_fetch['time'])) {
                                $time_diff = time() - strtotime($last_fetch['time']);
                                echo $time_diff < 300 ? 'Recent' : human_time_diff(strtotime($last_fetch['time'])) . ' ago';
                            } else {
                                echo 'Never';
                            }
                            ?>
                        </span>
                    </div>
                </div>
                
                <div class="status-item">
                    <div class="status-indicator <?php echo count($monitored_systems) > 0 ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('Monitored Systems', 'eve-killfeed'); ?></span>
                        <span class="status-value"><?php echo count($monitored_systems); ?></span>
                    </div>
                </div>
                
                <div class="status-item">
                    <div class="status-indicator <?php echo count($monitored_regions) > 0 ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('Monitored Regions', 'eve-killfeed'); ?></span>
                        <span class="status-value"><?php echo count($monitored_regions); ?></span>
                    </div>
                </div>
                
                <div class="status-item">
                    <div class="status-indicator <?php echo ($api_status['esi_status'] ?? false) && ($api_status['zkb_status'] ?? false) ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('API Status', 'eve-killfeed'); ?></span>
                        <span class="status-value">
                            <?php echo ($api_status['esi_status'] ?? false) && ($api_status['zkb_status'] ?? false) ? 'Online' : 'Issues'; ?>
                        </span>
                    </div>
                </div>
                
                <div class="status-item">
                    <div class="status-indicator <?php echo (count($monitored_systems) + count($monitored_regions)) > 0 ? 'online' : 'offline'; ?>"></div>
                    <div class="status-info">
                        <span class="status-label"><?php _e('Total Monitoring', 'eve-killfeed'); ?></span>
                        <span class="status-value"><?php echo count($monitored_systems) + count($monitored_regions); ?> locations</span>
                    </div>
                </div>
            </div>
            
            <!-- Cron Schedule Control -->
            <div class="cron-schedule-control">
                <h4><?php _e('Auto-Fetch Schedule', 'eve-killfeed'); ?></h4>
                <div class="schedule-controls">
                    <label for="cron-interval"><?php _e('Fetch Interval:', 'eve-killfeed'); ?></label>
                    <select id="cron-interval" <?php echo !$is_cron_scheduled ? 'disabled' : ''; ?>>
                        <?php foreach ($cron_intervals as $minutes => $label): ?>
                            <option value="<?php echo $minutes; ?>" <?php selected($current_interval, $minutes); ?>>
                                <?php echo $label; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    
                    <?php if ($is_cron_scheduled): ?>
                        <button type="button" class="btn-small primary" id="update-cron-schedule">
                            <?php _e('Update Schedule', 'eve-killfeed'); ?>
                        </button>
                        <button type="button" class="btn-small danger" id="stop-cron-schedule">
                            <?php _e('Stop Schedule', 'eve-killfeed'); ?>
                        </button>
                    <?php else: ?>
                        <button type="button" class="btn-small primary" id="start-cron-schedule">
                            <?php _e('Start Schedule', 'eve-killfeed'); ?>
                        </button>
                    <?php endif; ?>
                </div>
                <div class="schedule-info">
                    <small>
                        <?php if ($is_cron_scheduled): ?>
                            <?php _e('Next fetch:', 'eve-killfeed'); ?> 
                            <strong><?php echo $cron_status['next_fetch']; ?></strong>
                        <?php else: ?>
                            <strong style="color: #dc3232;"><?php _e('Automatic fetching is currently stopped', 'eve-killfeed'); ?></strong>
                        <?php endif; ?>
                    </small>
                </div>
            </div>
        </div>
        
        <!-- Last Fetch Results -->
        <div class="dashboard-card">
            <h2><?php _e('Last Fetch Results', 'eve-killfeed'); ?></h2>
            <?php if (!empty($last_fetch)): ?>
                <div class="fetch-stats">
                    <div class="fetch-stat">
                        <span class="fetch-number"><?php echo $last_fetch['new_kills'] ?? 0; ?></span>
                        <span class="fetch-label"><?php _e('New Killmails', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="fetch-stat">
                        <span class="fetch-number"><?php echo $last_fetch['total_processed'] ?? 0; ?></span>
                        <span class="fetch-label"><?php _e('Total Processed', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="fetch-stat">
                        <span class="fetch-number"><?php echo $last_fetch['execution_time'] ?? 0; ?>s</span>
                        <span class="fetch-label"><?php _e('Execution Time', 'eve-killfeed'); ?></span>
                    </div>
                    <div class="fetch-stat">
                        <span class="fetch-number"><?php echo $last_fetch['errors'] ?? 0; ?></span>
                        <span class="fetch-label"><?php _e('Errors', 'eve-killfeed'); ?></span>
                    </div>
                </div>
                <div class="fetch-time">
                    <small><?php _e('Last fetch:', 'eve-killfeed'); ?> <?php echo $last_fetch['time'] ?? 'Unknown'; ?></small>
                </div>
                
                <!-- Enhanced Fetch Details -->
                <?php if (!empty($last_fetch['locations'])): ?>
                    <div class="fetch-details">
                        <h4><?php _e('Location Results:', 'eve-killfeed'); ?></h4>
                        <div class="location-results">
                            <?php foreach ($last_fetch['locations'] as $location => $result): ?>
                                <div class="location-result <?php echo $result['error'] ? 'error' : 'success'; ?>">
                                    <span class="location-name">
                                        <?php echo esc_html($location); ?>
                                        <span class="location-type">(<?php echo $result['type'] === 'region' ? 'Region' : 'System'; ?>)</span>
                                    </span>
                                    <span class="location-stats">
                                        <?php echo $result['new']; ?> new / <?php echo $result['processed']; ?> processed
                                        <?php if (isset($result['time'])): ?>
                                            <small>(<?php echo $result['time']; ?>s)</small>
                                        <?php endif; ?>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <p class="no-data"><?php _e('No fetch data available. Click "Fetch Killmails Now" to get started.', 'eve-killfeed'); ?></p>
            <?php endif; ?>
        </div>
        
        <!-- Monitored Locations -->
        <div class="dashboard-card">
            <h2><?php _e('Monitored Locations', 'eve-killfeed'); ?></h2>
            
            <?php if (!empty($monitored_systems) || !empty($monitored_regions)): ?>
                <!-- Systems Section -->
                <?php if (!empty($monitored_systems)): ?>
                    <div class="monitored-section">
                        <h4><?php _e('Systems', 'eve-killfeed'); ?> (<?php echo count($monitored_systems); ?>)</h4>
                        <div class="monitored-items">
                            <?php foreach (array_slice($monitored_systems, 0, 8) as $system): ?>
                                <div class="monitored-item system">
                                    <span class="item-name"><?php echo esc_html($system['system_name']); ?></span>
                                    <span class="item-meta">
                                        <span class="security-badge <?php echo esc_attr($system['security_class']); ?>">
                                            <?php echo number_format($system['security_status'], 1); ?>
                                        </span>
                                        <span class="region"><?php echo esc_html($system['region_name']); ?></span>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                            <?php if (count($monitored_systems) > 8): ?>
                                <div class="more-items">
                                    +<?php echo count($monitored_systems) - 8; ?> more systems
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
                
                <!-- Regions Section -->
                <?php if (!empty($monitored_regions)): ?>
                    <div class="monitored-section">
                        <h4><?php _e('Regions', 'eve-killfeed'); ?> (<?php echo count($monitored_regions); ?>)</h4>
                        <div class="monitored-items">
                            <?php foreach (array_slice($monitored_regions, 0, 8) as $region): ?>
                                <div class="monitored-item region">
                                    <span class="item-name"><?php echo esc_html($region['region_name']); ?></span>
                                    <span class="item-meta">
                                        <span class="region-desc"><?php echo esc_html($region['description']); ?></span>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                            <?php if (count($monitored_regions) > 8): ?>
                                <div class="more-items">
                                    +<?php echo count($monitored_regions) - 8; ?> more regions
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
                
                <div class="monitored-actions">
                    <a href="<?php echo admin_url('admin.php?page=eve-killfeed-systems'); ?>" class="button button-secondary">
                        <?php _e('Manage Systems & Regions', 'eve-killfeed'); ?>
                    </a>
                </div>
            <?php else: ?>
                <div class="no-monitoring">
                    <div class="no-monitoring-icon">🎯</div>
                    <h3><?php _e('No locations monitored', 'eve-killfeed'); ?></h3>
                    <p><?php _e('Add systems or regions to start monitoring killmails.', 'eve-killfeed'); ?></p>
                    <a href="<?php echo admin_url('admin.php?page=eve-killfeed-systems'); ?>" class="button button-primary">
                        <?php _e('Add Systems & Regions', 'eve-killfeed'); ?>
                    </a>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Biggest Kills (24h) -->
        <div class="dashboard-card">
            <h2><?php _e('Biggest Kills (24h)', 'eve-killfeed'); ?></h2>
            <?php if (!empty($stats['biggest_kills'])): ?>
                <div class="biggest-kills">
                    <?php foreach (array_slice($stats['biggest_kills'], 0, 5) as $kill): ?>
                        <div class="kill-item">
                            <div class="kill-info">
                                <span class="kill-ship"><?php echo esc_html($kill['ship_name']); ?></span>
                                <span class="kill-location">
                                    <?php echo esc_html($kill['system_name']); ?>
                                    <?php if (!empty($kill['region_name']) && $kill['region_name'] !== 'Unknown Region'): ?>
                                        <small>(<?php echo esc_html($kill['region_name']); ?>)</small>
                                    <?php endif; ?>
                                </span>
                            </div>
                            <div class="kill-value">
                                <span class="kill-amount"><?php echo format_isk($kill['total_value']); ?> ISK</span>
                                <a href="<?php echo esc_url($kill['zkb_url']); ?>" target="_blank" class="kill-link">zKB</a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="no-data"><?php _e('No killmails in the last 24 hours.', 'eve-killfeed'); ?></p>
            <?php endif; ?>
        </div>
        
        <!-- Frontend Integration Info -->
        <div class="dashboard-card">
            <h2><?php _e('Frontend Integration', 'eve-killfeed'); ?></h2>
            <div class="integration-links">
                <div class="integration-item">
                    <label><?php _e('Vue.js Frontend:', 'eve-killfeed'); ?></label>
                    <input type="text" readonly value="<?php echo home_url('/killfeed/?api_url=' . urlencode(home_url('/wp-json/eve-killfeed/v1'))); ?>" class="integration-url">
                </div>
                
                <div class="integration-item">
                    <label><?php _e('OBS Browser Source:', 'eve-killfeed'); ?></label>
                    <input type="text" readonly value="<?php echo home_url('/killfeed/?obs=1&theme=dark&api_url=' . urlencode(home_url('/wp-json/eve-killfeed/v1'))); ?>" class="integration-url">
                </div>
                
                <div class="integration-item">
                    <label><?php _e('REST API Endpoint:', 'eve-killfeed'); ?></label>
                    <input type="text" readonly value="<?php echo home_url('/wp-json/eve-killfeed/v1/killmails'); ?>" class="integration-url">
                </div>
                
                <div class="integration-item">
                    <label><?php _e('Regions API Endpoint:', 'eve-killfeed'); ?></label>
                    <input type="text" readonly value="<?php echo home_url('/wp-json/eve-killfeed/v1/regions'); ?>" class="integration-url">
                </div>
            </div>
            
            <div class="integration-help">
                <p><strong><?php _e('Quick Setup:', 'eve-killfeed'); ?></strong></p>
                <ul>
                    <li>📺 Copy OBS URL to Browser Source</li>
                    <li>🌐 Use Vue.js URL for web display</li>
                    <li>🔗 API endpoints for custom integrations</li>
                    <li>🌍 Region monitoring for broader coverage</li>
                </ul>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="dashboard-card">
            <h2><?php _e('Quick Actions', 'eve-killfeed'); ?></h2>
            <div class="quick-actions">
                <button type="button" class="action-button primary" id="manual-fetch">
                    <span class="action-icon">🔄</span>
                    <span class="action-text"><?php _e('Fetch Killmails Now', 'eve-killfeed'); ?></span>
                </button>
                
                <button type="button" class="action-button secondary" id="test-apis">
                    <span class="action-icon">🔍</span>
                    <span class="action-text"><?php _e('Test APIs', 'eve-killfeed'); ?></span>
                </button>
                
                <button type="button" class="action-button warning" id="clear-unknown-data">
                    <span class="action-icon">🧹</span>
                    <span class="action-text"><?php _e('Clear "Unknown" Data', 'eve-killfeed'); ?></span>
                </button>
                
                <button type="button" class="action-button danger" id="new-session">
                    <span class="action-icon">🆕</span>
                    <span class="action-text"><?php _e('New Session', 'eve-killfeed'); ?></span>
                </button>
            </div>
            
            <div class="actions-help">
                <p><strong><?php _e('Actions:', 'eve-killfeed'); ?></strong></p>
                <ul>
                    <li><strong>Fetch:</strong> Get latest killmails now</li>
                    <li><strong>Test:</strong> Check API connectivity</li>
                    <li><strong>Clear Unknown:</strong> Remove incomplete data</li>
                    <li><strong>New Session:</strong> Fresh start (clears all data & monitoring)</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.dashboard-card {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dashboard-card h2 {
    margin: 0 0 15px 0;
    color: #1d2327;
    font-size: 18px;
    border-bottom: 2px solid #0073aa;
    padding-bottom: 8px;
}

/* System Status */
.status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-indicator.online {
    background: #46b450;
    box-shadow: 0 0 0 2px rgba(70, 180, 80, 0.2);
}

.status-indicator.offline {
    background: #dc3232;
    box-shadow: 0 0 0 2px rgba(220, 50, 50, 0.2);
}

.status-info {
    display: flex;
    flex-direction: column;
}

.status-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
}

.status-value {
    font-weight: 600;
    color: #1d2327;
}

/* Cron Schedule Control */
.cron-schedule-control {
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
}

.cron-schedule-control h4 {
    margin: 0 0 10px 0;
    color: #1d2327;
    font-size: 14px;
}

.schedule-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.schedule-controls label {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
}

.schedule-controls select {
    padding: 4px 8px;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    font-size: 13px;
}

.schedule-controls select:disabled {
    background: #f0f0f0;
    color: #999;
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

.btn-small.danger {
    background: #dc3232;
    color: white;
}

.btn-small.danger:hover {
    background: #c62d2d;
}

.schedule-info {
    color: #666;
    font-size: 12px;
}

/* Fetch Results */
.fetch-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 15px;
}

.fetch-stat {
    text-align: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 6px;
}

.fetch-number {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #0073aa;
    margin-bottom: 5px;
}

.fetch-label {
    font-size: 12px;
    color: #666;
}

.fetch-time {
    text-align: center;
    color: #666;
    margin-bottom: 15px;
}

/* Fetch Details */
.fetch-details h4 {
    margin: 15px 0 10px 0;
    color: #1d2327;
    font-size: 14px;
}

.location-results {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.location-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f9f9f9;
    border-radius: 4px;
    border-left: 4px solid #46b450;
}

.location-result.error {
    border-left-color: #dc3232;
    background: #fef7f7;
}

.location-name {
    font-weight: 600;
    color: #1d2327;
}

.location-type {
    font-weight: normal;
    color: #666;
    font-size: 12px;
}

.location-stats {
    font-size: 12px;
    color: #666;
}

/* Monitored Locations */
.monitored-section {
    margin-bottom: 20px;
}

.monitored-section h4 {
    margin: 0 0 10px 0;
    color: #1d2327;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 5px;
}

.monitored-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
}

.monitored-item {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    background: #f9f9f9;
    border-radius: 4px;
    border-left: 4px solid #0073aa;
}

.monitored-item.region {
    border-left-color: #ff6b35;
}

.item-name {
    font-weight: 600;
    color: #1d2327;
    margin-bottom: 4px;
}

.item-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
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

.region {
    color: #666;
}

.region-desc {
    color: #666;
    font-style: italic;
}

.more-items {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background: #f0f0f0;
    border-radius: 4px;
    color: #666;
    font-size: 12px;
    font-style: italic;
}

.monitored-actions {
    margin-top: 15px;
    text-align: center;
}

.no-monitoring {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.no-monitoring-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.no-monitoring h3 {
    margin: 0 0 10px 0;
    color: #1d2327;
}

/* Biggest Kills */
.biggest-kills {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.kill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
    border-left: 4px solid #ff6b35;
}

.kill-info {
    display: flex;
    flex-direction: column;
}

.kill-ship {
    font-weight: 600;
    color: #1d2327;
    margin-bottom: 2px;
}

.kill-location {
    font-size: 12px;
    color: #666;
}

.kill-location small {
    color: #999;
}

.kill-value {
    display: flex;
    align-items: center;
    gap: 8px;
}

.kill-amount {
    font-weight: bold;
    color: #ff6b35;
}

.kill-link {
    background: #ff6b35;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 11px;
}

/* Integration */
.integration-links {
    margin-bottom: 15px;
}

.integration-item {
    margin-bottom: 12px;
}

.integration-item label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #1d2327;
}

.integration-url {
    width: 100%;
    padding: 8px;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    background: #f9f9f9;
    font-family: monospace;
    font-size: 12px;
}

.integration-help ul {
    margin: 10px 0 0 20px;
}

.integration-help li {
    margin-bottom: 5px;
    font-size: 14px;
}

/* Quick Actions */
.quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 15px;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: left;
}

.action-button.primary {
    background: #0073aa;
    color: white;
}

.action-button.primary:hover {
    background: #005a87;
}

.action-button.secondary {
    background: #f0f0f1;
    color: #1d2327;
}

.action-button.secondary:hover {
    background: #dcdcde;
}

.action-button.warning {
    background: #ff9800;
    color: white;
}

.action-button.warning:hover {
    background: #e68900;
}

.action-button.danger {
    background: #dc3232;
    color: white;
}

.action-button.danger:hover {
    background: #c62d2d;
}

.action-icon {
    font-size: 16px;
}

.action-text {
    font-size: 14px;
}

.actions-help ul {
    margin: 10px 0 0 20px;
}

.actions-help li {
    margin-bottom: 5px;
    font-size: 13px;
}

.no-data {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
}

@media (max-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .status-grid {
        grid-template-columns: 1fr;
    }
    
    .fetch-stats {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .quick-actions {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .fetch-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .schedule-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .monitored-items {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
jQuery(document).ready(function($) {
    // Update cron schedule
    $('#update-cron-schedule').on('click', function() {
        var button = $(this);
        var originalText = button.text();
        var interval = $('#cron-interval').val();
        
        button.prop('disabled', true).text('Updating...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_update_cron_schedule',
                nonce: eveKillfeedAjax.nonce,
                interval: interval
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
                alert('Error: Failed to update cron schedule');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // Start cron schedule
    $('#start-cron-schedule').on('click', function() {
        var button = $(this);
        var originalText = button.text();
        var interval = $('#cron-interval').val();
        
        button.prop('disabled', true).text('Starting...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_update_cron_schedule',
                nonce: eveKillfeedAjax.nonce,
                interval: interval
            },
            success: function(response) {
                if (response.success) {
                    alert('Success: Cron schedule started');
                    location.reload();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to start cron schedule');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // Stop cron schedule
    $('#stop-cron-schedule').on('click', function() {
        if (!confirm('Are you sure you want to stop the automatic fetch schedule? You will need to manually fetch killmails or restart the schedule.')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.text();
        
        button.prop('disabled', true).text('Stopping...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_stop_cron_schedule',
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
                alert('Error: Failed to stop cron schedule');
            },
            complete: function() {
                button.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // Manual fetch killmails
    $('#manual-fetch').on('click', function() {
        var button = $(this);
        var originalText = button.find('.action-text').text();
        
        button.prop('disabled', true);
        button.find('.action-text').text('Fetching...');
        
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
                button.prop('disabled', false);
                button.find('.action-text').text(originalText);
            }
        });
    });
    
    // Test APIs
    $('#test-apis').on('click', function() {
        var button = $(this);
        var originalText = button.find('.action-text').text();
        
        button.prop('disabled', true);
        button.find('.action-text').text('Testing...');
        
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
                    message += 'Region Lookup: ' + (data.region_lookup ? 'Working' : 'Failed') + '\n';
                    message += 'Killmail Fetch: ' + (data.killmail_fetch ? 'Working' : 'Failed') + '\n';
                    
                    if (data.errors && data.errors.length > 0) {
                        message += '\nErrors:\n' + data.errors.join('\n');
                    }
                    
                    alert(message);
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Failed to test APIs');
            },
            complete: function() {
                button.prop('disabled', false);
                button.find('.action-text').text(originalText);
            }
        });
    });
    
    // Clear unknown data
    $('#clear-unknown-data').on('click', function() {
        if (!confirm('This will remove all killmails with "Unknown" pilot names, ship names, or corporation names. Continue?')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.find('.action-text').text();
        
        button.prop('disabled', true);
        button.find('.action-text').text('Clearing...');
        
        $.ajax({
            url: eveKillfeedAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'eve_killfeed_clear_unknown_data',
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
                alert('Error: Failed to clear unknown data');
            },
            complete: function() {
                button.prop('disabled', false);
                button.find('.action-text').text(originalText);
            }
        });
    });
    
    // New session
    $('#new-session').on('click', function() {
        if (!confirm('This will:\n• Clear ALL killmail data\n• Reset to NO monitored systems or regions\n• Start completely fresh\n\nThis cannot be undone. Continue?')) {
            return;
        }
        
        var button = $(this);
        var originalText = button.find('.action-text').text();
        
        button.prop('disabled', true);
        button.find('.action-text').text('Resetting...');
        
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
                button.prop('disabled', false);
                button.find('.action-text').text(originalText);
            }
        });
    });
    
    // Copy integration URLs on click
    $('.integration-url').on('click', function() {
        $(this).select();
        document.execCommand('copy');
        
        // Show feedback
        var originalBg = $(this).css('background-color');
        $(this).css('background-color', '#d4edda');
        setTimeout(() => {
            $(this).css('background-color', originalBg);
        }, 1000);
    });
});
</script>