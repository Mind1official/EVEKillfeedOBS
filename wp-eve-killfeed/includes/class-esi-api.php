<?php
/**
 * EVE ESI API client class for system data
 */

class EVE_Killfeed_ESI_API {
    
    private $base_url = 'https://esi.evetech.net/latest/';
    private $user_agent;
    
    public function __construct() {
        $this->user_agent = 'EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION . ' (WordPress)';
    }
    
    /**
     * Search for systems by name
     */
    public function search_systems($query, $limit = 10) {
        if (strlen($query) < 2) {
            return array();
        }
        
        // Check cache first
        $cache_key = 'eve_system_search_' . md5($query);
        $cached_results = get_transient($cache_key);
        
        if ($cached_results !== false) {
            return $cached_results;
        }
        
        // Search ESI for systems
        $search_url = $this->base_url . 'search/?categories=solar_system&search=' . urlencode($query) . '&strict=false';
        
        $response = $this->make_request($search_url);
        
        if ($response === false || !isset($response['solar_system'])) {
            return array();
        }
        
        $system_ids = array_slice($response['solar_system'], 0, $limit);
        $systems = array();
        
        // Get system details for each ID
        foreach ($system_ids as $system_id) {
            $system_info = $this->get_system_info($system_id);
            if ($system_info) {
                $systems[] = array(
                    'id' => $system_id,
                    'name' => $system_info['name'],
                    'security' => $system_info['security_status'],
                    'region' => $system_info['region_name'] ?? 'Unknown'
                );
            }
        }
        
        // Cache results for 1 hour
        set_transient($cache_key, $systems, HOUR_IN_SECONDS);
        
        return $systems;
    }
    
    /**
     * Get system information by ID
     */
    public function get_system_info($system_id) {
        $cache_key = 'eve_system_info_' . $system_id;
        $cached_info = get_transient($cache_key);
        
        if ($cached_info !== false) {
            return $cached_info;
        }
        
        $url = $this->base_url . 'universe/systems/' . $system_id . '/';
        $response = $this->make_request($url);
        
        if ($response === false) {
            return false;
        }
        
        $system_info = array(
            'id' => $system_id,
            'name' => $response['name'],
            'security_status' => round($response['security_status'], 1),
            'constellation_id' => $response['constellation_id'] ?? 0,
        );
        
        // Get region name
        if (isset($response['constellation_id'])) {
            $constellation_info = $this->get_constellation_info($response['constellation_id']);
            if ($constellation_info && isset($constellation_info['region_id'])) {
                $region_info = $this->get_region_info($constellation_info['region_id']);
                if ($region_info) {
                    $system_info['region_name'] = $region_info['name'];
                }
            }
        }
        
        // Cache for 24 hours
        set_transient($cache_key, $system_info, 24 * HOUR_IN_SECONDS);
        
        return $system_info;
    }
    
    /**
     * Get constellation information
     */
    private function get_constellation_info($constellation_id) {
        $cache_key = 'eve_constellation_' . $constellation_id;
        $cached_info = get_transient($cache_key);
        
        if ($cached_info !== false) {
            return $cached_info;
        }
        
        $url = $this->base_url . 'universe/constellations/' . $constellation_id . '/';
        $response = $this->make_request($url);
        
        if ($response !== false) {
            set_transient($cache_key, $response, 24 * HOUR_IN_SECONDS);
        }
        
        return $response;
    }
    
    /**
     * Get region information
     */
    private function get_region_info($region_id) {
        $cache_key = 'eve_region_' . $region_id;
        $cached_info = get_transient($cache_key);
        
        if ($cached_info !== false) {
            return $cached_info;
        }
        
        $url = $this->base_url . 'universe/regions/' . $region_id . '/';
        $response = $this->make_request($url);
        
        if ($response !== false) {
            set_transient($cache_key, $response, 24 * HOUR_IN_SECONDS);
        }
        
        return $response;
    }
    
    /**
     * Get popular/major trade hub systems
     */
    public function get_popular_systems() {
        return array(
            array('id' => 30000142, 'name' => 'Jita', 'security' => 0.9, 'region' => 'The Forge'),
            array('id' => 30002187, 'name' => 'Amarr', 'security' => 1.0, 'region' => 'Domain'),
            array('id' => 30002659, 'name' => 'Dodixie', 'security' => 0.9, 'region' => 'Sinq Laison'),
            array('id' => 30002510, 'name' => 'Rens', 'security' => 0.9, 'region' => 'Heimatar'),
            array('id' => 30000144, 'name' => 'Hek', 'security' => 0.8, 'region' => 'Metropolis'),
            array('id' => 30045349, 'name' => 'Perimeter', 'security' => 1.0, 'region' => 'The Forge'),
            array('id' => 30045352, 'name' => 'Maurasi', 'security' => 0.8, 'region' => 'The Forge'),
            array('id' => 30002053, 'name' => 'Halaima', 'security' => 0.6, 'region' => 'Domain'),
        );
    }
    
    /**
     * Make HTTP request
     */
    private function make_request($url) {
        $args = array(
            'timeout' => 15,
            'headers' => array(
                'User-Agent' => $this->user_agent,
                'Accept' => 'application/json',
            ),
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            EVE_Killfeed_Database::log('error', 'ESI request failed: ' . $response->get_error_message(), array('url' => $url));
            return false;
        }
        
        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($code !== 200) {
            EVE_Killfeed_Database::log('error', "ESI request failed with code {$code}", array('url' => $url, 'response' => $body));
            return false;
        }
        
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            EVE_Killfeed_Database::log('error', 'JSON decode error: ' . json_last_error_msg(), array('url' => $url));
            return false;
        }
        
        return $data;
    }
}