<?php
/**
 * EVE Systems Manager - Enhanced with Region Support
 */

class EVE_Killfeed_Systems_Manager {
    
    private static $instance = null;
    private $systems_table;
    private $regions_table;
    
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
        
        $system = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT system_id, system_name, region_name, security_status, security_class 
                 FROM {$this->systems_table} 
                 WHERE system_id = %d",
                $system_id
            ),
            ARRAY_A
        );
        
        if ($system) {
            EVE_Killfeed_Database::log('info', "Found system details in local database: {$system['system_name']} (ID: {$system_id}, Security: {$system['security_status']})");
            return $system;
        }
        
        EVE_Killfeed_Database::log('warning', "System ID {$system_id} not found in local database");
        return null;
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
            wp_send_json_error('Failed to clear monitored systems: ' . $e->getMessage());
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
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Create systems table
        $systems_sql = "CREATE TABLE $systems_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            system_id int(11) NOT NULL,
            system_name varchar(255) NOT NULL,
            region_id int(11) NOT NULL DEFAULT 0,
            region_name varchar(255) NOT NULL DEFAULT 'Unknown Region',
            constellation_id int(11) NOT NULL DEFAULT 0,
            constellation_name varchar(255) NOT NULL DEFAULT 'Unknown Constellation',
            security_status decimal(3,2) NOT NULL DEFAULT 0.00,
            security_class varchar(20) NOT NULL DEFAULT 'unknown',
            is_popular tinyint(1) NOT NULL DEFAULT 0,
            is_monitored tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY system_id (system_id),
            KEY system_name (system_name),
            KEY region_id (region_id),
            KEY security_class (security_class),
            KEY is_popular (is_popular),
            KEY is_monitored (is_monitored)
        ) $charset_collate;";
        
        // Create regions table
        $regions_sql = "CREATE TABLE $regions_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            region_id int(11) NOT NULL,
            region_name varchar(255) NOT NULL,
            description text DEFAULT NULL,
            is_popular tinyint(1) NOT NULL DEFAULT 0,
            is_monitored tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY region_id (region_id),
            KEY region_name (region_name),
            KEY is_popular (is_popular),
            KEY is_monitored (is_monitored)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $systems_result = dbDelta($systems_sql);
        $regions_result = dbDelta($regions_sql);
        
        EVE_Killfeed_Database::log('info', 'Systems table creation result: ' . print_r($systems_result, true));
        EVE_Killfeed_Database::log('info', 'Regions table creation result: ' . print_r($regions_result, true));
        
        // Verify tables were created
        $systems_exists = $wpdb->get_var("SHOW TABLES LIKE '$systems_table'");
        $regions_exists = $wpdb->get_var("SHOW TABLES LIKE '$regions_table'");
        
        if (!$systems_exists || !$regions_exists) {
            EVE_Killfeed_Database::log('error', 'Failed to create systems or regions table');
            return false;
        }
        
        // Populate with initial data
        self::populate_initial_systems();
        self::populate_initial_regions();
        
        return true;
    }
    
    /**
     * Populate with essential EVE systems
     */
    private static function populate_initial_systems() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'eve_systems';
        
        // Check if already populated
        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
        if ($count > 0) {
            EVE_Killfeed_Database::log('info', 'Systems table already has data, skipping initial population');
            return;
        }
        
        // Essential EVE Online systems with CORRECT system IDs
        $systems = array(
            // Major Trade Hubs
            array(30000142, 'Jita', 10000002, 'The Forge', 20000020, 'Kimotoro', 0.94, 'highsec', 1),
            array(30002187, 'Amarr', 10000043, 'Domain', 20000302, 'Throne Worlds', 1.00, 'highsec', 1),
            array(30002659, 'Dodixie', 10000032, 'Sinq Laison', 20000390, 'Dodixie', 0.90, 'highsec', 1),
            array(30002510, 'Rens', 10000030, 'Heimatar', 20000284, 'Frarn', 0.90, 'highsec', 1),
            array(30000144, 'Hek', 10000042, 'Metropolis', 20000020, 'Hek', 0.80, 'highsec', 1),
            array(30045349, 'Perimeter', 10000002, 'The Forge', 20000020, 'Kimotoro', 1.00, 'highsec', 1),
            
            // Popular PvP Systems
            array(30000783, 'EFM-C4', 11000001, 'A-R00001', 21000001, 'A-C00001', -1.00, 'wormhole', 1),
            array(30002813, 'Tama', 10000069, 'Black Rise', 20000481, 'Tama', 0.30, 'lowsec', 1),
            array(30002537, 'Amamake', 10000042, 'Metropolis', 20000284, 'Amamake', 0.40, 'lowsec', 1),
            array(30001372, 'Rancer', 10000067, 'Genesis', 20000441, 'Rancer', 0.40, 'lowsec', 1),
            array(30000210, 'Uedama', 10000033, 'The Citadel', 20000033, 'Uedama', 0.50, 'lowsec', 1),
            array(30002505, 'Niarja', 10000043, 'Domain', 20000302, 'Niarja', 0.50, 'lowsec', 1),
            
            // Additional Popular Systems
            array(30003046, 'Old Man Star', 10000048, 'Placid', 20000350, 'Old Man Star', 0.40, 'lowsec', 1),
            array(30000139, 'Luminaire', 10000064, 'Essence', 20000406, 'Luminaire', 0.70, 'highsec', 1),
            array(30045352, 'Maurasi', 10000002, 'The Forge', 20000020, 'Kimotoro', 0.80, 'highsec', 1),
            array(30002053, 'Halaima', 10000043, 'Domain', 20000302, 'Halaima', 0.60, 'highsec', 1),
        );
        
        $inserted = 0;
        foreach ($systems as $system) {
            $result = $wpdb->insert(
                $table_name,
                array(
                    'system_id' => $system[0],
                    'system_name' => $system[1],
                    'region_id' => $system[2],
                    'region_name' => $system[3],
                    'constellation_id' => $system[4],
                    'constellation_name' => $system[5],
                    'security_status' => $system[6],
                    'security_class' => $system[7],
                    'is_popular' => $system[8],
                    'is_monitored' => 0
                ),
                array('%d', '%s', '%d', '%s', '%d', '%s', '%f', '%s', '%d', '%d')
            );
            
            if ($result !== false) {
                $inserted++;
            } else {
                EVE_Killfeed_Database::log('error', "Failed to insert system {$system[1]}: " . $wpdb->last_error);
            }
        }
        
        EVE_Killfeed_Database::log('info', "Populated systems table with {$inserted}/" . count($systems) . " essential EVE systems");
    }
    
    /**
     * Populate with essential EVE regions
     */
    private static function populate_initial_regions() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'eve_regions';
        
        // Check if already populated
        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
        if ($count > 0) {
            EVE_Killfeed_Database::log('info', 'Regions table already has data, skipping initial population');
            return;
        }
        
        // Essential EVE Online regions
        $regions = array(
            // High-sec Trade Regions
            array(10000002, 'The Forge', 'Major trade hub region containing Jita', 1),
            array(10000043, 'Domain', 'Amarr Empire heartland with Amarr trade hub', 1),
            array(10000032, 'Sinq Laison', 'Gallente trade region with Dodixie', 1),
            array(10000030, 'Heimatar', 'Minmatar trade region with Rens', 1),
            array(10000042, 'Metropolis', 'Minmatar region with Hek trade hub', 1),
            
            // PvP Regions
            array(10000069, 'Black Rise', 'Faction Warfare lowsec region', 1),
            array(10000048, 'Placid', 'Lowsec PvP region', 1),
            array(10000067, 'Genesis', 'Mixed security PvP region', 1),
            array(10000033, 'The Citadel', 'Caldari highsec with some lowsec', 1),
            array(10000064, 'Essence', 'Gallente core region', 1),
            
            // Null-sec Regions
            array(10000001, 'Deklein', 'Northern null-sec region', 1),
            array(10000004, 'UUA-F4', 'Drone regions', 0),
            array(10000005, 'Detorid', 'Southern null-sec', 0),
            array(10000006, 'Wicked Creek', 'Drone regions', 0),
            array(10000007, 'Cache', 'Drone regions', 0),
            array(10000008, 'Scalding Pass', 'Eastern null-sec', 0),
            array(10000009, 'Insmother', 'Eastern null-sec', 0),
            array(10000010, 'Tribute', 'Northern null-sec', 0),
            array(10000011, 'Great Wildlands', 'Low/null-sec region', 0),
            array(10000012, 'Curse', 'NPC null-sec region', 1),
            array(10000013, 'Malpais', 'Null-sec region', 0),
            array(10000014, 'Catch', 'Southern null-sec', 1),
            array(10000015, 'Venal', 'NPC null-sec region', 0),
            array(10000016, 'Lonetrek', 'Caldari highsec region', 0),
            array(10000017, 'J7HZ-F', 'Null-sec region', 0),
            array(10000018, 'The Spire', 'Null-sec region', 0),
            array(10000019, 'A821-A', 'Null-sec region', 0),
            array(10000020, 'Tash-Murkon', 'Amarr highsec region', 0),
            array(10000021, 'Outer Passage', 'Null-sec region', 0),
            array(10000022, 'Stain', 'NPC null-sec region', 1),
            array(10000023, 'Pure Blind', 'Null-sec region', 0),
            array(10000025, 'Immensea', 'Southern null-sec', 0),
            array(10000027, 'Etherium Reach', 'Eastern null-sec', 0),
            array(10000028, 'Molden Heath', 'Lowsec region', 1),
            array(10000029, 'Geminate', 'Null-sec region', 0),
            array(10000031, 'Tenal', 'Northern null-sec', 0),
            array(10000034, 'The Bleak Lands', 'Faction Warfare lowsec', 1),
            array(10000035, 'Verge Vendor', 'Gallente highsec', 0),
            array(10000036, 'Devoid', 'Amarr region', 0),
            array(10000037, 'Everyshore', 'Gallente highsec', 0),
            array(10000038, 'The Kalevala Expanse', 'Null-sec region', 0),
            array(10000039, 'Providence', 'NRDS null-sec region', 1),
            array(10000040, 'Syndicate', 'NPC null-sec region', 1),
            array(10000041, 'Fade', 'Null-sec region', 0),
            array(10000044, 'Solitude', 'Gallente lowsec region', 0),
            array(10000045, 'Querious', 'Southern null-sec', 0),
            array(10000046, 'Cloud Ring', 'Null-sec region', 0),
            array(10000047, 'Khanid', 'Amarr region', 0),
            array(10000049, 'Aridia', 'Amarr lowsec region', 0),
            array(10000050, 'Kador', 'Amarr highsec region', 0),
            array(10000051, 'Derelik', 'Mixed security region', 0),
            array(10000052, 'Cobalt Edge', 'Drone regions', 0),
            array(10000053, 'Outer Ring', 'ORE lowsec region', 0),
            array(10000054, 'Fountain', 'Western null-sec', 1),
            array(10000055, 'Branch', 'Northern null-sec', 0),
            array(10000056, 'Feythabolis', 'Southern null-sec', 0),
            array(10000057, 'Omist', 'Southern null-sec', 0),
            array(10000058, 'Paragon Soul', 'Southern null-sec', 0),
            array(10000059, 'Esoteria', 'Southern null-sec', 0),
            array(10000060, 'Delve', 'Western null-sec', 1),
            array(10000061, 'Tenerifis', 'Southern null-sec', 0),
            array(10000062, 'Period Basis', 'Western null-sec', 0),
            array(10000063, 'Vale of the Silent', 'Northern null-sec', 0),
            array(10000065, 'Kor-Azor', 'Amarr highsec region', 0),
            array(10000066, 'Perrigen Falls', 'Drone regions', 0),
            array(10000068, 'Etherium Reach', 'Eastern null-sec', 0),
        );
        
        $inserted = 0;
        foreach ($regions as $region) {
            $result = $wpdb->insert(
                $table_name,
                array(
                    'region_id' => $region[0],
                    'region_name' => $region[1],
                    'description' => $region[2],
                    'is_popular' => $region[3],
                    'is_monitored' => 0
                ),
                array('%d', '%s', '%s', '%d', '%d')
            );
            
            if ($result !== false) {
                $inserted++;
            } else {
                EVE_Killfeed_Database::log('error', "Failed to insert region {$region[1]}: " . $wpdb->last_error);
            }
        }
        
        EVE_Killfeed_Database::log('info', "Populated regions table with {$inserted}/" . count($regions) . " essential EVE regions");
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
        
        if (strlen($query) < 2) {
            // Return popular systems for short queries
            return $this->get_popular_systems($limit);
        }
        
        // First try database search
        $sql = $wpdb->prepare(
            "SELECT system_id, system_name, region_name, security_status, security_class, is_monitored 
             FROM {$this->systems_table} 
             WHERE system_name LIKE %s 
             ORDER BY is_popular DESC, system_name ASC 
             LIMIT %d",
            '%' . $wpdb->esc_like($query) . '%',
            $limit
        );
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        
        // If no results found, try ESI search
        if (empty($results) && strlen($query) >= 3) {
            EVE_Killfeed_Database::log('info', "No local results for '{$query}', trying ESI search");
            $esi_results = $this->search_esi_direct($query, $limit);
            if (!empty($esi_results)) {
                return $esi_results;
            }
        }
        
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
        
        if (strlen($query) < 2) {
            // Return popular regions for short queries
            return $this->get_popular_regions($limit);
        }
        
        // Search database
        $sql = $wpdb->prepare(
            "SELECT region_id, region_name, description, is_monitored 
             FROM {$this->regions_table} 
             WHERE region_name LIKE %s 
             ORDER BY is_popular DESC, region_name ASC 
             LIMIT %d",
            '%' . $wpdb->esc_like($query) . '%',
            $limit
        );
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        
        return $results ?: array();
    }
    
    /**
     * Direct ESI search with proper error handling
     */
    private function search_esi_direct($query, $limit) {
        // Use ESI search endpoint
        $search_url = 'https://esi.evetech.net/latest/search/?categories=solar_system&search=' . urlencode($query) . '&strict=false';
        
        $args = array(
            'timeout' => 15,
            'headers' => array(
                'User-Agent' => 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION,
                'Accept' => 'application/json',
            ),
            'sslverify' => true,
        );
        
        $response = wp_remote_get($search_url, $args);
        
        if (is_wp_error($response)) {
            EVE_Killfeed_Database::log('error', 'ESI search failed: ' . $response->get_error_message());
            return array();
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            EVE_Killfeed_Database::log('error', "ESI search returned HTTP {$code}");
            return array();
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['solar_system'])) {
            EVE_Killfeed_Database::log('error', 'ESI search returned invalid data');
            return array();
        }
        
        $system_ids = array_slice($data['solar_system'], 0, $limit);
        $formatted_results = array();
        
        // Get details for each system
        foreach ($system_ids as $system_id) {
            $system_details = $this->get_system_details_esi($system_id);
            if ($system_details) {
                $formatted_results[] = array(
                    'system_id' => $system_id,
                    'system_name' => $system_details['name'],
                    'region_name' => 'Unknown Region',
                    'security_status' => $system_details['security_status'] ?? 0.0,
                    'security_class' => $this->get_security_class($system_details['security_status'] ?? 0.0),
                    'is_monitored' => 0
                );
            }
        }
        
        EVE_Killfeed_Database::log('info', "ESI search for '{$query}' returned " . count($formatted_results) . " results");
        
        return $formatted_results;
    }
    
    /**
     * Get system details from ESI
     */
    private function get_system_details_esi($system_id) {
        $cache_key = 'esi_system_details_' . $system_id;
        $cached = get_transient($cache_key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $url = "https://esi.evetech.net/latest/universe/systems/{$system_id}/";
        
        $args = array(
            'timeout' => 10,
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
        
        // Cache for 1 hour
        set_transient($cache_key, $data, HOUR_IN_SECONDS);
        
        return $data;
    }
    
    /**
     * Get popular systems
     */
    public function get_popular_systems($limit = 20) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->systems_table}'");
        if (!$table_exists) {
            return array();
        }
        
        $sql = $wpdb->prepare(
            "SELECT system_id, system_name, region_name, security_status, security_class, is_monitored 
             FROM {$this->systems_table} 
             WHERE is_popular = 1 
             ORDER BY 
                CASE security_class 
                    WHEN 'highsec' THEN 1 
                    WHEN 'lowsec' THEN 2 
                    WHEN 'nullsec' THEN 3 
                    WHEN 'wormhole' THEN 4 
                END,
                system_name ASC 
             LIMIT %d",
            $limit
        );
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        return $results ?: array();
    }
    
    /**
     * Get popular regions
     */
    public function get_popular_regions($limit = 20) {
        global $wpdb;
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->regions_table}'");
        if (!$table_exists) {
            return array();
        }
        
        $sql = $wpdb->prepare(
            "SELECT region_id, region_name, description, is_monitored 
             FROM {$this->regions_table} 
             WHERE is_popular = 1 
             ORDER BY region_name ASC 
             LIMIT %d",
            $limit
        );
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        return $results ?: array();
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
        
        $sql = "SELECT system_id, system_name, region_name, security_status, security_class 
                FROM {$this->systems_table} 
                WHERE is_monitored = 1 
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
        
        $sql = "SELECT region_id, region_name, description 
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
        
        // System not in database, try to add it from ESI
        if ($monitored) {
            $added = $this->add_system_from_esi($system_name);
            if ($added) {
                EVE_Killfeed_Database::log('info', "Added new system from ESI: {$system_name}");
                return true;
            }
        }
        
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
     * Add system from ESI if not in database
     */
    private function add_system_from_esi($system_name) {
        // Search ESI for the system
        $esi_results = $this->search_esi_direct($system_name, 1);
        
        if (empty($esi_results)) {
            EVE_Killfeed_Database::log('error', "System '{$system_name}' not found in ESI");
            return false;
        }
        
        $system = $esi_results[0];
        
        global $wpdb;
        
        $result = $wpdb->insert(
            $this->systems_table,
            array(
                'system_id' => $system['system_id'],
                'system_name' => $system['system_name'],
                'region_id' => 0,
                'region_name' => $system['region_name'] ?? 'Unknown',
                'constellation_id' => 0,
                'constellation_name' => '',
                'security_status' => $system['security_status'] ?? 0.0,
                'security_class' => $system['security_class'],
                'is_popular' => 0,
                'is_monitored' => 1
            ),
            array('%d', '%s', '%d', '%s', '%d', '%s', '%f', '%s', '%d', '%d')
        );
        
        if ($result === false) {
            EVE_Killfeed_Database::log('error', "Failed to insert system {$system_name}: " . $wpdb->last_error);
        }
        
        return $result !== false;
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
            'popular_systems' => 0,
            'total_regions' => 0,
            'monitored_regions' => 0,
            'popular_regions' => 0,
            'by_security' => array()
        );
        
        if ($systems_exists) {
            $stats['total_systems'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table}");
            $stats['monitored_systems'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table} WHERE is_monitored = 1");
            $stats['popular_systems'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->systems_table} WHERE is_popular = 1");
            
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
            $stats['popular_regions'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->regions_table} WHERE is_popular = 1");
        }
        
        return $stats;
    }
}