<?php
/**
 * EVE Systems and Regions Importer - Enhanced with Region Support
 */

class EVE_Killfeed_Systems_Importer {
    
    private static $instance = null;
    private $systems_table;
    private $regions_table;
    private $chunk_size = 25;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        global $wpdb;
        $this->systems_table = $wpdb->prefix . 'eve_systems';
        $this->regions_table = $wpdb->prefix . 'eve_regions';
        
        // Register AJAX handlers
        add_action('wp_ajax_eve_killfeed_start_import', array($this, 'ajax_start_import'));
        add_action('wp_ajax_eve_killfeed_process_chunk', array($this, 'ajax_process_chunk'));
        add_action('wp_ajax_eve_killfeed_get_import_progress', array($this, 'ajax_get_import_progress'));
        add_action('wp_ajax_eve_killfeed_cancel_import', array($this, 'ajax_cancel_import'));
        
        // Region import handlers
        add_action('wp_ajax_eve_killfeed_start_region_import', array($this, 'ajax_start_region_import'));
        add_action('wp_ajax_eve_killfeed_import_regions', array($this, 'ajax_import_regions'));
    }
    
    /**
     * AJAX: Start region import
     */
    public function ajax_start_region_import() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        try {
            $result = $this->import_all_regions();
            
            if ($result['success']) {
                wp_send_json_success(array(
                    'message' => $result['message'],
                    'imported' => $result['imported'],
                    'updated' => $result['updated']
                ));
            } else {
                wp_send_json_error($result['message']);
            }
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Failed to import regions: ' . $e->getMessage());
            wp_send_json_error('Failed to import regions: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX: Import regions (alias for compatibility)
     */
    public function ajax_import_regions() {
        $this->ajax_start_region_import();
    }
    
    /**
     * Import all EVE regions from ESI
     */
    public function import_all_regions() {
        EVE_Killfeed_Database::log('info', 'Starting region import from ESI');
        
        try {
            // Get all region IDs from ESI
            $region_ids = $this->get_all_region_ids();
            
            if (empty($region_ids)) {
                throw new Exception('Failed to fetch region IDs from ESI');
            }
            
            $imported = 0;
            $updated = 0;
            $errors = 0;
            
            foreach ($region_ids as $region_id) {
                try {
                    $result = $this->import_single_region($region_id);
                    
                    if ($result === 'imported') {
                        $imported++;
                    } elseif ($result === 'updated') {
                        $updated++;
                    }
                    
                    // Small delay to be respectful to ESI
                    usleep(200000); // 0.2 seconds
                    
                } catch (Exception $e) {
                    $errors++;
                    EVE_Killfeed_Database::log('error', "Failed to import region {$region_id}: " . $e->getMessage());
                    continue;
                }
            }
            
            $total_processed = $imported + $updated;
            $message = "Region import completed: {$imported} new, {$updated} updated, {$errors} errors";
            
            EVE_Killfeed_Database::log('info', $message);
            
            return array(
                'success' => true,
                'message' => $message,
                'imported' => $imported,
                'updated' => $updated,
                'errors' => $errors,
                'total_processed' => $total_processed
            );
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Region import failed: ' . $e->getMessage());
            return array(
                'success' => false,
                'message' => 'Region import failed: ' . $e->getMessage()
            );
        }
    }
    
    /**
     * Get all region IDs from ESI
     */
    private function get_all_region_ids() {
        $cache_key = 'eve_all_region_ids';
        $cached_ids = get_transient($cache_key);
        
        if ($cached_ids !== false) {
            return $cached_ids;
        }
        
        $url = 'https://esi.evetech.net/latest/universe/regions/';
        
        $args = array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION,
                'Accept' => 'application/json',
            ),
            'sslverify' => true,
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            throw new Exception('ESI request failed: ' . $response->get_error_message());
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            throw new Exception("ESI returned HTTP {$code}");
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON response from ESI');
        }
        
        if (!is_array($data)) {
            throw new Exception('ESI returned invalid data format');
        }
        
        // Cache for 1 hour
        set_transient($cache_key, $data, HOUR_IN_SECONDS);
        
        return $data;
    }
    
    /**
     * Import a single region
     */
    private function import_single_region($region_id) {
        global $wpdb;
        
        // Check if region already exists
        $exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$this->regions_table} WHERE region_id = %d",
                $region_id
            )
        );
        
        // Get region details from ESI
        $region_data = $this->get_region_details($region_id);
        
        if (!$region_data) {
            throw new Exception("Failed to get region details for ID {$region_id}");
        }
        
        $region_info = array(
            'id' => $region_id,
            'region_name' => $region_data['name'] ?? "Region {$region_id}",
            'description' => $region_data['description'],
            'is_popular' => $this->is_popular_region($region_data['name'] ?? ''),
            'is_monitored' => 0
        );
        
        if ($exists > 0) {
            // Update existing region
            $result = $wpdb->update(
                $this->regions_table,
                $region_info,
                array('region_id' => $region_id),
                array('%d', '%s', '%s', '%d', '%d'),
                array('%d')
            );
            
            return $result !== false ? 'updated' : false;
        } else {
            // Insert new region
            $result = $wpdb->insert(
                $this->regions_table,
                $region_info,
                array('%d', '%s', '%s', '%d', '%d')
            );
            
            return $result !== false ? 'imported' : false;
        }
    }
    
    /**
     * Get region details from ESI
     */
    private function get_region_details($region_id) {
        $cache_key = 'esi_region_' . $region_id;
        $cached = get_transient($cache_key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $url = "https://esi.evetech.net/latest/universe/regions/{$region_id}/";
        
        $args = array(
            'timeout' => 15,
            'headers' => array(
                'User-Agent' => 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION,
                'Accept' => 'application/json',
            ),
            'sslverify' => true,
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return false;
        }
        
        // Cache for 24 hours
        set_transient($cache_key, $data, 24 * HOUR_IN_SECONDS);
        
        return $data;
    }
    
    /**
     * Check if region is considered popular
     */
    private function is_popular_region($region_name) {
        $popular_regions = array(
            'The Forge', 'Domain', 'Sinq Laison', 'Heimatar', 'Metropolis',
            'Black Rise', 'Placid', 'Genesis', 'The Citadel', 'Essence',
            'Delve', 'Fountain', 'Catch', 'Providence', 'Syndicate',
            'Curse', 'Stain', 'Molden Heath', 'The Bleak Lands'
        );
        
        return in_array($region_name, $popular_regions) ? 1 : 0;
    }
    
    /**
     * AJAX: Start the import process
     */
    public function ajax_start_import() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        try {
            // Clear any existing import progress
            $this->clear_import_progress();
            
            // Get all system IDs from ESI
            EVE_Killfeed_Database::log('info', 'Starting chunked systems import - fetching system IDs from ESI');
            
            $system_ids = $this->get_all_system_ids();
            
            if (empty($system_ids)) {
                throw new Exception('Failed to fetch system IDs from ESI');
            }
            
            // Initialize import progress
            $progress_data = array(
                'status' => 'running',
                'total_systems' => count($system_ids),
                'processed' => 0,
                'imported' => 0,
                'errors' => 0,
                'current_chunk' => 0,
                'total_chunks' => ceil(count($system_ids) / $this->chunk_size),
                'system_ids' => $system_ids,
                'start_time' => time(),
                'last_update' => time(),
                'error_messages' => array()
            );
            
            update_option('eve_killfeed_import_progress', $progress_data);
            
            EVE_Killfeed_Database::log('info', "Import initialized: {$progress_data['total_systems']} systems in {$progress_data['total_chunks']} chunks");
            
            wp_send_json_success(array(
                'message' => 'Import started successfully',
                'progress' => $this->format_progress_response($progress_data)
            ));
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Failed to start import: ' . $e->getMessage());
            wp_send_json_error('Failed to start import: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX: Process a single chunk
     */
    public function ajax_process_chunk() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $progress_data = get_option('eve_killfeed_import_progress', array());
        
        if (empty($progress_data) || $progress_data['status'] !== 'running') {
            wp_send_json_error('No active import found');
        }
        
        try {
            $chunk_start = $progress_data['current_chunk'] * $this->chunk_size;
            $chunk_systems = array_slice($progress_data['system_ids'], $chunk_start, $this->chunk_size);
            
            if (empty($chunk_systems)) {
                // Import complete
                $progress_data['status'] = 'completed';
                $progress_data['end_time'] = time();
                $progress_data['execution_time'] = $progress_data['end_time'] - $progress_data['start_time'];
                
                update_option('eve_killfeed_import_progress', $progress_data);
                
                // Update popular systems flags
                $this->update_popular_systems();
                
                EVE_Killfeed_Database::log('info', "Import completed: {$progress_data['imported']} imported, {$progress_data['errors']} errors in {$progress_data['execution_time']} seconds");
                
                wp_send_json_success(array(
                    'message' => 'Import completed successfully',
                    'progress' => $this->format_progress_response($progress_data),
                    'completed' => true
                ));
            }
            
            // Process this chunk
            $chunk_result = $this->process_systems_chunk($chunk_systems);
            
            // Update progress
            $progress_data['processed'] += count($chunk_systems);
            $progress_data['imported'] += $chunk_result['imported'];
            $progress_data['errors'] += $chunk_result['errors'];
            $progress_data['current_chunk']++;
            $progress_data['last_update'] = time();
            
            if (!empty($chunk_result['error_messages'])) {
                $progress_data['error_messages'] = array_merge(
                    $progress_data['error_messages'], 
                    $chunk_result['error_messages']
                );
                // Keep only last 50 error messages
                $progress_data['error_messages'] = array_slice($progress_data['error_messages'], -50);
            }
            
            update_option('eve_killfeed_import_progress', $progress_data);
            
            $progress_percent = round(($progress_data['processed'] / $progress_data['total_systems']) * 100, 1);
            
            EVE_Killfeed_Database::log('info', "Chunk {$progress_data['current_chunk']}/{$progress_data['total_chunks']} completed: {$chunk_result['imported']} imported, {$chunk_result['errors']} errors ({$progress_percent}%)");
            
            wp_send_json_success(array(
                'message' => "Chunk {$progress_data['current_chunk']}/{$progress_data['total_chunks']} completed",
                'progress' => $this->format_progress_response($progress_data),
                'completed' => false
            ));
            
        } catch (Exception $e) {
            $progress_data['status'] = 'error';
            $progress_data['error_message'] = $e->getMessage();
            $progress_data['end_time'] = time();
            
            update_option('eve_killfeed_import_progress', $progress_data);
            
            EVE_Killfeed_Database::log('error', 'Chunk processing failed: ' . $e->getMessage());
            wp_send_json_error('Chunk processing failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX: Get current import progress
     */
    public function ajax_get_import_progress() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $progress_data = get_option('eve_killfeed_import_progress', array());
        
        if (empty($progress_data)) {
            wp_send_json_success(array(
                'progress' => array(
                    'status' => 'none',
                    'message' => 'No import in progress'
                )
            ));
        } else {
            wp_send_json_success(array(
                'progress' => $this->format_progress_response($progress_data)
            ));
        }
    }
    
    /**
     * AJAX: Cancel import
     */
    public function ajax_cancel_import() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $this->clear_import_progress();
        
        EVE_Killfeed_Database::log('info', 'Import cancelled by user');
        
        wp_send_json_success(array(
            'message' => 'Import cancelled successfully'
        ));
    }
    
    /**
     * Process a chunk of systems
     */
    private function process_systems_chunk($system_ids) {
        $imported = 0;
        $errors = 0;
        $error_messages = array();
        
        foreach ($system_ids as $system_id) {
            try {
                if ($this->import_single_system($system_id)) {
                    $imported++;
                } else {
                    $errors++;
                    $error_messages[] = "Failed to import system {$system_id}";
                }
                
                // Small delay to be respectful to ESI
                usleep(100000); // 0.1 seconds
                
            } catch (Exception $e) {
                $errors++;
                $error_messages[] = "System {$system_id}: " . $e->getMessage();
                continue;
            }
        }
        
        return array(
            'imported' => $imported,
            'errors' => $errors,
            'error_messages' => $error_messages
        );
    }
    
    /**
     * Import a single system
     */
    private function import_single_system($system_id) {
        global $wpdb;
        
        // Check if system already exists
        $exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$this->systems_table} WHERE system_id = %d",
                $system_id
            )
        );
        
        if ($exists > 0) {
            return true; // Already imported
        }
        
        // Get system details from ESI
        $system_data = $this->get_system_details($system_id);
        
        if (!$system_data) {
            return false;
        }
        
        // Insert system
        $result = $wpdb->insert(
            $this->systems_table,
            array(
                'system_id' => $system_id,
                'system_name' => $system_data['name'] ?? "System {$system_id}",
                'region_id' => 0,
                'region_name' => 'Unknown Region',
                'constellation_id' => $system_data['constellation_id'] ?? 0,
                'constellation_name' => 'Unknown Constellation',
                'security_status' => $system_data['security_status'] ?? 0.0,
                'security_class' => $this->get_security_class($system_data['security_status'] ?? 0.0),
                'is_popular' => 0,
                'is_monitored' => 0
            ),
            array('%d', '%s', '%d', '%s', '%d', '%s', '%f', '%s', '%d', '%d')
        );
        
        return $result !== false;
    }
    
    /**
     * Get all system IDs from ESI
     */
    private function get_all_system_ids() {
        $cache_key = 'eve_all_system_ids';
        $cached_ids = get_transient($cache_key);
        
        if ($cached_ids !== false) {
            return $cached_ids;
        }
        
        $url = 'https://esi.evetech.net/latest/universe/systems/';
        
        $args = array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION,
                'Accept' => 'application/json',
            ),
            'sslverify' => true,
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            throw new Exception('ESI request failed: ' . $response->get_error_message());
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            throw new Exception("ESI returned HTTP {$code}");
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON response from ESI');
        }
        
        if (!is_array($data)) {
            throw new Exception('ESI returned invalid data format');
        }
        
        // Cache for 1 hour
        set_transient($cache_key, $data, HOUR_IN_SECONDS);
        
        return $data;
    }
    
    /**
     * Get system details from ESI
     */
    private function get_system_details($system_id) {
        $cache_key = 'esi_system_' . $system_id;
        $cached = get_transient($cache_key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $url = "https://esi.evetech.net/latest/universe/systems/{$system_id}/";
        
        $args = array(
            'timeout' => 15,
            'headers' => array(
                'User-Agent' => 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION,
                'Accept' => 'application/json',
            ),
            'sslverify' => true,
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return false;
        }
        
        // Cache for 24 hours
        set_transient($cache_key, $data, 24 * HOUR_IN_SECONDS);
        
        return $data;
    }
    
    /**
     * Update popular systems flags
     */
    private function update_popular_systems() {
        global $wpdb;
        
        $popular_systems = array(
            'Jita', 'Amarr', 'Dodixie', 'Rens', 'Hek', 'Perimeter',
            'EFM-C4', 'Tama', 'Amamake', 'Rancer', 'Uedama', 'Niarja',
            'Old Man Star', 'Luminaire', 'Maurasi', 'Halaima'
        );
        
        $updated = 0;
        foreach ($popular_systems as $system_name) {
            $result = $wpdb->update(
                $this->systems_table,
                array('is_popular' => 1),
                array('system_name' => $system_name),
                array('%d'),
                array('%s')
            );
            
            if ($result !== false) {
                $updated++;
            }
        }
        
        EVE_Killfeed_Database::log('info', "Updated {$updated} popular systems");
    }
    
    /**
     * Get security class from security status
     */
    private function get_security_class($security) {
        if ($security >= 0.5) return 'highsec';
        if ($security > 0.0) return 'lowsec';
        if ($security <= 0.0 && $security > -1.0) return 'nullsec';
        return 'wormhole';
    }
    
    /**
     * Format progress response for frontend
     */
    private function format_progress_response($progress_data) {
        $progress_percent = 0;
        if ($progress_data['total_systems'] > 0) {
            $progress_percent = round(($progress_data['processed'] / $progress_data['total_systems']) * 100, 1);
        }
        
        $response = array(
            'status' => $progress_data['status'],
            'total_systems' => $progress_data['total_systems'],
            'processed' => $progress_data['processed'],
            'imported' => $progress_data['imported'],
            'errors' => $progress_data['errors'],
            'current_chunk' => $progress_data['current_chunk'],
            'total_chunks' => $progress_data['total_chunks'],
            'progress_percent' => $progress_percent,
            'last_update' => $progress_data['last_update']
        );
        
        if (isset($progress_data['execution_time'])) {
            $response['execution_time'] = $progress_data['execution_time'];
        }
        
        if (isset($progress_data['error_message'])) {
            $response['error_message'] = $progress_data['error_message'];
        }
        
        if (!empty($progress_data['error_messages'])) {
            $response['recent_errors'] = array_slice($progress_data['error_messages'], -5);
        }
        
        // Generate status message
        switch ($progress_data['status']) {
            case 'running':
                $response['message'] = "Processing chunk {$progress_data['current_chunk']}/{$progress_data['total_chunks']} ({$progress_percent}%)";
                break;
            case 'completed':
                $response['message'] = "Import completed: {$progress_data['imported']} systems imported, {$progress_data['errors']} errors";
                break;
            case 'error':
                $response['message'] = "Import failed: " . ($progress_data['error_message'] ?? 'Unknown error');
                break;
            default:
                $response['message'] = 'Import status unknown';
        }
        
        return $response;
    }
    
    /**
     * Clear import progress
     */
    private function clear_import_progress() {
        delete_option('eve_killfeed_import_progress');
    }
    
    /**
     * Check if import is needed
     */
    public function needs_import() {
        global $wpdb;
        
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            return true;
        }
        
        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table}");
        return $count < 1000;
    }
    
    /**
     * Check if region import is needed
     */
    public function needs_region_import() {
        global $wpdb;
        
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            return true;
        }
        
        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$this->regions_table}");
        return $count < 50; // EVE has around 100+ regions
    }
    
    /**
     * Get import progress for display
     */
    public function get_import_progress() {
        $progress_data = get_option('eve_killfeed_import_progress', array());
        
        if (empty($progress_data)) {
            return array(
                'imported' => 0,
                'estimated_total' => 7500,
                'progress_percent' => 0,
                'is_complete' => false,
                'status' => 'none'
            );
        }
        
        return $this->format_progress_response($progress_data);
    }
}