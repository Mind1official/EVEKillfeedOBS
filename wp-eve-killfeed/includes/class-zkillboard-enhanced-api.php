<?php
/**
 * Enhanced zKillboard API client with swagger-eve-php integration
 */

class EVE_Killfeed_ZKillboard_Enhanced_API extends EVE_Killfeed_ZKillboard_API {
    
    private $enhanced_esi;
    
    public function __construct() {
        parent::__construct();
        $this->enhanced_esi = new EVE_Killfeed_ESI_Enhanced_API();
    }
    
    /**
     * Enhanced killmail processing with rich data
     */
    protected function process_killmail($kill_data, $system_name, $system_id) {
        if (!isset($kill_data['killmail_id'])) {
            EVE_Killfeed_Database::log('warning', "Killmail data missing killmail_id");
            return false;
        }
        
        $killmail_id = $kill_data['killmail_id'];
        $zkb_data = $kill_data['zkb'] ?? array();
        $total_value = $zkb_data['totalValue'] ?? 0;
        $hash = $zkb_data['hash'] ?? '';
        
        EVE_Killfeed_Database::log('info', "Enhanced processing killmail {$killmail_id} with value {$total_value}");
        
        // Get detailed killmail data
        $killmail_detail = null;
        if (!empty($hash)) {
            // Try enhanced API first
            if ($this->enhanced_esi->is_available()) {
                $killmail_detail = $this->enhanced_esi->get_killmail_detail($killmail_id, $hash);
            }
            
            // Fallback to basic ESI if enhanced fails
            if (!$killmail_detail) {
                $killmail_detail = $this->get_killmail_detail($killmail_id, $hash);
            }
        }
        
        if (!$killmail_detail) {
            EVE_Killfeed_Database::log('warning', "Could not get killmail detail for {$killmail_id}, using fallback data");
            return $this->create_fallback_killmail($killmail_id, $system_id, $system_name, $total_value, $kill_data);
        }
        
        $killmail = $killmail_detail['killmail'] ?? $killmail_detail;
        $victim = $killmail['victim'] ?? array();
        $attackers = $killmail['attackers'] ?? array();
        
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
        
        // Extract IDs
        $victim_character_id = $victim['character_id'] ?? 0;
        $victim_corp_id = $victim['corporation_id'] ?? 0;
        $victim_alliance_id = $victim['alliance_id'] ?? 0;
        $ship_type_id = $victim['ship_type_id'] ?? 0;
        
        $killer_character_id = $final_blow['character_id'] ?? 0;
        $killer_corp_id = $final_blow['corporation_id'] ?? 0;
        $killer_alliance_id = $final_blow['alliance_id'] ?? 0;
        
        // Get enhanced information
        $victim_info = $this->get_enhanced_character_info($victim_character_id);
        $victim_corp_info = $this->get_enhanced_corporation_info($victim_corp_id);
        $victim_alliance_info = $this->get_enhanced_alliance_info($victim_alliance_id);
        
        $killer_info = $this->get_enhanced_character_info($killer_character_id);
        $killer_corp_info = $this->get_enhanced_corporation_info($killer_corp_id);
        $killer_alliance_info = $this->get_enhanced_alliance_info($killer_alliance_id);
        
        $ship_info = $this->get_enhanced_type_info($ship_type_id);
        
        // Use enhanced data or fallback to basic names
        $victim_name = $victim_info['name'] ?? $this->get_character_name($victim_character_id);
        $victim_corp = $victim_corp_info['name'] ?? $this->get_corporation_name($victim_corp_id);
        $victim_alliance = $victim_alliance_info['name'] ?? $this->get_alliance_name($victim_alliance_id);
        
        $killer_name = $killer_info['name'] ?? $this->get_character_name($killer_character_id);
        $killer_corp = $killer_corp_info['name'] ?? $this->get_corporation_name($killer_corp_id);
        $killer_alliance = $killer_alliance_info['name'] ?? $this->get_alliance_name($killer_alliance_id);
        
        $ship_name = $ship_info['name'] ?? $this->get_ship_name($ship_type_id);
        
        // Get proper kill time
        $kill_time = $killmail['killmail_time'] ?? date('Y-m-d H:i:s');
        if (strpos($kill_time, 'T') !== false) {
            $kill_time = str_replace('T', ' ', $kill_time);
            $kill_time = str_replace('Z', '', $kill_time);
            if (strpos($kill_time, '.') !== false) {
                $kill_time = substr($kill_time, 0, strpos($kill_time, '.'));
            }
        }
        
        EVE_Killfeed_Database::log('info', "Enhanced killmail {$killmail_id}: {$victim_name} ({$ship_name}) killed by {$killer_name} at {$kill_time}");
        
        return array(
            'killmail_id' => $killmail_id,
            'system_id' => $system_id,
            'system_name' => $system_name,
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
            // Enhanced data
            'victim_security_status' => $victim_info['security_status'] ?? null,
            'killer_security_status' => $killer_info['security_status'] ?? null,
            'ship_group_id' => $ship_info['group_id'] ?? null,
            'ship_mass' => $ship_info['mass'] ?? null,
            'victim_corp_ticker' => $victim_corp_info['ticker'] ?? null,
            'killer_corp_ticker' => $killer_corp_info['ticker'] ?? null,
            'victim_alliance_ticker' => $victim_alliance_info['ticker'] ?? null,
            'killer_alliance_ticker' => $killer_alliance_info['ticker'] ?? null,
        );
    }
    
    /**
     * Get enhanced character information with fallback
     */
    private function get_enhanced_character_info($character_id) {
        if (!$character_id) return null;
        
        if ($this->enhanced_esi->is_available()) {
            return $this->enhanced_esi->get_character_info($character_id);
        }
        
        return null;
    }
    
    /**
     * Get enhanced corporation information with fallback
     */
    private function get_enhanced_corporation_info($corp_id) {
        if (!$corp_id) return null;
        
        if ($this->enhanced_esi->is_available()) {
            return $this->enhanced_esi->get_corporation_info($corp_id);
        }
        
        return null;
    }
    
    /**
     * Get enhanced alliance information with fallback
     */
    private function get_enhanced_alliance_info($alliance_id) {
        if (!$alliance_id) return null;
        
        if ($this->enhanced_esi->is_available()) {
            return $this->enhanced_esi->get_alliance_info($alliance_id);
        }
        
        return null;
    }
    
    /**
     * Get enhanced type information with fallback
     */
    private function get_enhanced_type_info($type_id) {
        if (!$type_id) return null;
        
        if ($this->enhanced_esi->is_available()) {
            return $this->enhanced_esi->get_type_info($type_id);
        }
        
        return null;
    }
    
    /**
     * Create fallback killmail when detailed data is unavailable
     */
    private function create_fallback_killmail($killmail_id, $system_id, $system_name, $total_value, $kill_data) {
        return array(
            'killmail_id' => $killmail_id,
            'system_id' => $system_id,
            'system_name' => $system_name,
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
        );
    }
    
    /**
     * Enhanced system search
     */
    public function search_systems_enhanced($query, $limit = 10) {
        if ($this->enhanced_esi->is_available()) {
            return $this->enhanced_esi->search_systems($query, $limit);
        }
        
        // Fallback to basic search
        return parent::search_systems($query, $limit);
    }
    
    /**
     * Enhanced connectivity test
     */
    public function test_enhanced_connectivity() {
        $basic_results = parent::test_connectivity();
        
        if ($this->enhanced_esi->is_available()) {
            $enhanced_results = $this->enhanced_esi->test_connectivity();
            
            return array_merge($basic_results, array(
                'enhanced_api' => $enhanced_results,
                'swagger_available' => true,
            ));
        }
        
        return array_merge($basic_results, array(
            'enhanced_api' => null,
            'swagger_available' => false,
        ));
    }
}