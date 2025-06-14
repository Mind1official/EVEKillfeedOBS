<?php
/**
 * zKillboard API client class - Enhanced with Region Support
 */

class EVE_Killfeed_ZKillboard_API {
    
    private $base_url = 'https://zkillboard.com/api/';
    private $user_agent;
    private $rate_limit_delay = 2; // seconds between requests
    private $systems_table;
    private $regions_table;
    
    public function __construct() {
        $this->user_agent = 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION . ' (WordPress)';
        global $wpdb;
        $this->systems_table = $wpdb->prefix . 'eve_systems';
        $this->regions_table = $wpdb->prefix . 'eve_regions';
    }
    
    /**
     * Get killmails for specific systems
     */
    public function get_system_killmails($system_name, $limit = 100) {
        // Get system ID
        $system_id = $this->get_system_id($system_name);
        
        if (!$system_id) {
            EVE_Killfeed_Database::log('error', "Could not find system ID for: {$system_name}");
            return false;
        }
        
        EVE_Killfeed_Database::log('info', "Fetching killmails for {$system_name} (ID: {$system_id})");
        
        // Fetch killmails from zKillboard
        $killmails = $this->fetch_system_killmails($system_id, $limit);
        
        if ($killmails === false) {
            EVE_Killfeed_Database::log('error', "Failed to fetch killmails for {$system_name}");
            return false;
        }
        
        if (empty($killmails)) {
            EVE_Killfeed_Database::log('info', "No killmails found for {$system_name}");
            return array();
        }
        
        EVE_Killfeed_Database::log('info', "Processing " . count($killmails) . " killmails for {$system_name}");
        
        $processed_killmails = array();
        $count = 0;
        
        foreach ($killmails as $kill_data) {
            if ($count >= $limit) break;
            
            $processed_kill = $this->process_killmail($kill_data, $system_name, $system_id);
            
            if ($processed_kill) {
                $processed_killmails[] = $processed_kill;
                $count++;
                
                EVE_Killfeed_Database::log('info', "Processed killmail {$processed_kill['killmail_id']}: {$processed_kill['victim_name']} ({$processed_kill['ship_name']}) killed by {$processed_kill['killer_name']}");
            }
        }
        
        EVE_Killfeed_Database::log('info', "Successfully processed {$count} killmails for {$system_name}");
        
        return $processed_killmails;
    }
    
    /**
     * Get killmails for specific regions
     */
    public function get_region_killmails($region_name, $limit = 100) {
        // Get region ID
        $region_id = $this->get_region_id($region_name);
        
        if (!$region_id) {
            EVE_Killfeed_Database::log('error', "Could not find region ID for: {$region_name}");
            return false;
        }
        
        EVE_Killfeed_Database::log('info', "Fetching killmails for {$region_name} (ID: {$region_id})");
        
        // Fetch killmails from zKillboard
        $killmails = $this->fetch_region_killmails($region_id, $limit);
        
        if ($killmails === false) {
            EVE_Killfeed_Database::log('error', "Failed to fetch killmails for {$region_name}");
            return false;
        }
        
        if (empty($killmails)) {
            EVE_Killfeed_Database::log('info', "No killmails found for {$region_name}");
            return array();
        }
        
        EVE_Killfeed_Database::log('info', "Processing " . count($killmails) . " killmails for {$region_name}");
        
        $processed_killmails = array();
        $count = 0;
        
        foreach ($killmails as $kill_data) {
            if ($count >= $limit) break;
            
            $processed_kill = $this->process_killmail($kill_data, $region_name, null, true);
            
            if ($processed_kill) {
                $processed_killmails[] = $processed_kill;
                $count++;
                
                EVE_Killfeed_Database::log('info', "Processed killmail {$processed_kill['killmail_id']}: {$processed_kill['victim_name']} ({$processed_kill['ship_name']}) killed by {$processed_kill['killer_name']}");
            }
        }
        
        EVE_Killfeed_Database::log('info', "Successfully processed {$count} killmails for {$region_name}");
        
        return $processed_killmails;
    }
    
    /**
     * Get system ID from name
     */
    private function get_system_id($system_name) {
        global $wpdb;

        $systemId = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$this->systems_table} WHERE system_name = %s",
                $system_name
            )
        );

        return $systemId;
        
        EVE_Killfeed_Database::log('warning', "System '{$system_name}' not found");
        return false;
    }
    
    /**
     * Get region ID from name
     */
    private function get_region_id($region_name) {
        global $wpdb;

        try {
            $regionId = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$this->regions_table} WHERE region_name = %s",
                    $region_name
                )
            );

            EVE_Killfeed_Database::log('info', "Found Region ID '{$regionId}' for '{$region_name}'");
            
            return $regionId;
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('warning', $e->getMessage());
        }
        
        EVE_Killfeed_Database::log('warning', "Region '{$region_name}' not found");
        return false;
    }
    
    /**
     * Search for system using ESI
     */
    private function search_system_esi($system_name) {
        $search_url = 'https://esi.evetech.net/latest/search/?categories=solar_system&search=' . urlencode($system_name) . '&strict=false';
        
        $response = $this->make_request($search_url);
        
        if ($response && isset($response['solar_system']) && !empty($response['solar_system'])) {
            return $response['solar_system'][0]; // Return first match
        }
        
        return false;
    }
    
    /**
     * Search for region using ESI
     */
    private function search_region_esi($region_name) {
        $search_url = 'https://esi.evetech.net/latest/search/?categories=region&search=' . urlencode($region_name) . '&strict=false';
        
        $response = $this->make_request($search_url);
        
        if ($response && isset($response['region']) && !empty($response['region'])) {
            return $response['region'][0]; // Return first match
        }
        
        return false;
    }
    
    /**
     * Fetch killmails from zKillboard for a system
     */
    private function fetch_system_killmails($system_id, $limit) {
        $strategies = array(
            'system' => "kills/solarSystemID/{$system_id}/",
            'system_recent' => "kills/solarSystemID/{$system_id}/recent/",
            'system_page1' => "kills/solarSystemID/{$system_id}/page/1/",
        );
        
        foreach ($strategies as $strategy_name => $endpoint) {
            EVE_Killfeed_Database::log('info', "Trying {$strategy_name} strategy: {$endpoint}");
            
            $url = $this->base_url . $endpoint;
            $response = $this->make_request($url);
            
            if ($response !== false && is_array($response) && !empty($response)) {
                EVE_Killfeed_Database::log('info', "Success with {$strategy_name}: " . count($response) . " killmails");
                return array_slice($response, 0, $limit);
            }
            
            // Wait between attempts
            sleep(1);
        }
        
        return false;
    }
    
    /**
     * Fetch killmails from zKillboard for a region
     */
    private function fetch_region_killmails($region_id, $limit) {
        $strategies = array(
            'region' => "kills/regionID/{$region_id}/",
            'region_recent' => "kills/regionID/{$region_id}/recent/",
            'region_page1' => "kills/regionID/{$region_id}/page/1/",
        );
        
        foreach ($strategies as $strategy_name => $endpoint) {
            EVE_Killfeed_Database::log('info', "Trying {$strategy_name} strategy: {$endpoint}");
            
            $url = $this->base_url . $endpoint;
            $response = $this->make_request($url);
            
            if ($response !== false && is_array($response) && !empty($response)) {
                EVE_Killfeed_Database::log('info', "Success with {$strategy_name}: " . count($response) . " killmails");
                return array_slice($response, 0, $limit);
            }
            
            // Wait between attempts
            sleep(1);
        }
        
        return false;
    }
    
    /**
     * Process killmail data and enrich with ESI - ENHANCED with local system lookup
     */
    private function process_killmail($kill_data, $location_name, $system_id = null, $is_region = false) {
        if (!isset($kill_data['killmail_id'])) {
            EVE_Killfeed_Database::log('warning', "Killmail data missing killmail_id");
            return false;
        }
        
        $killmail_id = $kill_data['killmail_id'];
        $zkb_data = $kill_data['zkb'] ?? array();
        $total_value = $zkb_data['totalValue'] ?? 0;
        $hash = $zkb_data['hash'] ?? '';
        
        // Get detailed killmail data from ESI
        $killmail_detail = null;
        if (!empty($hash)) {
            $killmail_detail = $this->get_killmail_detail($killmail_id, $hash);
        }
        
        if (!$killmail_detail) {
            // Create basic killmail without detailed info
            return array(
                'killmail_id' => $killmail_id,
                'system_id' => $system_id ?: 0,
                'system_name' => $is_region ? 'Unknown System' : $location_name,
                'region_name' => $is_region ? $location_name : 'Unknown Region',
                'ship_type_id' => 0,
                'ship_name' => 'Unknown Ship',
                'victim_name' => 'Unknown Pilot',
                'victim_corp' => 'Unknown Corporation',
                'victim_alliance' => '',
                'victim_corp_id' => 0,
                'victim_alliance_id' => 0,
                'killer_name' => 'Unknown Killer',
                'killer_corp' => 'Unknown Corporation',
                'killer_alliance' => '',
                'killer_corp_id' => 0,
                'killer_alliance_id' => 0,
                'kill_time' => date('Y-m-d H:i:s'),
                'total_value' => $total_value,
                'zkb_url' => "https://zkillboard.com/kill/{$killmail_id}/",
                'killmail_data' => json_encode($kill_data),
                'security_status' => null,
            );
        }
        
        $victim = $killmail_detail['victim'] ?? array();
        $attackers = $killmail_detail['attackers'] ?? array();
        
        // Find final blow attacker
        $final_blow = null;
        foreach ($attackers as $attacker) {
            if ($attacker['final_blow'] ?? false) {
                $final_blow = $attacker;
                break;
            }
        }
        if (!$final_blow && !empty($attackers)) {
            $final_blow = $attackers[0];
        }
        if (!$final_blow) {
            $final_blow = array();
        }
        
        // Extract IDs
        $victim_character_id = $victim['character_id'] ?? 0;
        $victim_corp_id = $victim['corporation_id'] ?? 0;
        $victim_alliance_id = $victim['alliance_id'] ?? 0;
        $ship_type_id = $victim['ship_type_id'] ?? 0;
        
        $killer_character_id = $final_blow['character_id'] ?? 0;
        $killer_corp_id = $final_blow['corporation_id'] ?? 0;
        $killer_alliance_id = $final_blow['alliance_id'] ?? 0;
        
        // Get names from ESI with caching
        $victim_name = $this->get_character_name($victim_character_id);
        $victim_corp = $this->get_corporation_name($victim_corp_id);
        $victim_alliance = $this->get_alliance_name($victim_alliance_id);
        
        $killer_name = $this->get_character_name($killer_character_id);
        $killer_corp = $this->get_corporation_name($killer_corp_id);
        $killer_alliance = $this->get_alliance_name($killer_alliance_id);
        
        $ship_name = $this->get_ship_name($ship_type_id);
        
        // Get system information - ENHANCED to use local database first
        $actual_system_id = $killmail_detail['solar_system_id'] ?? $system_id;
        $actual_system_name = $location_name;
        $actual_region_name = $is_region ? $location_name : 'Unknown Region';
        $security_status = null;
        
        EVE_Killfeed_Database::log('info', "Starting fetch for system ID {$actual_system_id} in region {$actual_region_name}");
        if ($actual_system_id) {
            // Try to get system details from local database first
            $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
            $local_system_info = $systems_manager->get_system_details_by_id($actual_system_id);
            
            if ($local_system_info) {
                // Use local database information
                $actual_system_name = $local_system_info['system_name'];
                $actual_region_name = $local_system_info['region_name'];
                $security_status = (float) $local_system_info['security_status'];
                
                EVE_Killfeed_Database::log('info', "Using local system data for {$actual_system_name}: security {$security_status}");
            } else {
                // Fallback to ESI if not in local database
                $system_info = $this->get_system_info($actual_system_id);
                if ($system_info) {
                    $actual_system_name = $system_info['name'] ?? $actual_system_name;
                    $security_status = $system_info['security_status'] ?? null;
                    
                    EVE_Killfeed_Database::log('info', "Using ESI system data for {$actual_system_name}: security {$security_status}");
                } else {
                    EVE_Killfeed_Database::log('warning', "Could not find system information for ID {$actual_system_id}");
                }
            }
        } else {
            EVE_Killfeed_Database::log('warning', "No system ID found in killmail data, using provided system ID {$system_id}");
        }
        
        // For region killmails, ensure we have the correct system name
        if ($is_region && $actual_system_id && $actual_system_name === $location_name) {
            // We need to get the actual system name since location_name is the region
            if (!isset($local_system_info)) {
                $systems_manager = EVE_Killfeed_Systems_Manager::get_instance();
                $local_system_info = $systems_manager->get_system_details_by_id($actual_system_id);
            }
            
            if ($local_system_info) {
                $actual_system_name = $local_system_info['system_name'];
            } else {
                // Fallback to ESI
                $system_info = $this->get_system_info($actual_system_id);
                if ($system_info) {
                    $actual_system_name = $system_info['name'] ?? 'Unknown System';
                }
            }
        }
        
        // Format kill time
        $kill_time = $killmail_detail['killmail_time'] ?? date('Y-m-d H:i:s');
        if (strpos($kill_time, 'T') !== false) {
            $kill_time = str_replace('T', ' ', $kill_time);
            $kill_time = str_replace('Z', '', $kill_time);
            if (strpos($kill_time, '.') !== false) {
                $kill_time = substr($kill_time, 0, strpos($kill_time, '.'));
            }
        }
        
        return array(
            'killmail_id' => $killmail_id,
            'system_id' => $actual_system_id ?: 0,
            'system_name' => $actual_system_name,
            'region_name' => $actual_region_name,
            'ship_type_id' => $ship_type_id,
            'ship_name' => $ship_name,
            'victim_name' => $victim_name,
            'victim_corp' => $victim_corp,
            'victim_alliance' => $victim_alliance,
            'victim_corp_id' => $victim_corp_id,
            'victim_alliance_id' => $victim_alliance_id,
            'killer_name' => $killer_name,
            'killer_corp' => $killer_corp,
            'killer_alliance' => $killer_alliance,
            'killer_corp_id' => $killer_corp_id,
            'killer_alliance_id' => $killer_alliance_id,
            'kill_time' => $kill_time,
            'total_value' => $total_value,
            'zkb_url' => "https://zkillboard.com/kill/{$killmail_id}/",
            'killmail_data' => json_encode($kill_data),
            'security_status' => $security_status,
        );
    }
    
    /**
     * Get system information from ESI (fallback method)
     */
    private function get_system_info($system_id) {
        $cache_key = 'eve_system_info_' . $system_id;
        $cached_info = get_transient($cache_key);
        
        if ($cached_info !== false) {
            return $cached_info;
        }
        
        $url = "https://esi.evetech.net/latest/universe/systems/{$system_id}/";
        $response = $this->make_request($url);
        
        if ($response !== false) {
            set_transient($cache_key, $response, 24 * HOUR_IN_SECONDS);
        }
        
        return $response;
    }
    
    /**
     * Get detailed killmail from ESI
     */
    private function get_killmail_detail($killmail_id, $hash) {
        if (empty($hash)) {
            return false;
        }
        
        $url = "https://esi.evetech.net/latest/killmails/{$killmail_id}/{$hash}/";
        return $this->make_request($url);
    }
    
    /**
     * Get character name with caching
     */
    private function get_character_name($character_id) {
        if (!$character_id) return 'Unknown Pilot';
        
        $cache_key = 'eve_character_' . $character_id;
        $cached_name = get_transient($cache_key);
        
        if ($cached_name !== false) {
            return $cached_name;
        }
        
        $url = "https://esi.evetech.net/latest/characters/{$character_id}/";
        $response = $this->make_request($url);
        
        $name = ($response && isset($response['name'])) ? $response['name'] : "Pilot #{$character_id}";
        
        // Cache for 1 hour
        set_transient($cache_key, $name, HOUR_IN_SECONDS);
        
        return $name;
    }
    
    /**
     * Get corporation name with caching
     */
    private function get_corporation_name($corp_id) {
        if (!$corp_id) return 'Unknown Corporation';
        
        $cache_key = 'eve_corporation_' . $corp_id;
        $cached_name = get_transient($cache_key);
        
        if ($cached_name !== false) {
            return $cached_name;
        }
        
        $url = "https://esi.evetech.net/latest/corporations/{$corp_id}/";
        $response = $this->make_request($url);
        
        $name = ($response && isset($response['name'])) ? $response['name'] : "Corporation #{$corp_id}";
        
        // Cache for 1 hour
        set_transient($cache_key, $name, HOUR_IN_SECONDS);
        
        return $name;
    }
    
    /**
     * Get alliance name with caching
     */
    private function get_alliance_name($alliance_id) {
        if (!$alliance_id) return '';
        
        $cache_key = 'eve_alliance_' . $alliance_id;
        $cached_name = get_transient($cache_key);
        
        if ($cached_name !== false) {
            return $cached_name;
        }
        
        $url = "https://esi.evetech.net/latest/alliances/{$alliance_id}/";
        $response = $this->make_request($url);
        
        $name = ($response && isset($response['name'])) ? $response['name'] : "Alliance #{$alliance_id}";
        
        // Cache for 1 hour
        set_transient($cache_key, $name, HOUR_IN_SECONDS);
        
        return $name;
    }
    
    /**
     * Get ship name with caching
     */
    private function get_ship_name($type_id) {
        if (!$type_id) return 'Unknown Ship';
        
        $cache_key = 'eve_type_' . $type_id;
        $cached_name = get_transient($cache_key);
        
        if ($cached_name !== false) {
            return $cached_name;
        }
        
        $url = "https://esi.evetech.net/latest/universe/types/{$type_id}/";
        $response = $this->make_request($url);
        
        $name = ($response && isset($response['name'])) ? $response['name'] : "Ship #{$type_id}";
        
        // Cache for 24 hours
        set_transient($cache_key, $name, 24 * HOUR_IN_SECONDS);
        
        return $name;
    }
    
    /**
     * Make HTTP request with error handling
     */
    private function make_request($url) {
        $args = array(
            'timeout' => 30,
            'redirection' => 3,
            'httpversion' => '1.1',
            'user-agent' => $this->user_agent,
            'headers' => array(
                'Accept' => 'application/json',
                'Accept-Encoding' => 'gzip, deflate',
                'Connection' => 'close',
                'Cache-Control' => 'no-cache',
            ),
            'sslverify' => true,
            'blocking' => true,
            'compress' => false,
            'decompress' => true,
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            EVE_Killfeed_Database::log('error', "HTTP request failed for {$url}: {$error_message}");
            return false;
        }
        
        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($code === 404) {
            return false;
        }
        
        if ($code === 420) {
            EVE_Killfeed_Database::log('warning', "Rate limited (420) - will retry later");
            return false;
        }
        
        if ($code !== 200) {
            EVE_Killfeed_Database::log('error', "HTTP error {$code} for: {$url}");
            return false;
        }
        
        if (empty($body)) {
            return false;
        }
        
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            EVE_Killfeed_Database::log('error', "JSON decode error for {$url}: " . json_last_error_msg());
            return false;
        }
        
        return $data;
    }
    
    /**
     * Test API connectivity
     */
    public function test_connectivity() {
        $results = array(
            'esi_status' => false,
            'zkb_status' => false,
            'system_lookup' => false,
            'region_lookup' => false,
            'killmail_fetch' => false,
            'region_killmail_fetch' => false,
            'errors' => array(),
            'diagnostics' => array()
        );
        
        // Test ESI status
        try {
            $esi_response = $this->make_request('https://esi.evetech.net/latest/status/');
            if ($esi_response && isset($esi_response['players'])) {
                $results['esi_status'] = true;
                $results['diagnostics']['esi_players'] = $esi_response['players'];
            } else {
                $results['errors'][] = 'ESI status check failed';
            }
        } catch (Exception $e) {
            $results['errors'][] = 'ESI status error: ' . $e->getMessage();
        }
        
        // Test system lookup
        try {
            $jita_id = $this->get_system_id('Jita');
            $efm_id = $this->get_system_id('EFM-C4');
            
            if ($jita_id && $efm_id) {
                $results['system_lookup'] = true;
                $results['diagnostics']['jita_system_id'] = $jita_id;
                $results['diagnostics']['efm_c4_system_id'] = $efm_id;
            } else {
                $results['errors'][] = 'System lookup failed';
            }
        } catch (Exception $e) {
            $results['errors'][] = 'System lookup error: ' . $e->getMessage();
        }
        
        // Test region lookup
        try {
            $forge_id = $this->get_region_id('The Forge');
            $delve_id = $this->get_region_id('Delve');
            
            if ($forge_id && $delve_id) {
                $results['region_lookup'] = true;
                $results['diagnostics']['forge_region_id'] = $forge_id;
                $results['diagnostics']['delve_region_id'] = $delve_id;
            } else {
                $results['errors'][] = 'Region lookup failed';
            }
        } catch (Exception $e) {
            $results['errors'][] = 'Region lookup error: ' . $e->getMessage();
        }
        
        // Test zKillboard connectivity
        try {
            $zkb_response = $this->make_request('https://zkillboard.com/api/stats/');
            if ($zkb_response !== false) {
                $results['zkb_status'] = true;
            } else {
                $results['errors'][] = 'zKillboard connectivity failed';
            }
        } catch (Exception $e) {
            $results['errors'][] = 'zKillboard error: ' . $e->getMessage();
        }
        
        // Test killmail processing
        if ($results['system_lookup']) {
            try {
                $test_killmails = $this->get_system_killmails('Jita', 3);
                if ($test_killmails !== false && !empty($test_killmails)) {
                    $results['killmail_fetch'] = true;
                    $results['diagnostics']['jita_killmails_count'] = count($test_killmails);
                } else {
                    $results['errors'][] = 'Killmail processing test failed';
                }
            } catch (Exception $e) {
                $results['errors'][] = 'Killmail processing error: ' . $e->getMessage();
            }
        }
        
        // Test region killmail processing
        if ($results['region_lookup']) {
            try {
                $test_region_killmails = $this->get_region_killmails('The Forge', 3);
                if ($test_region_killmails !== false && !empty($test_region_killmails)) {
                    $results['region_killmail_fetch'] = true;
                    $results['diagnostics']['forge_killmails_count'] = count($test_region_killmails);
                } else {
                    $results['errors'][] = 'Region killmail processing test failed';
                }
            } catch (Exception $e) {
                $results['errors'][] = 'Region killmail processing error: ' . $e->getMessage();
            }
        }
        
        return $results;
    }
}