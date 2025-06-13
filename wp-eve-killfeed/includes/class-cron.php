<?php
/**
 * Cron job management class with region support
 */

class EVE_Killfeed_Cron {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('eve_killfeed_fetch_killmails', array($this, 'fetch_killmails'));
        add_action('eve_killfeed_cleanup_old_data', array($this, 'cleanup_old_data'));
        add_action('eve_killfeed_test_apis', array($this, 'test_api_connectivity'));
    }
    
    /**
     * Schedule cron jobs with dynamic intervals
     */
    public static function schedule_cron() {
        // Get the configured interval
        $interval_minutes = get_option('eve_killfeed_fetch_interval', 3);
        
        // Clear existing cron first
        self::clear_cron();
        
        // Schedule fetch killmails with dynamic interval
        if (!wp_next_scheduled('eve_killfeed_fetch_killmails')) {
            $interval_name = "eve_killfeed_{$interval_minutes}min";
            $scheduled = wp_schedule_event(time(), $interval_name, 'eve_killfeed_fetch_killmails');
            
            if ($scheduled === false) {
                EVE_Killfeed_Database::log('error', "Failed to schedule cron job with interval {$interval_name}");
            } else {
                EVE_Killfeed_Database::log('info', "Scheduled cron job with interval {$interval_name}");
            }
        }
        
        // Cleanup old data daily
        if (!wp_next_scheduled('eve_killfeed_cleanup_old_data')) {
            $scheduled = wp_schedule_event(time(), 'daily', 'eve_killfeed_cleanup_old_data');
            
            if ($scheduled === false) {
                EVE_Killfeed_Database::log('error', 'Failed to schedule daily cleanup job');
            } else {
                EVE_Killfeed_Database::log('info', 'Scheduled daily cleanup job');
            }
        }
        
        // Test API connectivity every hour
        if (!wp_next_scheduled('eve_killfeed_test_apis')) {
            $scheduled = wp_schedule_event(time(), 'hourly', 'eve_killfeed_test_apis');
            
            if ($scheduled === false) {
                EVE_Killfeed_Database::log('error', 'Failed to schedule hourly API test job');
            } else {
                EVE_Killfeed_Database::log('info', 'Scheduled hourly API test job');
            }
        }
    }
    
    /**
     * Clear cron jobs
     */
    public static function clear_cron() {
        wp_clear_scheduled_hook('eve_killfeed_fetch_killmails');
        wp_clear_scheduled_hook('eve_killfeed_cleanup_old_data');
        wp_clear_scheduled_hook('eve_killfeed_test_apis');
        
        EVE_Killfeed_Database::log('info', 'Cleared all scheduled cron jobs');
    }
    
    /**
     * Stop cron schedule completely
     */
    public static function stop_cron_schedule() {
        // Clear all scheduled hooks
        self::clear_cron();
        
        // Log the action
        EVE_Killfeed_Database::log('info', 'All cron schedules stopped');
        
        return true;
    }
    
    /**
     * Check if cron is currently scheduled
     */
    public static function is_cron_scheduled() {
        return wp_next_scheduled('eve_killfeed_fetch_killmails') !== false;
    }
    
    /**
     * Add custom cron intervals
     */
    public static function add_cron_intervals($schedules) {
        // Add all possible intervals
        $intervals = array(1, 2, 3, 5, 10, 15, 30, 60);
        
        foreach ($intervals as $minutes) {
            $schedules["eve_killfeed_{$minutes}min"] = array(
                'interval' => $minutes * 60,
                'display' => sprintf(__('Every %d minutes', 'eve-killfeed'), $minutes)
            );
        }
        
        return $schedules;
    }
    
    /**
     * Fetch killmails from zKillboard (enhanced with region support)
     */
    public static function fetch_killmails() {
        $start_time = microtime(true);
        
        try {
            // Get monitored systems and regions from the systems manager
            $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
            $monitored_systems = $systems_manager->get_monitored_systems();
            $monitored_regions = $systems_manager->get_monitored_regions();
            
            if (empty($monitored_systems) && empty($monitored_regions)) {
                EVE_Killfeed_Database::log('info', 'No systems or regions configured for monitoring');
                return array('new_kills' => 0, 'message' => 'No systems or regions configured');
            }
            
            $zkb_api = new EVE_Killfeed_ZKillboard_API();
            $database = EVE_Killfeed_Database::get_instance();
            
            $new_kills = 0;
            $total_processed = 0;
            $errors = array();
            $location_results = array();
            
            $total_locations = count($monitored_systems) + count($monitored_regions);
            EVE_Killfeed_Database::log('info', "Starting killmail fetch for " . count($monitored_systems) . " systems and " . count($monitored_regions) . " regions");
            
            // Process systems
            foreach ($monitored_systems as $system) {
                $system_name = $system['system_name'];
                $system_start_time = microtime(true);
                EVE_Killfeed_Database::log('info', "Fetching killmails for system: {$system_name}");
                
                $killmails = $zkb_api->get_system_killmails($system_name, 50); // Limit to 50 per system
                
                if ($killmails === false) {
                    $error_msg = "Failed to fetch killmails for system: {$system_name}";
                    EVE_Killfeed_Database::log('error', $error_msg);
                    $errors[] = $error_msg;
                    $location_results[$system_name] = array('new' => 0, 'processed' => 0, 'error' => true, 'type' => 'system');
                    continue;
                }
                
                if (empty($killmails)) {
                    EVE_Killfeed_Database::log('info', "No killmails found for system: {$system_name}");
                    $location_results[$system_name] = array('new' => 0, 'processed' => 0, 'error' => false, 'type' => 'system');
                    continue;
                }
                
                $system_new_kills = 0;
                $system_processed = 0;
                
                foreach ($killmails as $killmail) {
                    $total_processed++;
                    $system_processed++;
                    
                    // Check if we already have this killmail
                    if ($database->killmail_exists($killmail['killmail_id'])) {
                        continue;
                    }
                    
                    // Insert the killmail
                    if ($database->insert_killmail($killmail)) {
                        $new_kills++;
                        $system_new_kills++;
                        
                        $value_str = number_format($killmail['total_value']);
                        $ship_name = $killmail['ship_name'] !== 'Unknown Ship' ? $killmail['ship_name'] : 'Unknown Ship';
                        $victim_name = $killmail['victim_name'] !== 'Unknown Pilot' ? $killmail['victim_name'] : 'Unknown Pilot';
                        $killer_name = $killmail['killer_name'] !== 'Unknown Killer' ? $killmail['killer_name'] : 'Unknown Killer';
                        
                        EVE_Killfeed_Database::log('info', "Inserted killmail: {$killmail['killmail_id']} in {$system_name} - {$victim_name} ({$ship_name}) killed by {$killer_name} (Value: {$value_str} ISK)");
                    } else {
                        $error_msg = "Failed to insert killmail: {$killmail['killmail_id']}";
                        EVE_Killfeed_Database::log('error', $error_msg);
                        $errors[] = $error_msg;
                    }
                }
                
                $system_time = round(microtime(true) - $system_start_time, 2);
                $location_results[$system_name] = array(
                    'new' => $system_new_kills, 
                    'processed' => $system_processed, 
                    'error' => false,
                    'time' => $system_time,
                    'type' => 'system'
                );
                
                EVE_Killfeed_Database::log('info', "System {$system_name} completed: {$system_new_kills} new from {$system_processed} processed in {$system_time}s");
                
                // Rate limiting - sleep between requests to avoid hitting API limits
                sleep(2);
            }
            
            // Process regions
            foreach ($monitored_regions as $region) {
                $region_name = $region['region_name'];
                $region_start_time = microtime(true);
                EVE_Killfeed_Database::log('info', "Fetching killmails for region: {$region_name}");
                
                $killmails = $zkb_api->get_region_killmails($region_name, 30); // Limit to 30 per region (regions have more activity)
                
                if ($killmails === false) {
                    $error_msg = "Failed to fetch killmails for region: {$region_name}";
                    EVE_Killfeed_Database::log('error', $error_msg);
                    $errors[] = $error_msg;
                    $location_results[$region_name] = array('new' => 0, 'processed' => 0, 'error' => true, 'type' => 'region');
                    continue;
                }
                
                if (empty($killmails)) {
                    EVE_Killfeed_Database::log('info', "No killmails found for region: {$region_name}");
                    $location_results[$region_name] = array('new' => 0, 'processed' => 0, 'error' => false, 'type' => 'region');
                    continue;
                }
                
                $region_new_kills = 0;
                $region_processed = 0;
                
                foreach ($killmails as $killmail) {
                    $total_processed++;
                    $region_processed++;
                    
                    // Check if we already have this killmail
                    if ($database->killmail_exists($killmail['killmail_id'])) {
                        continue;
                    }
                    
                    // Insert the killmail
                    if ($database->insert_killmail($killmail)) {
                        $new_kills++;
                        $region_new_kills++;
                        
                        $value_str = number_format($killmail['total_value']);
                        $ship_name = $killmail['ship_name'] !== 'Unknown Ship' ? $killmail['ship_name'] : 'Unknown Ship';
                        $victim_name = $killmail['victim_name'] !== 'Unknown Pilot' ? $killmail['victim_name'] : 'Unknown Pilot';
                        $killer_name = $killmail['killer_name'] !== 'Unknown Killer' ? $killmail['killer_name'] : 'Unknown Killer';
                        $system_name = $killmail['system_name'] !== 'Unknown System' ? $killmail['system_name'] : 'Unknown System';
                        
                        EVE_Killfeed_Database::log('info', "Inserted killmail: {$killmail['killmail_id']} in {$system_name} ({$region_name}) - {$victim_name} ({$ship_name}) killed by {$killer_name} (Value: {$value_str} ISK)");
                    } else {
                        $error_msg = "Failed to insert killmail: {$killmail['killmail_id']}";
                        EVE_Killfeed_Database::log('error', $error_msg);
                        $errors[] = $error_msg;
                    }
                }
                
                $region_time = round(microtime(true) - $region_start_time, 2);
                $location_results[$region_name] = array(
                    'new' => $region_new_kills, 
                    'processed' => $region_processed, 
                    'error' => false,
                    'time' => $region_time,
                    'type' => 'region'
                );
                
                EVE_Killfeed_Database::log('info', "Region {$region_name} completed: {$region_new_kills} new from {$region_processed} processed in {$region_time}s");
                
                // Rate limiting - sleep between requests to avoid hitting API limits
                sleep(3); // Slightly longer delay for regions as they generate more requests
            }
            
            $execution_time = round(microtime(true) - $start_time, 2);
            
            $message = "Processed {$total_processed} killmails, {$new_kills} new";
            if (!empty($errors)) {
                $message .= " (" . count($errors) . " errors)";
            }
            
            // Log detailed summary
            $summary = "Fetch completed in {$execution_time}s: {$new_kills} new kills from {$total_processed} processed";
            foreach ($location_results as $location => $result) {
                $type_label = $result['type'] === 'region' ? 'region' : 'system';
                $summary .= "\n  {$location} ({$type_label}): {$result['new']} new, {$result['processed']} processed";
                if ($result['error']) {
                    $summary .= " (ERROR)";
                }
            }
            EVE_Killfeed_Database::log('info', $summary);
            
            // Update last fetch statistics
            update_option('eve_killfeed_last_fetch', array(
                'time' => current_time('mysql'),
                'new_kills' => $new_kills,
                'total_processed' => $total_processed,
                'execution_time' => $execution_time,
                'locations' => $location_results,
                'errors' => count($errors)
            ));
            
            return array(
                'new_kills' => $new_kills,
                'total_processed' => $total_processed,
                'execution_time' => $execution_time,
                'errors' => $errors,
                'location_results' => $location_results,
                'message' => $message
            );
            
        } catch (Exception $e) {
            $error_msg = 'Exception during killmail fetch: ' . $e->getMessage();
            EVE_Killfeed_Database::log('error', $error_msg);
            return array('new_kills' => 0, 'message' => 'Error: ' . $e->getMessage());
        }
    }
    
    /**
     * Test API connectivity
     */
    public function test_api_connectivity() {
        EVE_Killfeed_Database::log('info', 'Running scheduled API connectivity test');
        
        $zkb_api = new EVE_Killfeed_ZKillboard_API();
        $results = $zkb_api->test_connectivity();
        
        $status = array(
            'esi_online' => $results['esi_status'],
            'zkb_online' => $results['zkb_status'],
            'system_lookup_working' => $results['system_lookup'],
            'region_lookup_working' => $results['region_lookup'],
            'errors' => $results['errors']
        );
        
        // Store test results
        update_option('eve_killfeed_api_status', $status);
        
        if (!empty($results['errors'])) {
            EVE_Killfeed_Database::log('warning', 'API connectivity issues detected: ' . implode(', ', $results['errors']));
        } else {
            EVE_Killfeed_Database::log('info', 'All API connectivity tests passed');
        }
        
        return $status;
    }
    
    /**
     * Cleanup old data
     */
    public function cleanup_old_data() {
        $database = EVE_Killfeed_Database::get_instance();
        $retention_hours = get_option('eve_killfeed_retention_hours', 24);
        
        $deleted = $database->cleanup_old_killmails($retention_hours);
        
        EVE_Killfeed_Database::log('info', "Cleanup completed: {$deleted} old killmails deleted (retention: {$retention_hours}h)");
        
        // Also cleanup old logs (keep last 1000 entries)
        global $wpdb;
        $logs_table = $wpdb->prefix . 'eve_killfeed_logs';
        
        $log_cleanup = $wpdb->query("DELETE FROM {$logs_table} WHERE id NOT IN (SELECT id FROM (SELECT id FROM {$logs_table} ORDER BY created_at DESC LIMIT 1000) tmp)");
        
        if ($log_cleanup > 0) {
            EVE_Killfeed_Database::log('info', "Log cleanup: removed {$log_cleanup} old log entries");
        }
    }
    
    /**
     * Get cron status
     */
    public static function get_cron_status() {
        $status = array();
        
        $next_fetch = wp_next_scheduled('eve_killfeed_fetch_killmails');
        $next_cleanup = wp_next_scheduled('eve_killfeed_cleanup_old_data');
        $next_api_test = wp_next_scheduled('eve_killfeed_test_apis');
        
        $status['next_fetch'] = $next_fetch ? date('Y-m-d H:i:s', $next_fetch) : 'Not scheduled';
        $status['next_cleanup'] = $next_cleanup ? date('Y-m-d H:i:s', $next_cleanup) : 'Not scheduled';
        $status['next_api_test'] = $next_api_test ? date('Y-m-d H:i:s', $next_api_test) : 'Not scheduled';
        $status['fetch_active'] = $next_fetch !== false;
        $status['cleanup_active'] = $next_cleanup !== false;
        $status['api_test_active'] = $next_api_test !== false;
        $status['is_scheduled'] = self::is_cron_scheduled();
        
        // Get last fetch results
        $last_fetch = get_option('eve_killfeed_last_fetch', array());
        if (!empty($last_fetch)) {
            $status['last_fetch'] = $last_fetch;
        }
        
        // Get API status
        $api_status = get_option('eve_killfeed_api_status', array());
        if (!empty($api_status)) {
            $status['api_status'] = $api_status;
        }
        
        return $status;
    }
}

// Register cron intervals filter outside the class - FIXED
add_filter('cron_schedules', array('EVE_Killfeed_Cron', 'add_cron_intervals'));