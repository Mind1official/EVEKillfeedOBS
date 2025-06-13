<?php
/**
 * Enhanced ESI API client using swagger-eve-php
 */

// Include Composer autoloader if available
if (file_exists(EVE_KILLFEED_PLUGIN_PATH . 'vendor/autoload.php')) {
    require_once EVE_KILLFEED_PLUGIN_PATH . 'vendor/autoload.php';
}

use Swagger\Client\Eve\Api\CharacterApi;
use Swagger\Client\Eve\Api\CorporationApi;
use Swagger\Client\Eve\Api\AllianceApi;
use Swagger\Client\Eve\Api\UniverseApi;
use Swagger\Client\Eve\Api\KillmailsApi;
use Swagger\Client\Eve\Configuration;
use GuzzleHttp\Client;

class EVE_Killfeed_ESI_Enhanced_API {
    
    private $config;
    private $characterApi;
    private $corporationApi;
    private $allianceApi;
    private $universeApi;
    private $killmailsApi;
    private $cache_duration = 3600; // 1 hour
    
    public function __construct() {
        $this->init_swagger_client();
    }
    
    /**
     * Initialize swagger-eve-php client
     */
    private function init_swagger_client() {
        try {
            // Check if swagger-eve-php is available
            if (!class_exists('Swagger\Client\Eve\Configuration')) {
                EVE_Killfeed_Database::log('warning', 'swagger-eve-php not available, falling back to basic ESI client');
                return false;
            }
            
            $this->config = Configuration::getDefaultConfiguration();
            
            // Set user agent
            $this->config->setUserAgent('EVE Killfeed WordPress Plugin/' . EVE_KILLFEED_VERSION . ' (WordPress)');
            
            // Initialize API clients
            $httpClient = new Client([
                'timeout' => 30,
                'verify' => true,
            ]);
            
            $this->characterApi = new CharacterApi($httpClient, $this->config);
            $this->corporationApi = new CorporationApi($httpClient, $this->config);
            $this->allianceApi = new AllianceApi($httpClient, $this->config);
            $this->universeApi = new UniverseApi($httpClient, $this->config);
            $this->killmailsApi = new KillmailsApi($httpClient, $this->config);
            
            EVE_Killfeed_Database::log('info', 'swagger-eve-php client initialized successfully');
            return true;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', 'Failed to initialize swagger-eve-php: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if enhanced API is available
     */
    public function is_available() {
        return $this->characterApi !== null;
    }
    
    /**
     * Get character information with enhanced caching
     */
    public function get_character_info($character_id) {
        if (!$this->is_available() || !$character_id) {
            return null;
        }
        
        $cache_key = 'eve_enhanced_character_' . $character_id;
        $cached_data = get_transient($cache_key);
        
        if ($cached_data !== false) {
            return $cached_data;
        }
        
        try {
            $character = $this->characterApi->getCharactersCharacterId($character_id);
            
            $character_info = array(
                'id' => $character_id,
                'name' => $character->getName(),
                'corporation_id' => $character->getCorporationId(),
                'alliance_id' => $character->getAllianceId(),
                'birthday' => $character->getBirthday(),
                'security_status' => $character->getSecurityStatus(),
                'description' => $character->getDescription(),
            );
            
            // Cache for 1 hour
            set_transient($cache_key, $character_info, $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced character lookup successful: {$character->getName()} (ID: {$character_id})");
            
            return $character_info;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced character lookup failed for ID {$character_id}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get corporation information with enhanced details
     */
    public function get_corporation_info($corporation_id) {
        if (!$this->is_available() || !$corporation_id) {
            return null;
        }
        
        $cache_key = 'eve_enhanced_corporation_' . $corporation_id;
        $cached_data = get_transient($cache_key);
        
        if ($cached_data !== false) {
            return $cached_data;
        }
        
        try {
            $corporation = $this->corporationApi->getCorporationsCorporationId($corporation_id);
            
            $corp_info = array(
                'id' => $corporation_id,
                'name' => $corporation->getName(),
                'ticker' => $corporation->getTicker(),
                'alliance_id' => $corporation->getAllianceId(),
                'ceo_id' => $corporation->getCeoId(),
                'creator_id' => $corporation->getCreatorId(),
                'date_founded' => $corporation->getDateFounded(),
                'description' => $corporation->getDescription(),
                'faction_id' => $corporation->getFactionId(),
                'home_station_id' => $corporation->getHomeStationId(),
                'member_count' => $corporation->getMemberCount(),
                'shares' => $corporation->getShares(),
                'tax_rate' => $corporation->getTaxRate(),
                'url' => $corporation->getUrl(),
                'war_eligible' => $corporation->getWarEligible(),
            );
            
            // Cache for 1 hour
            set_transient($cache_key, $corp_info, $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced corporation lookup successful: {$corporation->getName()} (ID: {$corporation_id})");
            
            return $corp_info;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced corporation lookup failed for ID {$corporation_id}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get alliance information with enhanced details
     */
    public function get_alliance_info($alliance_id) {
        if (!$this->is_available() || !$alliance_id) {
            return null;
        }
        
        $cache_key = 'eve_enhanced_alliance_' . $alliance_id;
        $cached_data = get_transient($cache_key);
        
        if ($cached_data !== false) {
            return $cached_data;
        }
        
        try {
            $alliance = $this->allianceApi->getAlliancesAllianceId($alliance_id);
            
            $alliance_info = array(
                'id' => $alliance_id,
                'name' => $alliance->getName(),
                'ticker' => $alliance->getTicker(),
                'creator_corporation_id' => $alliance->getCreatorCorporationId(),
                'creator_id' => $alliance->getCreatorId(),
                'date_founded' => $alliance->getDateFounded(),
                'executor_corporation_id' => $alliance->getExecutorCorporationId(),
                'faction_id' => $alliance->getFactionId(),
            );
            
            // Cache for 1 hour
            set_transient($cache_key, $alliance_info, $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced alliance lookup successful: {$alliance->getName()} (ID: {$alliance_id})");
            
            return $alliance_info;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced alliance lookup failed for ID {$alliance_id}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get ship/item type information with enhanced details
     */
    public function get_type_info($type_id) {
        if (!$this->is_available() || !$type_id) {
            return null;
        }
        
        $cache_key = 'eve_enhanced_type_' . $type_id;
        $cached_data = get_transient($cache_key);
        
        if ($cached_data !== false) {
            return $cached_data;
        }
        
        try {
            $type = $this->universeApi->getUniverseTypesTypeId($type_id);
            
            $type_info = array(
                'id' => $type_id,
                'name' => $type->getName(),
                'description' => $type->getDescription(),
                'group_id' => $type->getGroupId(),
                'market_group_id' => $type->getMarketGroupId(),
                'mass' => $type->getMass(),
                'packaged_volume' => $type->getPackagedVolume(),
                'portion_size' => $type->getPortionSize(),
                'published' => $type->getPublished(),
                'radius' => $type->getRadius(),
                'volume' => $type->getVolume(),
            );
            
            // Cache for 24 hours (ship data doesn't change often)
            set_transient($cache_key, $type_info, 24 * $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced type lookup successful: {$type->getName()} (ID: {$type_id})");
            
            return $type_info;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced type lookup failed for ID {$type_id}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get detailed killmail information
     */
    public function get_killmail_detail($killmail_id, $hash) {
        if (!$this->is_available() || !$killmail_id || !$hash) {
            return null;
        }
        
        $cache_key = 'eve_enhanced_killmail_' . $killmail_id;
        $cached_data = get_transient($cache_key);
        
        if ($cached_data !== false) {
            return $cached_data;
        }
        
        try {
            $killmail = $this->killmailsApi->getKillmailsKillmailIdKillmailHash($killmail_id, $hash);
            
            $killmail_data = array(
                'killmail_id' => $killmail_id,
                'killmail_time' => $killmail->getKillmailTime(),
                'solar_system_id' => $killmail->getSolarSystemId(),
                'victim' => array(
                    'alliance_id' => $killmail->getVictim()->getAllianceId(),
                    'character_id' => $killmail->getVictim()->getCharacterId(),
                    'corporation_id' => $killmail->getVictim()->getCorporationId(),
                    'damage_taken' => $killmail->getVictim()->getDamageTaken(),
                    'faction_id' => $killmail->getVictim()->getFactionId(),
                    'ship_type_id' => $killmail->getVictim()->getShipTypeId(),
                    'items' => $killmail->getVictim()->getItems(),
                    'position' => $killmail->getVictim()->getPosition(),
                ),
                'attackers' => array(),
            );
            
            // Process attackers
            foreach ($killmail->getAttackers() as $attacker) {
                $killmail_data['attackers'][] = array(
                    'alliance_id' => $attacker->getAllianceId(),
                    'character_id' => $attacker->getCharacterId(),
                    'corporation_id' => $attacker->getCorporationId(),
                    'damage_done' => $attacker->getDamageDone(),
                    'faction_id' => $attacker->getFactionId(),
                    'final_blow' => $attacker->getFinalBlow(),
                    'security_status' => $attacker->getSecurityStatus(),
                    'ship_type_id' => $attacker->getShipTypeId(),
                    'weapon_type_id' => $attacker->getWeaponTypeId(),
                );
            }
            
            // Cache for 24 hours (killmails don't change)
            set_transient($cache_key, $killmail_data, 24 * $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced killmail lookup successful: {$killmail_id}");
            
            return $killmail_data;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced killmail lookup failed for {$killmail_id}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Search for systems (requires no authentication)
     */
    public function search_systems($query, $limit = 10) {
        if (!$this->is_available() || strlen($query) < 2) {
            return array();
        }
        
        $cache_key = 'eve_enhanced_system_search_' . md5($query);
        $cached_results = get_transient($cache_key);
        
        if ($cached_results !== false) {
            return $cached_results;
        }
        
        try {
            $search_results = $this->universeApi->getUniverseSearch($query, array('solar_system'), false);
            
            if (!$search_results->getSolarSystem()) {
                return array();
            }
            
            $system_ids = array_slice($search_results->getSolarSystem(), 0, $limit);
            $systems = array();
            
            foreach ($system_ids as $system_id) {
                try {
                    $system = $this->universeApi->getUniverseSystemsSystemId($system_id);
                    
                    $systems[] = array(
                        'id' => $system_id,
                        'name' => $system->getName(),
                        'security_status' => $system->getSecurityStatus(),
                        'constellation_id' => $system->getConstellationId(),
                        'star_id' => $system->getStarId(),
                        'stargates' => $system->getStargates(),
                        'stations' => $system->getStations(),
                        'planets' => $system->getPlanets(),
                    );
                    
                } catch (Exception $e) {
                    EVE_Killfeed_Database::log('warning', "Failed to get system details for {$system_id}: " . $e->getMessage());
                }
            }
            
            // Cache for 1 hour
            set_transient($cache_key, $systems, $this->cache_duration);
            
            EVE_Killfeed_Database::log('info', "Enhanced system search successful: " . count($systems) . " systems found for '{$query}'");
            
            return $systems;
            
        } catch (Exception $e) {
            EVE_Killfeed_Database::log('error', "Enhanced system search failed for '{$query}': " . $e->getMessage());
            return array();
        }
    }
    
    /**
     * Test enhanced API connectivity
     */
    public function test_connectivity() {
        $results = array(
            'swagger_available' => $this->is_available(),
            'character_lookup' => false,
            'corporation_lookup' => false,
            'alliance_lookup' => false,
            'type_lookup' => false,
            'system_search' => false,
            'errors' => array(),
        );
        
        if (!$this->is_available()) {
            $results['errors'][] = 'swagger-eve-php library not available';
            return $results;
        }
        
        // Test character lookup (CCP Falcon)
        $test_char = $this->get_character_info(92532650);
        if ($test_char && $test_char['name']) {
            $results['character_lookup'] = true;
        } else {
            $results['errors'][] = 'Character lookup test failed';
        }
        
        // Test corporation lookup (CCP)
        $test_corp = $this->get_corporation_info(98356193);
        if ($test_corp && $test_corp['name']) {
            $results['corporation_lookup'] = true;
        } else {
            $results['errors'][] = 'Corporation lookup test failed';
        }
        
        // Test ship type lookup (Rifter)
        $test_type = $this->get_type_info(587);
        if ($test_type && $test_type['name']) {
            $results['type_lookup'] = true;
        } else {
            $results['errors'][] = 'Type lookup test failed';
        }
        
        // Test system search
        $test_systems = $this->search_systems('Jita', 1);
        if (!empty($test_systems)) {
            $results['system_search'] = true;
        } else {
            $results['errors'][] = 'System search test failed';
        }
        
        return $results;
    }
}