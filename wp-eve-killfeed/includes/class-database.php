<?php
/**
 * Database management class with region support
 */

class EVE_Killfeed_Database {
    
    private static $instance = null;
    private $table_name;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'eve_killmails';
    }
    
    /**
     * Create database tables with region support
     */
    public static function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'eve_killmails';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            killmail_id bigint(20) NOT NULL,
            system_id int(11) NOT NULL,
            system_name varchar(255) NOT NULL,
            region_name varchar(255) DEFAULT 'Unknown Region',
            ship_type_id int(11) NOT NULL,
            ship_name varchar(255) NOT NULL,
            victim_name varchar(255) NOT NULL,
            victim_corp varchar(255) NOT NULL,
            victim_alliance varchar(255) DEFAULT '',
            victim_corp_id int(11) DEFAULT 0,
            victim_alliance_id int(11) DEFAULT 0,
            killer_name varchar(255) NOT NULL,
            killer_corp varchar(255) NOT NULL,
            killer_alliance varchar(255) DEFAULT '',
            killer_corp_id int(11) DEFAULT 0,
            killer_alliance_id int(11) DEFAULT 0,
            kill_time datetime NOT NULL,
            total_value bigint(20) DEFAULT 0,
            zkb_url text NOT NULL,
            killmail_data longtext NOT NULL,
            security_status decimal(3,2) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY killmail_id (killmail_id),
            KEY system_id (system_id),
            KEY system_name (system_name),
            KEY region_name (region_name),
            KEY kill_time (kill_time),
            KEY total_value (total_value),
            KEY security_status (security_status),
            KEY created_at (created_at),
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Create logs table
        $logs_table = $wpdb->prefix . 'eve_killfeed_logs';
        
        $logs_sql = "CREATE TABLE $logs_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            level varchar(10) NOT NULL DEFAULT 'info',
            message text NOT NULL,
            context longtext DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            KEY level (level),
            KEY created_at (created_at),
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        dbDelta($logs_sql);
        
        // Check if security_status column exists, add if missing
        $columns = $wpdb->get_col("DESCRIBE {$table_name}");
        if (!in_array('security_status', $columns)) {
            $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN security_status decimal(3,2) DEFAULT NULL AFTER killmail_data");
            $wpdb->query("ALTER TABLE {$table_name} ADD KEY security_status (security_status)");
            EVE_Killfeed_Database::log('info', 'Added security_status column to killmails table');
        }
        
        // Check if region_name column exists, add if missing
        if (!in_array('region_name', $columns)) {
            $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN region_name varchar(255) DEFAULT 'Unknown Region' AFTER system_name");
            $wpdb->query("ALTER TABLE {$table_name} ADD KEY region_name (region_name)");
            EVE_Killfeed_Database::log('info', 'Added region_name column to killmails table');
        }
    }
    
    /**
     * Insert a killmail with region support and enhanced error handling
     */
    public function insert_killmail($data) {
        global $wpdb;
        
        // Validate required fields
        $required_fields = array('killmail_id', 'system_id', 'system_name', 'ship_type_id', 'ship_name', 
                               'victim_name', 'victim_corp', 'killer_name', 'killer_corp', 'kill_time', 
                               'total_value', 'zkb_url', 'killmail_data');
        
        foreach ($required_fields as $field) {
            if (!isset($data[$field])) {
                EVE_Killfeed_Database::log('error', "Missing required field '{$field}' for killmail insertion");
                return false;
            }
        }
        
        // Sanitize and prepare data
        $insert_data = array(
            'killmail_id' => (int) $data['killmail_id'],
            'system_id' => (int) $data['system_id'],
            'system_name' => sanitize_text_field($data['system_name']),
            'region_name' => sanitize_text_field($data['region_name'] ?? 'Unknown Region'),
            'ship_type_id' => (int) $data['ship_type_id'],
            'ship_name' => sanitize_text_field($data['ship_name']),
            'victim_name' => sanitize_text_field($data['victim_name']),
            'victim_corp' => sanitize_text_field($data['victim_corp']),
            'victim_alliance' => sanitize_text_field($data['victim_alliance'] ?? ''),
            'victim_corp_id' => (int) ($data['victim_corp_id'] ?? 0),
            'victim_alliance_id' => (int) ($data['victim_alliance_id'] ?? 0),
            'killer_name' => sanitize_text_field($data['killer_name']),
            'killer_corp' => sanitize_text_field($data['killer_corp']),
            'killer_alliance' => sanitize_text_field($data['killer_alliance'] ?? ''),
            'killer_corp_id' => (int) ($data['killer_corp_id'] ?? 0),
            'killer_alliance_id' => (int) ($data['killer_alliance_id'] ?? 0),
            'kill_time' => $data['kill_time'],
            'total_value' => (int) $data['total_value'],
            'zkb_url' => esc_url_raw($data['zkb_url']),
            'killmail_data' => is_string($data['killmail_data']) ? $data['killmail_data'] : json_encode($data['killmail_data']),
        );
        
        $format = array(
            '%d', '%d', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%d', '%d',
            '%s', '%s', '%s', '%d', '%d', '%s', '%d', '%s', '%s', '%f'
        );
        
        $result = $wpdb->insert($this->table_name, $insert_data, $format);
        
        if ($result === false) {
            EVE_Killfeed_Database::log('error', "Database insertion failed for killmail {$data['killmail_id']}: " . $wpdb->last_error);
            EVE_Killfeed_Database::log('error', "Failed data: " . json_encode($insert_data));
            return false;
        }
        
        return true;
    }
    
    /**
     * Get killmails with region support
     */
    public function get_killmails($args = array()) {
        global $wpdb;
        
        $defaults = array(
            'limit' => 50,
            'offset' => 0,
            'systems' => array(),
            'regions' => array(),
            'hours' => 24,
            'order_by' => 'kill_time',
            'order' => 'DESC'
        );
        
        $args = wp_parse_args($args, $defaults);
        
        $where_clauses = array();
        $where_values = array();
        
        // Time filter
        if ($args['hours'] > 0) {
            $where_clauses[] = "kill_time >= DATE_SUB(NOW(), INTERVAL %d HOUR)";
            $where_values[] = $args['hours'];
        }
        
        // System and region filter
        $location_clauses = array();
        
        // System filter
        if (!empty($args['systems'])) {
            $system_placeholders = implode(',', array_fill(0, count($args['systems']), '%s'));
            $location_clauses[] = "system_name IN ($system_placeholders)";
            $where_values = array_merge($where_values, $args['systems']);
        }
        
        // Region filter
        if (!empty($args['regions'])) {
            $region_placeholders = implode(',', array_fill(0, count($args['regions']), '%s'));
            $location_clauses[] = "region_name IN ($region_placeholders)";
            $where_values = array_merge($where_values, $args['regions']);
        }
        
        // Combine location filters with OR
        if (!empty($location_clauses)) {
            $where_clauses[] = '(' . implode(' OR ', $location_clauses) . ')';
        }
        
        $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';
        
        $sql = $wpdb->prepare(
            "SELECT k.*, s.security_status FROM {$this->table_name} 
             {$where_sql} 
			 JOIN wp_eve_systems s on k.system_id = s.system_id
             ORDER BY {$args['order_by']} {$args['order']} 
             LIMIT %d OFFSET %d",
            array_merge($where_values, array($args['limit'], $args['offset']))
        );
        
        return $wpdb->get_results($sql, ARRAY_A);
    }
    
    /**
     * Get killmail count with region support
     */
    public function get_killmail_count($args = array()) {
        global $wpdb;
        
        $defaults = array(
            'systems' => array(),
            'regions' => array(),
            'hours' => 24,
        );
        
        $args = wp_parse_args($args, $defaults);
        
        $where_clauses = array();
        $where_values = array();
        
        // Time filter
        if ($args['hours'] > 0) {
            $where_clauses[] = "kill_time >= DATE_SUB(NOW(), INTERVAL %d HOUR)";
            $where_values[] = $args['hours'];
        }
        
        // System and region filter
        $location_clauses = array();
        
        // System filter
        if (!empty($args['systems'])) {
            $system_placeholders = implode(',', array_fill(0, count($args['systems']), '%s'));
            $location_clauses[] = "system_name IN ($system_placeholders)";
            $where_values = array_merge($where_values, $args['systems']);
        }
        
        // Region filter
        if (!empty($args['regions'])) {
            $region_placeholders = implode(',', array_fill(0, count($args['regions']), '%s'));
            $location_clauses[] = "region_name IN ($region_placeholders)";
            $where_values = array_merge($where_values, $args['regions']);
        }
        
        // Combine location filters with OR
        if (!empty($location_clauses)) {
            $where_clauses[] = '(' . implode(' OR ', $location_clauses) . ')';
        }
        
        $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';
        
        $sql = $wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_name} {$where_sql}",
            $where_values
        );
        
        return (int) $wpdb->get_var($sql);
    }
    
    /**
     * Check if killmail exists
     */
    public function killmail_exists($killmail_id) {
        global $wpdb;
        
        $sql = $wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_name} WHERE killmail_id = %d",
            $killmail_id
        );
        
        return (int) $wpdb->get_var($sql) > 0;
    }
    
    /**
     * Clear old killmails
     */
    public function cleanup_old_killmails($hours = 24) {
        global $wpdb;
        
        $sql = $wpdb->prepare(
            "DELETE FROM {$this->table_name} WHERE kill_time < DATE_SUB(NOW(), INTERVAL %d HOUR)",
            $hours
        );
        
        return $wpdb->query($sql);
    }
    
    /**
     * Clear all killmails
     */
    public static function clear_killmails() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'eve_killmails';
        $result = $wpdb->query("DELETE FROM {$table_name}");
        
        return $result;
    }
    
    /**
     * Get statistics with region support
     */
    public function get_statistics() {
        global $wpdb;
        
        $stats = array();
        
        // Total killmails
        $stats['total_killmails'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name}");
        
        // Killmails in last 24 hours
        $stats['killmails_24h'] = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
        );
        
        // Killmails in last hour
        $stats['killmails_1h'] = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)"
        );
        
        // Total ISK destroyed in last 24 hours
        $stats['total_isk_24h'] = (float) $wpdb->get_var(
            "SELECT SUM(total_value) FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
        );
        
        // Average kill value in last 24 hours
        $stats['avg_kill_value_24h'] = (float) $wpdb->get_var(
            "SELECT AVG(total_value) FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
        );
        
        // Most active systems
        $stats['top_systems'] = $wpdb->get_results(
            "SELECT system_name, COUNT(*) as kill_count, SUM(total_value) as total_isk 
             FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
             GROUP BY system_name 
             ORDER BY kill_count DESC 
             LIMIT 10",
            ARRAY_A
        );
        
        // Most active regions
        $stats['top_regions'] = $wpdb->get_results(
            "SELECT region_name, COUNT(*) as kill_count, SUM(total_value) as total_isk 
             FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
             GROUP BY region_name 
             ORDER BY kill_count DESC 
             LIMIT 10",
            ARRAY_A
        );
        
        // Biggest kills in last 24 hours
        $stats['biggest_kills'] = $wpdb->get_results(
            "SELECT killmail_id, system_name, region_name, ship_name, victim_name, total_value, zkb_url
             FROM {$this->table_name} 
             WHERE kill_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
             ORDER BY total_value DESC 
             LIMIT 5",
            ARRAY_A
        );
        
        return $stats;
    }
    
    /**
     * Log message
     */
    public static function log($level, $message, $context = null) {
        if (!get_option('eve_killfeed_enable_logging', true)) {
            return;
        }
        
        global $wpdb;
        
        $logs_table = $wpdb->prefix . 'eve_killfeed_logs';
        
        $wpdb->insert(
            $logs_table,
            array(
                'level' => $level,
                'message' => $message,
                'context' => is_array($context) ? json_encode($context) : $context,
            ),
            array('%s', '%s', '%s')
        );
    }
    
    /**
     * Get logs
     */
    public static function get_logs($limit = 100, $level = null) {
        global $wpdb;
        
        $logs_table = $wpdb->prefix . 'eve_killfeed_logs';
        
        $where_sql = '';
        if ($level) {
            $where_sql = $wpdb->prepare("WHERE level = %s", $level);
        }
        
        $sql = $wpdb->prepare(
            "SELECT * FROM {$logs_table} {$where_sql} ORDER BY created_at DESC LIMIT %d",
            $limit
        );
        
        return $wpdb->get_results($sql, ARRAY_A);
    }
    
    /**
     * Repair database schema for region support and security status
     */
    public static function repair_schema() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'eve_killmails';
        
        // Check if columns exist
        $columns = $wpdb->get_col("DESCRIBE {$table_name}");
        
        $changes_made = false;
        
        if (!in_array('region_name', $columns)) {
            // Add region_name column
            $result = $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN region_name varchar(255) DEFAULT 'Unknown Region' AFTER system_name");
            
            if ($result !== false) {
                // Add index for region_name
                $wpdb->query("ALTER TABLE {$table_name} ADD KEY region_name (region_name)");
                EVE_Killfeed_Database::log('info', 'Successfully added region_name column and index');
                $changes_made = true;
            } else {
                EVE_Killfeed_Database::log('error', 'Failed to add region_name column: ' . $wpdb->last_error);
            }
        }
        
        if (!in_array('security_status', $columns)) {
            // Add security_status column
            $result = $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN security_status decimal(3,2) DEFAULT NULL AFTER killmail_data");
            
            if ($result !== false) {
                // Add index for security_status
                $wpdb->query("ALTER TABLE {$table_name} ADD KEY security_status (security_status)");
                EVE_Killfeed_Database::log('info', 'Successfully added security_status column and index');
                $changes_made = true;
            } else {
                EVE_Killfeed_Database::log('error', 'Failed to add security_status column: ' . $wpdb->last_error);
            }
        }
        
        return $changes_made;
    }
}