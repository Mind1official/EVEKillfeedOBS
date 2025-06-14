<?php
/**
 * EVE Systems Manager - Enhanced with Region Support
 */

class EVE_Killfeed_Systems_Manager {
    
    private static $instance = null;
    private $systems_table;
    private $regions_table;
    private $constellations_table;
    
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
        $this->constellations_table = $wpdb->prefix . 'eve_constellations';
        
        // Register AJAX handlers
        add_action('wp_ajax_eve_killfeed_clear_monitored_systems', array($this, 'ajax_clear_monitored_systems'));
        add_action('wp_ajax_eve_killfeed_search_regions', array($this, 'ajax_search_regions'));
        add_action('wp_ajax_eve_killfeed_save_regions', array($this, 'ajax_save_regions'));
        add_action('wp_ajax_eve_killfeed_clear_monitored_regions', array($this, 'ajax_clear_monitored_regions'));
    }
    
    /**
     * Get system details by system ID from local database
     */
    public function get_system_details_by_id($system_id) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            return null;
        }

        $sql = "SELECT systems.id, system_name, regions.region_name, security_status, security_class 
             FROM {$this->systems_table} systems
                JOIN {$this->constellations_table} constellations ON systems.constellation_id = constellations.id
                JOIN {$this->regions_table} regions ON regions.id = constellations.region_id
             WHERE systems.id = %d";
        
        $system = $wpdb->get_row(
            $wpdb->prepare(
                $sql,
                $system_id
            ),
            ARRAY_A
        );
        
        if ($system) {
            EVE_Killfeed_Database::log('info', "Found system details in local database: {$system['system_name']} (ID: {$system_id}, Security: {$system['security_status']})");
            return $system;
        }
        
        EVE_Killfeed_Database::log('warning', "System ID {$system_id} not found in local database");
        EVE_Killfeed_Database::log('warning', "SQL Used: $sql");
        return null;
    }

    /**
     * Search systems by name with ESI fallback
     */
    public function search_systems($query, $limit = 20) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('warning', 'Systems table does not exist, creating it now');
            self::create_systems_table();
        }
        
        // First try database search
        $sql = $wpdb->prepare(
            "SELECT systems.id, system_name, regions.region_name, security_status, security_class, systems.is_monitored 
             FROM {$this->systems_table} systems
                JOIN {$this->constellations_table} constellations ON systems.constellation_id = constellations.id
                JOIN {$this->regions_table} regions ON regions.id = constellations.region_id
             WHERE system_name LIKE %s 
             ORDER BY system_name ASC 
             LIMIT %d",
            '%' . $wpdb->esc_like($query) . '%',
            $limit
        );

        EVE_Killfeed_Database::log('info', "SYSTEMS: " . $sql);
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        
        return $results ?: array();
    }
    
    /**
     * Search regions by name
     */
    public function search_regions($query, $limit = 20) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('warning', 'Regions table does not exist, creating it now');
            self::create_systems_table();
        }
        
        // Search database
        $sql = $wpdb->prepare(
            "SELECT id, region_name, description, is_monitored 
             FROM {$this->regions_table} 
             WHERE region_name LIKE %s 
             ORDER BY region_name ASC 
             LIMIT %d",
            '%' . $wpdb->esc_like($query) . '%',
            $limit
        );

        EVE_Killfeed_Database::log('info', "REGIONS: " . $sql);
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        
        return $results ?: array();
    }
    
    /**
     * AJAX: Search regions
     */
    public function ajax_search_regions() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $query = sanitize_text_field($_POST['query'] ?? '');
        $regions = $this->search_regions($query, 20);
        
        wp_send_json_success($regions);
    }
    
    /**
     * AJAX: Save monitored regions
     */
    public function ajax_save_regions() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $regions = isset($_POST['regions']) ? $_POST['regions'] : array();
        $regions = array_map('sanitize_text_field', $regions);
        
        $success_count = $this->update_monitored_regions($regions);
        
        EVE_Killfeed_Database::log('info', "Monitored regions updated: {$success_count}/" . count($regions) . " regions");
        
        wp_send_json_success(array(
            'message' => sprintf(__('Updated %d regions successfully', 'eve-killfeed'), $success_count),
        ));
    }
    
    /**
     * AJAX: Clear all monitored regions
     */
    public function ajax_clear_monitored_regions() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        try {
            $cleared_count = $this->clear_all_monitored_regions();
            
            EVE_Killfeed_Database::log('info', "Cleared monitoring for {$cleared_count} regions");
            
            wp_send_json_success(array(
                'message' => sprintf('Cleared monitoring for %d regions', $cleared_count),
                'cleared_count' => $cleared_count
            ));
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Failed to clear monitored regions: ' . $e->getMessage());
            wp_send_json_error('Failed to clear monitored regions: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX: Clear all monitored systems
     */
    public function ajax_clear_monitored_systems() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        try {
            $cleared_count = $this->clear_all_monitored_systems();
            
            EVE_Killfeed_Database::log('info', "Cleared monitoring for {$cleared_count} systems");
            
            wp_send_json_success(array(
                'message' => sprintf('Cleared monitoring for %d systems', $cleared_count),
                'cleared_count' => $cleared_count
            ));
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Failed to clear monitored systems: ' . $e->getMessage());
            wp_send_json_error('Failed to clear monitored systems: ' . $e->    Message());   
        }
    }
    
    /**
     * Clear all monitored systems
     */
    public function clear_all_monitored_systems() {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            return 0;
        }
        
        // Update all systems to not monitored
        $result = $wpdb->update(
            $this->systems_table,
            array('is_monitored' => 0),
            array('is_monitored' => 1),
            array('%d'),
            array('%d')
        );
        
        if ($result === false) {
            throw new Exception('Database update failed: ' . $wpdb->last_error);
        }
        
        return $result;
    }
    
    /**
     * Clear all monitored regions
     */
    public function clear_all_monitored_regions() {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            return 0;
        }
        
        // Update all regions to not monitored
        $result = $wpdb->update(
            $this->regions_table,
            array('is_monitored' => 0),
            array('is_monitored' => 1),
            array('%d'),
            array('%d')
        );
        
        if ($result === false) {
            throw new Exception('Database update failed: ' . $wpdb->last_error);
        }
        
        return $result;
    }
    
    /**
     * Create systems and regions tables
     */
    public static function create_systems_table() {
        global $wpdb;
        
        $systems_table = $wpdb->prefix . 'eve_systems';
        $regions_table = $wpdb->prefix . 'eve_regions';
        $constellations_table = $wpdb->prefix . 'eve_constellations';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Create regions table
        $regions_sql = "CREATE TABLE $regions_table (
            id int(11) NOT NULL,
            region_name varchar(255) NOT NULL,
            description text DEFAULT NULL,
            is_monitored tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY region_name (region_name),
            KEY is_monitored (is_monitored)
        ) $charset_collate;";
        
        // Create constellations table
        $constellations_sql = "CREATE TABLE $constellations_table (
            id int(11) NOT NULL,
            region_id int(11) NOT NULL,
            constellation_name varchar(255) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            CONSTRAINT FK_region_id FOREIGN KEY (region_id) REFERENCES $regions_table(id),
            KEY constellation_name (constellation_name)
        ) $charset_collate;";
        
        // Create systems table
        $systems_sql = "CREATE TABLE $systems_table (
			id int(11) NOT NULL,
			system_name varchar(255) NOT NULL,
			constellation_id int(11) NOT NULL,
			security_status decimal(3,2) NOT NULL DEFAULT 0.00,
			security_class varchar(20) NOT NULL DEFAULT 'unknown',
			is_monitored tinyint(1) NOT NULL DEFAULT 0,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			CONSTRAINT FK_constellations FOREIGN KEY (constellation_id) REFERENCES $constellations_table(id),
			KEY system_name (system_name),
			KEY security_class (security_class),
			KEY is_monitored (is_monitored)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $regions_result = dbDelta($regions_sql);
        $constellations_result = dbDelta($constellations_sql);
        $systems_result = dbDelta($systems_sql);
        
        EVE_Killfeed_Database::log('info', 'Systems table creation result: ' . print_r($systems_result, true));
        EVE_Killfeed_Database::log('info', 'Regions table creation result: ' . print_r($regions_result, true));
        EVE_Killfeed_Database::log('info', 'Constellations table creation result: ' . print_r($constellations_result, true));
        
        // Verify tables were created
        $systems_exists = $wpdb->get_var("SHOW TABLES LIKE '$systems_table'");
        $regions_exists = $wpdb->get_var("SHOW TABLES LIKE '$regions_table'");
        $constellations_exists = $wpdb->get_var("SHOW TABLES LIKE '$constellations_table'");
        
        if (!$systems_exists || !$regions_exists || !$constellations_exists) {
            EVE_Killfeed_Database::log('error', 'Failed to create systems or regions table');
            return false;
        }
        
        return true;
    }
    
    /**
     * Get monitored systems
     */
    public function get_monitored_systems() {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            return array();
        }
        
        $sql = "SELECT systems.id, system_name, regions.region_name, security_status, security_class
                FROM {$this->systems_table} systems
                    JOIN {$this->constellations_table} constellations ON systems.constellation_id = constellations.id
                    JOIN {$this->regions_table} regions ON regions.id = constellations.region_id
                WHERE systems.is_monitored = 1
                ORDER BY system_name ASC";
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        return $results ?: array();
    }
    
    /**
     * Get monitored regions
     */
    public function get_monitored_regions() {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            return array();
        }
        
        $sql = "SELECT id, region_name, description 
                FROM {$this->regions_table} 
                WHERE is_monitored = 1 
                ORDER BY region_name ASC";
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        return $results ?: array();
    }
    
    /**
     * Set system monitoring status with auto-add from ESI
     */
    public function set_system_monitoring($system_name, $monitored = true) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('error', 'Systems table does not exist');
            return false;
        }
        
        // First try to find existing system
        $system = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$this->systems_table} WHERE system_name = %s",
                $system_name
            )
        );
        
        if ($system) {
            // Update existing system
            $result = $wpdb->update(
                $this->systems_table,
                array('is_monitored' => $monitored ? 1 : 0),
                array('system_name' => $system_name),
                array('%d'),
                array('%s')
            );
            
            EVE_Killfeed_Database::log('info', "Updated monitoring for existing system: {$system_name} -> " . ($monitored ? 'ON' : 'OFF'));
            return $result !== false;
        }
        
        EVE_Killfeed_Database::log('warning', "System not found in Database: {$system_name}");
        
        return false;
    }
    
    /**
     * Set region monitoring status
     */
    public function set_region_monitoring($region_name, $monitored = true) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('error', 'Regions table does not exist');
            return false;
        }
        
        // Find existing region
        $region = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$this->regions_table} WHERE region_name = %s",
                $region_name
            )
        );
        
        if ($region) {
            // Update existing region
            $result = $wpdb->update(
                $this->regions_table,
                array('is_monitored' => $monitored ? 1 : 0),
                array('region_name' => $region_name),
                array('%d'),
                array('%s')
            );
            
            EVE_Killfeed_Database::log('info', "Updated monitoring for region: {$region_name} -> " . ($monitored ? 'ON' : 'OFF'));
            return $result !== false;
        }
        
        return false;
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
     * Bulk update monitored systems
     */
    public function update_monitored_systems($system_names) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('error', 'Systems table does not exist');
            return 0;
        }
        // First, clear all monitoring
        $result = $wpdb->update(
            $this->systems_table,
            array('is_monitored' => 0), // The value to be written to the table
			array('is_monitored' => 1)  // The value to check to change to the above
        );
		
        // Then set the selected systems as monitored
        $success_count = 0;
        foreach ($system_names as $system_name) {
            if ($this->set_system_monitoring($system_name, true)) {
                $success_count++;
            }
        }
        
        EVE_Killfeed_Database::log('info', "Updated monitoring: {$success_count}/" . count($system_names) . " systems");
        
        return $success_count;
    }
    
    /**
     * Bulk update monitored regions
     */
    public function update_monitored_regions($region_names) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            EVE_Killfeed_Database::log('error', 'Regions table does not exist');
            return 0;
        }
        
        // First, clear all monitoring
        $wpdb->update(
            $this->regions_table,
            array('is_monitored' => 0),
            array('is_monitored' => 1)
        );
        
        // Then set the selected regions as monitored
        $success_count = 0;
        foreach ($region_names as $region_name) {
            if ($this->set_region_monitoring($region_name, true)) {
                $success_count++;
            }
        }
        
        EVE_Killfeed_Database::log('info', "Updated monitoring: {$success_count}/" . count($region_names) . " regions");
        
        return $success_count;
    }
    
    /**
     * Get system statistics
     */
    public function get_system_stats() {
        global $wpdb;
        
        // Check if tables exist
        $systems_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        $regions_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        
        $stats = array(
            'total_systems' => 0,
            'monitored_systems' => 0,
            'total_regions' => 0,
            'monitored_regions' => 0,
            'by_security' => array()
        );
        
        if ($systems_exists) {
            $stats['total_systems'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table}");
            $stats['monitored_systems'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table} WHERE is_monitored = 1");
            
            // Security class breakdown
            $security_stats = $wpdb->get_results(
                "SELECT security_class, COUNT(*) as count 
                 FROM {$this->systems_table} 
                 GROUP BY security_class 
                 ORDER BY count DESC",
                ARRAY_A
            );
            
            if ($security_stats) {
                foreach ($security_stats as $stat) {
                    $stats['by_security'][$stat['security_class']] = (int) $stat['count'];
                }
            }
        }
        
        if ($regions_exists) {
            $stats['total_regions'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->regions_table}");
            $stats['monitored_regions'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->regions_table} WHERE is_monitored = 1");
        }
        
        return $stats;
    }
}