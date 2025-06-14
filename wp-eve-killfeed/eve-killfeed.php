<?php
/**
 * Plugin Name: EVE Online Killfeed
 * Plugin URI: https://github.com/your-username/eve-killfeed
 * Description: EVE Online killfeed system that fetches killmails from zKillboard and provides REST API endpoints for frontend overlays. Now with region monitoring support!
 * Version: 1.1.0
 * Author: Your Name
 * Author URI: https://your-website.com
 * License: GPL v2 or later
 * Text Domain: eve-killfeed
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('EVE_KILLFEED_VERSION', '1.1.0');
define('EVE_KILLFEED_PLUGIN_URL', plugin_dir_url(__FILE__));
define('EVE_KILLFEED_PLUGIN_PATH', plugin_dir_path(__FILE__));

/**
 * Main EVE Killfeed Plugin Class
 */
class EVE_Killfeed_Plugin {
    
    /**
     * Plugin instance
     */
    private static $instance = null;
    
    /**
     * Get plugin instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }
    
    /**
     * Initialize plugin
     */
    private function init() {
        // Load includes
        $this->load_includes();
        
        // Hook into WordPress
        add_action('init', array($this, 'init_plugin'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Admin hooks
        if (is_admin()) {
            add_action('admin_menu', array($this, 'add_admin_menu'));
            add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
            add_action('admin_notices', array($this, 'admin_notices'));
        }
        
        // AJAX hooks
        add_action('wp_ajax_eve_killfeed_manual_fetch', array($this, 'manual_fetch_killmails'));
        add_action('wp_ajax_eve_killfeed_clear_data', array($this, 'clear_killfeed_data'));
        add_action('wp_ajax_eve_killfeed_clear_unknown_data', array($this, 'clear_unknown_data'));
        add_action('wp_ajax_eve_killfeed_new_session', array($this, 'new_session'));
        add_action('wp_ajax_eve_killfeed_save_systems', array($this, 'save_monitored_systems'));
        add_action('wp_ajax_eve_killfeed_save_regions', array($this, 'save_monitored_regions'));
        add_action('wp_ajax_eve_killfeed_search_systems', array($this, 'search_systems'));
        add_action('wp_ajax_eve_killfeed_search_regions', array($this, 'search_regions'));
        add_action('wp_ajax_eve_killfeed_test_apis', array($this, 'test_api_connectivity'));
        add_action('wp_ajax_eve_killfeed_import_systems', array($this, 'import_all_systems'));
        add_action('wp_ajax_eve_killfeed_update_cron_schedule', array($this, 'update_cron_schedule'));
        add_action('wp_ajax_eve_killfeed_stop_cron_schedule', array($this, 'stop_cron_schedule'));
        add_action('wp_ajax_eve_killfeed_check_and_add_system', array($this, 'check_and_add_system'));
        add_action('wp_ajax_eve_killfeed_force_clear_systems', array($this, 'force_clear_systems'));
        add_action('wp_ajax_eve_killfeed_clear_logs', array($this, 'clear_logs'));
        add_action('wp_ajax_eve_killfeed_repair_database', array($this, 'repair_database'));
    }
    
    /**
     * Load required files
     */
    private function load_includes() {
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-database.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-systems-manager.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-systems-importer.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-cron.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-rest-api.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-zkillboard-api.php';
        require_once EVE_KILLFEED_PLUGIN_PATH . 'includes/class-esi-api.php';
    }
    
    /**
     * Initialize plugin components
     */
    public function init_plugin() {
        // Initialize database
        EVE_Killfeed_Database::get_instance();
        
        // Initialize systems manager
        EVE_Killfeed_Systems_Manager::get_instance();
        
        // Initialize systems importer
        EVE_Killfeed_Systems_Importer::get_instance();
        
        // Initialize cron
        EVE_Killfeed_Cron::get_instance();
        
        // Initialize REST API
        EVE_Killfeed_REST_API::get_instance();
        
        // Check and repair database schema if needed
        $this->check_database_schema();
        
        // Load text domain
        load_plugin_textdomain('eve-killfeed', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Check and repair database schema
     */
    private function check_database_schema() {
        $schema_version = get_option('eve_killfeed_schema_version', '1.0.0');
        
        if (version_compare($schema_version, '1.1.0', '<')) {
            // Repair schema for region support
            EVE_Killfeed_Database::repair_schema();
            update_option('eve_killfeed_schema_version', '1.1.0');
            EVE_Killfeed_Database::log('info', 'Database schema updated to version 1.1.0 with region support');
        }
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create database tables
        EVE_Killfeed_Database::create_tables();
        EVE_Killfeed_Systems_Manager::create_systems_table();
        
        // Set default options
        $this->set_default_options();
        
        // Schedule cron job
        EVE_Killfeed_Cron::schedule_cron();
        
        // Run initial API test
        $this->run_initial_setup();
        
        // Flush rewrite rules for REST API
        flush_rewrite_rules();
        
        // Set schema version
        update_option('eve_killfeed_schema_version', '1.1.0');
        
        EVE_Killfeed_Database::log('info', 'Plugin activated successfully with region support');
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clear scheduled cron job
        EVE_Killfeed_Cron::clear_cron();
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        EVE_Killfeed_Database::log('info', 'Plugin deactivated');
    }
    
    /**
     * Set default plugin options
     */
    private function set_default_options() {
        $default_options = array(
            'max_killmails' => 1000,
            'retention_hours' => 24,
            'fetch_interval' => 3, // minutes
            'enable_logging' => true,
            'api_key' => wp_generate_password(32, false),
            'recently_tracked' => array(),
        );
        
        foreach ($default_options as $key => $value) {
            if (get_option("eve_killfeed_{$key}") === false) {
                update_option("eve_killfeed_{$key}", $value);
            }
        }
    }
    
    /**
     * Run initial setup and tests
     */
    private function run_initial_setup() {
        // Test API connectivity on activation
        $zkb_api = new EVE_Killfeed_ZKillboard_API();
        $test_results = $zkb_api->test_connectivity();
        
        update_option('eve_killfeed_api_status', $test_results);
        
        EVE_Killfeed_Database::log('info', 'Plugin activated and initial API test completed');
        
        if (!empty($test_results['errors'])) {
            EVE_Killfeed_Database::log('warning', 'Initial API test found issues: ' . implode(', ', $test_results['errors']));
        }
    }
    
    /**
     * Admin notices
     */
    public function admin_notices() {
        // Only show on EVE Killfeed pages
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'eve-killfeed') === false) {
            return;
        }
        
        // Check if database schema needs repair
        $schema_version = get_option('eve_killfeed_schema_version', '1.0.0');
        if (version_compare($schema_version, '1.1.0', '<')) {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p><strong>EVE Killfeed:</strong> Database schema needs updating for region support.</p>';
            echo '<p><button type="button" class="button button-primary" id="repair-database">Update Database Schema</button></p>';
            echo '</div>';
        }
        
        // Check if systems import is needed
        $importer = EVE_Killfeed_Systems_Importer::get_instance();
        if ($importer->needs_import()) {
            $progress = $importer->get_import_progress();
            
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>EVE Killfeed:</strong> Import all EVE systems for complete coverage and faster lookups.</p>';
            
            if ($progress['imported'] > 0) {
                echo '<p>Current progress: <strong>' . number_format($progress['imported']) . '</strong> systems imported (' . $progress['progress_percent'] . '% complete)</p>';
            }
            
            echo '<p><button type="button" class="button button-primary" id="import-all-systems">Import All EVE Systems</button></p>';
            echo '<p><small>This will download all ~7,000 EVE systems from ESI and store them locally. The process runs in chunks to avoid timeouts.</small></p>';
            echo '</div>';
        }
        
        // Check if regions import is needed
        if ($importer->needs_region_import()) {
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>EVE Killfeed:</strong> Import all EVE regions for region monitoring support.</p>';
            echo '<p><button type="button" class="button button-primary" id="import-all-regions">Import All EVE Regions</button></p>';
            echo '<p><small>This will download all ~100 EVE regions from ESI and store them locally.</small></p>';
            echo '</div>';
        }
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('EVE Killfeed', 'eve-killfeed'),
            __('EVE Killfeed', 'eve-killfeed'),
            'manage_options',
            'eve-killfeed',
            array($this, 'admin_page'),
            'dashicons-analytics',
            30
        );
        
        add_submenu_page(
            'eve-killfeed',
            __('Dashboard', 'eve-killfeed'),
            __('Dashboard', 'eve-killfeed'),
            'manage_options',
            'eve-killfeed',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'eve-killfeed',
            __('Systems & Regions', 'eve-killfeed'),
            __('Systems & Regions', 'eve-killfeed'),
            'manage_options',
            'eve-killfeed-systems',
            array($this, 'systems_page')
        );
        
        add_submenu_page(
            'eve-killfeed',
            __('Logs', 'eve-killfeed'),
            __('Logs', 'eve-killfeed'),
            'manage_options',
            'eve-killfeed-logs',
            array($this, 'logs_page')
        );
    }
    
    /**
     * Enqueue admin scripts
     */
    public function admin_enqueue_scripts($hook) {
        if (strpos($hook, 'eve-killfeed') !== false) {
            wp_enqueue_script('eve-killfeed-admin', EVE_KILLFEED_PLUGIN_URL . 'assets/admin.js', array('jquery'), EVE_KILLFEED_VERSION, true);
            wp_enqueue_style('eve-killfeed-admin', EVE_KILLFEED_PLUGIN_URL . 'assets/admin.css', array(), EVE_KILLFEED_VERSION);
            
            wp_localize_script('eve-killfeed-admin', 'eveKillfeedAjax', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('eve_killfeed_nonce'),
            ));
        }
    }
    
    /**
     * Main admin page (Dashboard)
     */
    public function admin_page() {
        include EVE_KILLFEED_PLUGIN_PATH . 'templates/admin-page.php';
    }
    
    /**
     * Systems management page
     */
    public function systems_page() {
        include EVE_KILLFEED_PLUGIN_PATH . 'templates/systems-page.php';
    }
    
    /**
     * Logs page
     */
    public function logs_page() {
        include EVE_KILLFEED_PLUGIN_PATH . 'templates/logs-page.php';
    }
    
    /**
     * AJAX: Repair database schema
     */
    public function repair_database() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $result = EVE_Killfeed_Database::repair_schema();
        
        if ($result) {
            update_option('eve_killfeed_schema_version', '1.1.0');
            EVE_Killfeed_Database::log('info', 'Database schema repaired successfully');
            
            wp_send_json_success(array(
                'message' => 'Database schema updated successfully for region support!'
            ));
        } else {
            wp_send_json_error('Failed to update database schema');
        }
    }
    
    /**
     * AJAX: Stop cron schedule
     */
    public function stop_cron_schedule() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        // Stop all cron jobs
        EVE_Killfeed_Cron::stop_cron_schedule();
        
        EVE_Killfeed_Database::log('info', 'Cron schedule stopped by admin');
        
        wp_send_json(array(
            'success' => true,
            'message' => __('Cron schedule stopped successfully', 'eve-killfeed')
        ));
    }
    
    /**
     * AJAX: Clear logs
     */
    public function clear_logs() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        global $wpdb;
        $logs_table = $wpdb->prefix . 'eve_killfeed_logs';
        
        $result = $wpdb->query("DELETE FROM {$logs_table}");
        
        EVE_Killfeed_Database::log('info', "Logs cleared by admin: {$result} entries removed");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Cleared %d log entries', 'eve-killfeed'), $result)
        ));
    }
    
    /**
     * AJAX: Force clear all systems (remove stuck systems)
     */
    public function force_clear_systems() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $cleared_count = $systems_manager->force_clear_all_systems();
        
        EVE_Killfeed_Database::log('info', "Force cleared {$cleared_count} stuck systems and repopulated with fresh data");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Force cleared %d stuck systems and repopulated with fresh data', 'eve-killfeed'), $cleared_count)
        ));
    }
    
    /**
     * AJAX: Update cron schedule
     */
    public function update_cron_schedule() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $interval = intval($_POST['interval'] ?? 3);
        
        // Validate interval
        $valid_intervals = array(1, 2, 3, 5, 10, 15, 30, 60);
        if (!in_array($interval, $valid_intervals)) {
            wp_send_json(array(
                'success' => false,
                'message' => 'Invalid interval specified'
            ));
        }
        
        // Update the option
        update_option('eve_killfeed_fetch_interval', $interval);
        
        // Clear existing cron and reschedule
        EVE_Killfeed_Cron::clear_cron();
        EVE_Killfeed_Cron::schedule_cron();
        
        EVE_Killfeed_Database::log('info', "Cron schedule updated to {$interval} minutes");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Cron schedule updated to %d minutes', 'eve-killfeed'), $interval)
        ));
    }
    
    /**
     * AJAX: Check if system exists in ESI and add to database
     */
    public function check_and_add_system() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $system_name = sanitize_text_field($_POST['system_name'] ?? '');
        
        if (empty($system_name)) {
            wp_send_json(array(
                'success' => false,
                'message' => 'System name is required'
            ));
        }
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        
        // Try to search ESI directly
        $esi_results = $systems_manager->search_systems($system_name, 1);
        
        if (empty($esi_results)) {
            wp_send_json(array(
                'success' => false,
                'message' => "System '{$system_name}' not found in ESI database. Please check the spelling and try again."
            ));
        }
        
        $system = $esi_results[0];
        
        // Check if already exists in our database
        global $wpdb;
        $systems_table = $wpdb->prefix . 'eve_systems';
        
        $exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$systems_table} WHERE system_id = %d",
                $system['system_id']
            )
        );
        
        if ($exists > 0) {
            wp_send_json(array(
                'success' => false,
                'message' => "System '{$system['system_name']}' already exists in database"
            ));
        }
        
        // Insert the system
        $result = $wpdb->insert(
            $systems_table,
            array(
                'system_id' => $system['system_id'],
                'system_name' => $system['system_name'],
                'region_id' => 0,
                'region_name' => $system['region_name'] ?? 'Unknown',
                'constellation_id' => 0,
                'constellation_name' => '',
                'security_status' => $system['security_status'] ?? 0.0,
                'security_class' => $this->get_security_class($system['security_status'] ?? 0.0),
                'is_monitored' => 0
            ),
            array('%d', '%s', '%d', '%s', '%d', '%s', '%f', '%s', '%d', '%d')
        );
        
        if ($result === false) {
            EVE_Killfeed_Database::log('error', "Failed to insert system {$system['system_name']}: " . $wpdb->last_error);
            wp_send_json(array(
                'success' => false,
                'message' => 'Failed to add system to database'
            ));
        }
        
        EVE_Killfeed_Database::log('info', "Added new system from ESI: {$system['system_name']} (ID: {$system['system_id']})");
        
        wp_send_json(array(
            'success' => true,
            'message' => "System '{$system['system_name']}' found in ESI and added to database successfully!"
        ));
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
     * AJAX: Import all systems - DEPRECATED (now handled by Systems Importer)
     */
    public function import_all_systems() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        wp_send_json(array(
            'success' => false,
            'message' => 'This method is deprecated. Use the new chunked import system.'
        ));
    }
    
    /**
     * AJAX: Manual fetch killmails
     */
    public function manual_fetch_killmails() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $result = EVE_Killfeed_Cron::fetch_killmails();
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Fetched %d new killmails', 'eve-killfeed'), $result['new_kills']),
            'data' => "poop" //$result
        ));
    }
    
    /**
     * AJAX: Test API connectivity
     */
    public function test_api_connectivity() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $zkb_api = new EVE_Killfeed_ZKillboard_API();
        $result = $zkb_api->test_connectivity();
        
        // Update stored API status
        update_option('eve_killfeed_api_status', $result);
        
        wp_send_json(array(
            'success' => true,
            'message' => __('API connectivity test completed', 'eve-killfeed'),
            'data' => $result
        ));
    }
    
    /**
     * AJAX: Clear killfeed data
     */
    public function clear_killfeed_data() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $result = EVE_Killfeed_Database::clear_killmails();
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Cleared %d killmails', 'eve-killfeed'), $result),
        ));
    }
    
    /**
     * AJAX: Clear unknown data
     */
    public function clear_unknown_data() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'eve_killmails';
        
        $result = $wpdb->query("
            DELETE FROM {$table_name} 
            WHERE victim_name LIKE '%Unknown%' 
               OR ship_name LIKE '%Unknown%' 
               OR killer_name LIKE '%Unknown%'
               OR victim_corp LIKE '%Unknown%'
               OR killer_corp LIKE '%Unknown%'
        ");
        
        EVE_Killfeed_Database::log('info', "Cleared {$result} killmails with unknown data");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Cleared %d killmails with unknown data', 'eve-killfeed'), $result),
        ));
    }
    
    /**
     * AJAX: New session (clear all data and reset) - UPDATED to clear monitored systems and regions
     */
    public function new_session() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        // Clear all killmail data
        $cleared_killmails = EVE_Killfeed_Database::clear_killmails();
        
        // Clear all monitored systems and regions
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $cleared_systems = $systems_manager->clear_all_monitored_systems();
        $cleared_regions = $systems_manager->clear_all_monitored_regions();
        
        // Clear recently tracked
        update_option('eve_killfeed_recently_tracked', array());
        
        // Clear API status
        delete_option('eve_killfeed_api_status');
        delete_option('eve_killfeed_last_fetch');
        
        EVE_Killfeed_Database::log('info', "New session started: cleared {$cleared_killmails} killmails, {$cleared_systems} systems, and {$cleared_regions} regions");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('New session started! Cleared %d killmails, %d systems, and %d regions.', 'eve-killfeed'), $cleared_killmails, $cleared_systems, $cleared_regions),
        ));
    }
    
    /**
     * AJAX: Save monitored systems
     */
    public function save_monitored_systems() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $systems = isset($_POST['systems']) ? $_POST['systems'] : array();
        $systems = array_map('sanitize_text_field', $systems);
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
		if ( !isset($systems_manager) ) die("Systems Manager Is Null, Much sadness");
		
        $success_count = $systems_manager->update_monitored_systems($systems);
        
        // Update recently tracked systems
        $recently_tracked = get_option('eve_killfeed_recently_tracked', array());
        foreach ($systems as $system) {
            if (!in_array($system, $recently_tracked)) {
                array_unshift($recently_tracked, $system);
            }
        }
        // Keep only last 20
        $recently_tracked = array_slice(array_unique($recently_tracked), 0, 20);
        update_option('eve_killfeed_recently_tracked', $recently_tracked);
        
        EVE_Killfeed_Database::log('info', "Monitored systems updated: {$success_count}/" . count($systems) . " systems");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Updated %d systems successfully', 'eve-killfeed'), $success_count),
        ));
    }
    
    /**
     * AJAX: Save monitored regions
     */
    public function save_monitored_regions() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $regions = isset($_POST['regions']) ? $_POST['regions'] : array();
        $regions = array_map('sanitize_text_field', $regions);
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $success_count = $systems_manager->update_monitored_regions($regions);
        
        EVE_Killfeed_Database::log('info', "Monitored regions updated: {$success_count}/" . count($regions) . " regions");
        
        wp_send_json(array(
            'success' => true,
            'message' => sprintf(__('Updated %d regions successfully', 'eve-killfeed'), $success_count),
        ));
    }
    
    /**
     * AJAX: Search systems
     */
    public function search_systems() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $query = sanitize_text_field($_POST['query'] ?? '');
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $systems = $systems_manager->search_systems($query, 20);
        
        wp_send_json(array(
            'success' => true,
            'data' => $systems,
        ));
    }
    
    /**
     * AJAX: Search regions
     */
    public function search_regions() {
        check_ajax_referer('eve_killfeed_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'eve-killfeed'));
        }
        
        $query = sanitize_text_field($_POST['query'] ?? '');
        
        $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
        $regions = $systems_manager->search_regions($query, 20);
        
        wp_send_json(array(
            'success' => true,
            'data' => $regions,
        ));
    }
}

// Initialize plugin
EVE_Killfeed_Plugin::get_instance();