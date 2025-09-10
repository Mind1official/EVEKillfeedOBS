<?php
/**
 * REST API endpoints class with region support
 */

class EVE_Killfeed_REST_API {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route('eve-killfeed/v1', '/killmails', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_killmails'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'limit' => array(
                    'default' => 100, // <- Default limit 
                    'validate_callback' => array($this, 'validate_limit'),
                ),
                'offset' => array(
                    'default' => 0,
                    'validate_callback' => array($this, 'validate_offset'),
                ),
                'systems' => array(
                    'default' => '',
                    'validate_callback' => array($this, 'validate_systems'),
                ),
                'regions' => array(
                    'default' => '',
                    'validate_callback' => array($this, 'validate_regions'),
                ),
                'hours' => array(
                    'default' => 24,
                    'validate_callback' => array($this, 'validate_hours'),
                ),
            ),
        ));
        
        register_rest_route('eve-killfeed/v1', '/systems', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_systems'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('eve-killfeed/v1', '/regions', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_regions'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('eve-killfeed/v1', '/stats', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_stats'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('eve-killfeed/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_status'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
    }
    
    /**
     * Check API permissions
     */
    public function check_permissions($request) {
        // Allow public access by default
        $require_auth = get_option('eve_killfeed_require_auth', false);
        
        if (!$require_auth) {
            return true;
        }
        
        // Check for API key in headers
        $api_key = $request->get_header('Authorization');
        if ($api_key) {
            $api_key = str_replace('Bearer ', '', $api_key);
            $stored_key = get_option('eve_killfeed_api_key');
            
            if ($api_key === $stored_key) {
                return true;
            }
        }
        
        return new WP_Error('unauthorized', 'API key required', array('status' => 401));
    }
    
    /**
     * Get killmails endpoint (enhanced with region support)
     */
    public function get_killmails($request) {
        $database = EVE_Killfeed_Database::get_instance();
        
        $limit = $request->get_param('limit');
        $offset = $request->get_param('offset');
        $systems_param = $request->get_param('systems');
        $regions_param = $request->get_param('regions');
        $hours = $request->get_param('hours');
        
        // Parse systems parameter
        $systems = array();
        if (!empty($systems_param)) {
            $systems = array_map('trim', explode(',', $systems_param));
            $systems = array_filter($systems);
        }
        
        // Parse regions parameter
        $regions = array();
        if (!empty($regions_param)) {
            $regions = array_map('trim', explode(',', $regions_param));
            $regions = array_filter($regions);
        }
        
        // Get killmails with enhanced filtering
        $killmails = $this->get_killmails_with_regions($database, array(
            'limit' => $limit,
            'offset' => $offset,
            'systems' => $systems,
            'regions' => $regions,
            'hours' => $hours,
        ));
        
        // Get total count with enhanced filtering
        $total = $this->get_killmail_count_with_regions($database, array(
            'systems' => $systems,
            'regions' => $regions,
            'hours' => $hours,
        ));
        
        // Process killmails for API response
        $processed_killmails = array();
        foreach ($killmails as $killmail) {
            $processed_killmails[] = array(
                'id' => (int) $killmail['id'],
                'killmail_id' => (int) $killmail['killmail_id'],
                'system_id' => (int) $killmail['system_id'],
                'system_name' => $killmail['system_name'],
                'region_name' => $killmail['region_name'] ?? 'Unknown Region',
                'ship_type_id' => (int) $killmail['ship_type_id'],
                'ship_name' => $killmail['ship_name'],
                'victim_name' => $killmail['victim_name'],
                'victim_corp' => $killmail['victim_corp'],
                'victim_alliance' => $killmail['victim_alliance'],
                'victim_corp_logo' => $this->get_corp_logo_url($killmail['victim_corp_id']),
                'victim_alliance_logo' => $this->get_alliance_logo_url($killmail['victim_alliance_id']),
                'killer_name' => $killmail['killer_name'],
                'killer_corp' => $killmail['killer_corp'],
                'killer_alliance' => $killmail['killer_alliance'],
                'killer_corp_logo' => $this->get_corp_logo_url($killmail['killer_corp_id']),
                'killer_alliance_logo' => $this->get_alliance_logo_url($killmail['killer_alliance_id']),
                'kill_time' => $killmail['kill_time'],
                'total_value' => (int) $killmail['total_value'],
                'zkb_url' => $killmail['zkb_url'],
                'created_at' => $killmail['created_at'],
                'security_status' => isset($killmail['security_status']) ? (float) $killmail['security_status'] : null,
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $processed_killmails,
            'total' => $total,
            'pagination' => array(
                'limit' => $limit,
                'offset' => $offset,
                'has_more' => ($offset + $limit) < $total,
            ),
            'filters' => array(
                'systems' => $systems,
                'regions' => $regions,
                'hours' => $hours,
            ),
        ));
    }
    
    /**
     * Get killmails with region filtering support
     */
    private function get_killmails_with_regions($database, $args) {
        global $wpdb;
        
        $defaults = array(
            'limit' => 250,
            'offset' => 0,
            'systems' => array(),
            'regions' => array(),
            'hours' => 24,
            'order_by' => 'k.kill_time',
            'order' => 'DESC'
        );
        
        $args = wp_parse_args($args, $defaults);
        
        $table_name = $wpdb->prefix . 'eve_killmails';
        
        $where_clauses = array();
        $where_values = array();
        
        // Time filter
        if ($args['hours'] > 0) {
            $where_clauses[] = "k.kill_time >= DATE_SUB(NOW(), INTERVAL %d HOUR)";
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
        
        // Region filter (check if region_name column exists)
        if (!empty($args['regions'])) {
            // Check if region_name column exists in killmails table
            $columns = $wpdb->get_col("DESCRIBE {$table_name}");
            if (in_array('region_name', $columns)) {
                $region_placeholders = implode(',', array_fill(0, count($args['regions']), '%s'));
                $location_clauses[] = "region_name IN ($region_placeholders)";
                $where_values = array_merge($where_values, $args['regions']);
            }
        }
        
        // Combine location filters with OR
        if (!empty($location_clauses)) {
            $where_clauses[] = '(' . implode(' OR ', $location_clauses) . ')';
        }
        
        $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';
        
        $sql = $wpdb->prepare(
            "SELECT k.*,s.security_status FROM {$table_name} k
			 JOIN wp_eve_systems s ON k.system_id = s.id
             {$where_sql} 
             ORDER BY {$args['order_by']} {$args['order']} 
             LIMIT %d OFFSET %d",
            array_merge($where_values, array($args['limit'], $args['offset']))
        );
		
		//EVE_Killfeed_Database::log('info', $sql);
        
        return $wpdb->get_results($sql, ARRAY_A);
    }
    
    /**
     * Get killmail count with region filtering support
     */
    private function get_killmail_count_with_regions($database, $args) {
        global $wpdb;
        
        $defaults = array(
            'systems' => array(),
            'regions' => array(),
            'hours' => 24,
        );
        
        $args = wp_parse_args($args, $defaults);
        
        $table_name = $wpdb->prefix . 'eve_killmails';
        
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
            // Check if region_name column exists in killmails table
            $columns = $wpdb->get_col("DESCRIBE {$table_name}");
            if (in_array('region_name', $columns)) {
                $region_placeholders = implode(',', array_fill(0, count($args['regions']), '%s'));
                $location_clauses[] = "region_name IN ($region_placeholders)";
                $where_values = array_merge($where_values, $args['regions']);
            }
        }
        
        // Combine location filters with OR
        if (!empty($location_clauses)) {
            $where_clauses[] = '(' . implode(' OR ', $location_clauses) . ')';
        }
        
        $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';
        
        $sql = $wpdb->prepare(
            "SELECT COUNT(*) FROM {$table_name} {$where_sql}",
            $where_values
        );
        
        return (int) $wpdb->get_var($sql);
    }
    
    /**
     * Get systems endpoint
     */
    public function get_systems($request) {
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $monitored_systems = $systems_manager->get_monitored_systems();
        
        $systems = array();
        foreach ($monitored_systems as $system) {
            $systems[] = array(
                'id' => $system['id'],
                'name' => $system['system_name'],
                'region_name' => $system['region_name'],
                'security_status' => $system['security_status'],
                'security_class' => $system['security_class'],
                'active' => true,
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $systems,
        ));
    }
    
    /**
     * Get regions endpoint
     */
    public function get_regions($request) {
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $monitored_regions = $systems_manager->get_monitored_regions();
        
        $regions = array();
        foreach ($monitored_regions as $region) {
            $regions[] = array(
                'id' => $region['id'],
                'name' => $region['region_name'],
                'description' => $region['description'],
                'active' => true,
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $regions,
        ));
    }
    
    /**
     * Get stats endpoint
     */
    public function get_stats($request) {
        $database = EVE_Killfeed_Database::get_instance();
        $stats = $database->get_statistics();
        
        // Add region statistics
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $system_stats = $systems_manager->get_system_stats();
        
        $enhanced_stats = array_merge($stats, array(
            'monitored_systems' => $system_stats['monitored_systems'],
            'monitored_regions' => $system_stats['monitored_regions'],
            'total_systems' => $system_stats['total_systems'],
            'total_regions' => $system_stats['total_regions'],
        ));
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $enhanced_stats,
        ));
    }
    
    /**
     * Get status endpoint
     */
    public function get_status($request) {
        $cron_status = EVE_Killfeed_Cron::get_cron_status();
        $database = EVE_Killfeed_Database::get_instance();
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        
        $status = array(
            'version' => EVE_KILLFEED_VERSION,
            'cron' => $cron_status,
            'monitored_systems' => array_column($systems_manager->get_monitored_systems(), 'system_name'),
            'monitored_regions' => array_column($systems_manager->get_monitored_regions(), 'region_name'),
            'recent_activity' => $database->get_killmail_count(array('hours' => 1)),
            'total_killmails' => $database->get_killmail_count(array('hours' => 0)),
        );
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $status,
        ));
    }
    
    /**
     * Validation callbacks
     */
    public function validate_limit($param, $request, $key) {
        return is_numeric($param) && $param > 0 && $param <= 500; // Max limit is 500
    }
    
    public function validate_offset($param, $request, $key) {
        return is_numeric($param) && $param >= 0;
    }
    
    public function validate_systems($param, $request, $key) {
        return is_string($param);
    }
    
    public function validate_regions($param, $request, $key) {
        return is_string($param);
    }
    
    public function validate_hours($param, $request, $key) {
        return is_numeric($param) && $param > 0 && $param <= 168; // Max 1 week
    }
    
    /**
     * Helper functions
     */
    private function get_corp_logo_url($corp_id) {
        if (!$corp_id) return null;
        return "https://images.evetech.net/corporations/{$corp_id}/logo?size=64";
    }
    
    private function get_alliance_logo_url($alliance_id) {
        if (!$alliance_id) return null;
        return "https://images.evetech.net/alliances/{$alliance_id}/logo?size=64";
    }
}