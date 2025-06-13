# EVE Online Killfeed Overlay

A hybrid WordPress + Vue.js application for displaying live EVE Online killmails from zKillboard as a streaming overlay or web application.

## Features

### WordPress Plugin
- 📊 Custom database table for killmail storage
- ⏰ WP-Cron automation (polls zKillboard every 3 minutes)
- 🎯 System-based filtering with admin interface
- 🚫 Duplicate prevention using killmail IDs
- 🔗 REST API endpoints for external access
- 📈 Statistics and monitoring dashboard
- 🛠️ Admin settings page for system management
- 📝 Comprehensive logging system
- 🚀 **Enhanced ESI API integration with swagger-eve-php**
- 💎 **Rich killmail data with real pilot/corp/ship names**

### Vue.js Frontend
- 🎨 Clean, OBS-compatible overlay design
- 🔄 Auto-refresh every 3 minutes
- ✨ Smooth fade-in animations for new kills
- 🌓 Dark/light theme support
- 📱 Responsive design for all devices
- 🎮 EVE Online-inspired UI with corporate logos
- ⚙️ URL parameter configuration
- 📊 Real-time statistics display

## Quick Start

### WordPress Plugin Setup

1. **Install the Plugin**
   ```bash
   # Upload the wp-eve-killfeed folder to your WordPress plugins directory
   wp-content/plugins/wp-eve-killfeed/
   ```

2. **Activate the Plugin**
   - Go to WordPress Admin → Plugins
   - Activate "EVE Online Killfeed"

3. **Install Enhanced Features (Recommended)**
   - Click "Install Enhanced Features" in the admin notice
   - Or manually run: `composer install` in the plugin directory
   - This enables rich killmail data with real names

4. **Configure Systems**
   - Navigate to Admin → EVE Killfeed
   - Add system names to monitor (e.g., "Jita", "Amarr", "EFM-C4")
   - The plugin will automatically start fetching killmails

### Vue.js Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Connection**
   ```bash
   # Create .env file
   VITE_WP_API_URL=https://your-wordpress-site.com/wp-json/eve-killfeed/v1
   VITE_API_KEY=your-optional-api-key
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

## Enhanced ESI API Integration

### What's New with swagger-eve-php

The plugin now supports **two modes**:

#### **Basic Mode** (Default)
- ✅ Works out of the box
- ✅ No additional dependencies
- ❌ Limited to placeholder names ("Unknown Pilot", "Unknown Ship")
- ❌ Basic killmail data only

#### **Enhanced Mode** (Recommended)
- ✅ **Real pilot names** from ESI API
- ✅ **Real corporation and alliance names**
- ✅ **Actual ship names and details**
- ✅ **Enhanced system search capabilities**
- ✅ **Rich killmail metadata** (security status, corp tickers, etc.)
- ✅ **Intelligent caching** for better performance
- ✅ **Robust error handling** with fallbacks

### Installation of Enhanced Features

#### Automatic Installation (Recommended)
1. Go to WordPress Admin → EVE Killfeed
2. Click "Install Enhanced Features" button
3. Wait for installation to complete
4. Enhanced features are now active!

#### Manual Installation
```bash
cd wp-content/plugins/wp-eve-killfeed/
composer install --no-dev --optimize-autoloader
```

### Enhanced Data Examples

**Before (Basic Mode):**
```json
{
  "victim_name": "Unknown Pilot",
  "victim_corp": "Unknown Corporation",
  "ship_name": "Unknown Ship"
}
```

**After (Enhanced Mode):**
```json
{
  "victim_name": "CCP Falcon",
  "victim_corp": "C C P",
  "victim_alliance": "C C P Alliance",
  "ship_name": "Rifter",
  "victim_corp_ticker": "CCP",
  "victim_security_status": -2.3,
  "ship_group_id": 25
}
```

### ESI API Requirements

The enhanced mode uses **public ESI endpoints only** - no app registration required:

#### **Public Endpoints Used**
- ✅ Character information (`/characters/{character_id}/`)
- ✅ Corporation information (`/corporations/{corporation_id}/`)
- ✅ Alliance information (`/alliances/{alliance_id}/`)
- ✅ Ship/item information (`/universe/types/{type_id}/`)
- ✅ Killmail details (`/killmails/{killmail_id}/{killmail_hash}/`)
- ✅ System search (`/search/`) - **Now available with enhanced mode!**

#### **Benefits of Enhanced Mode**
1. **Dynamic System Discovery**: Search for any EVE system by name
2. **Rich Character Profiles**: Security status, corp history, etc.
3. **Detailed Ship Information**: Mass, volume, group classifications
4. **Corporation Details**: Tickers, member counts, tax rates
5. **Alliance Information**: Executor corps, founding dates
6. **Intelligent Caching**: Reduces API calls and improves performance

### Supported Systems

The plugin includes built-in support for popular systems, but **Enhanced Mode** allows you to search for any system dynamically:

**Major Trade Hubs:**
- Jita, Amarr, Dodixie, Rens, Hek, Perimeter

**Popular PvP Systems:**
- EFM-C4, Tama, Amamake, Rancer, Uedama, Niarja

**With Enhanced Mode**: Search for any of the 7,000+ EVE systems!

## Configuration

### URL Parameters

The Vue.js frontend supports various URL parameters for customization:

```
https://your-site.com/killfeed?obs=1&theme=dark&max_kills=25&api_url=https://your-wp-site.com/wp-json/eve-killfeed/v1
```

- `obs=1` - OBS mode (removes headers/footers)
- `theme=light|dark` - Theme selection
- `max_kills=N` - Maximum killmails to display
- `auto_scroll=0|1` - Enable/disable auto-scrolling
- `api_url=URL` - WordPress API endpoint
- `api_key=KEY` - API authentication key

### WordPress Settings

Access the admin interface at **WordPress Admin → EVE Killfeed**:

- **Dashboard**: View statistics and recent killmails
- **System Management**: Add/remove monitored systems with search
- **Manual Actions**: Fetch killmails now, clear data
- **API Information**: Endpoint URLs and examples
- **Enhanced Features**: Install and manage swagger-eve-php integration

## API Endpoints

### Base URL
```
https://your-wordpress-site.com/wp-json/eve-killfeed/v1/
```

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/killmails` | GET | Get killmails with filtering |
| `/systems` | GET | Get monitored systems |
| `/stats` | GET | Get statistics |
| `/status` | GET | Get system status |

### Example Requests

**Get recent killmails:**
```bash
curl "https://your-site.com/wp-json/eve-killfeed/v1/killmails?limit=10&hours=24"
```

**Filter by systems:**
```bash
curl "https://your-site.com/wp-json/eve-killfeed/v1/killmails?systems=EFM-C4,Jita&limit=5"
```

**Get statistics:**
```bash
curl "https://your-site.com/wp-json/eve-killfeed/v1/stats"
```

## OBS Integration

### Browser Source Setup

1. **Add Browser Source** in OBS
2. **Set URL**: `https://your-site.com/killfeed?obs=1&theme=dark`
3. **Set Dimensions**: 1920x1080 (or your preferred resolution)
4. **Enable**: "Shutdown source when not visible"
5. **Disable**: "Refresh browser when scene becomes active" (optional)

### Recommended Settings

- **Width**: 1920px
- **Height**: 1080px
- **FPS**: 30
- **Custom CSS**: Not required (styling is built-in)

## Development

### Project Structure

```
├── src/
│   ├── components/
│   │   ├── KillmailCard.vue      # Individual killmail display
│   │   └── KillfeedOverlay.vue   # Main overlay component
│   ├── services/
│   │   └── api.ts                # API service layer
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── main.ts                   # Application entry point
├── wp-eve-killfeed/
│   ├── eve-killfeed.php          # Main plugin file
│   ├── composer.json             # Composer dependencies
│   ├── includes/
│   │   ├── class-database.php    # Database operations
│   │   ├── class-cron.php        # Cron job management
│   │   ├── class-rest-api.php    # REST API endpoints
│   │   ├── class-zkillboard-api.php # Basic zKillboard integration
│   │   ├── class-esi-enhanced-api.php # Enhanced ESI integration
│   │   └── class-zkillboard-enhanced-api.php # Enhanced zKillboard integration
│   ├── templates/
│   │   └── admin-page.php        # Admin interface
│   └── assets/
│       ├── admin.js              # Admin JavaScript
│       └── admin.css             # Admin styling
```

### WordPress Plugin Development

The plugin follows WordPress best practices:

- **Object-oriented architecture** with singleton patterns
- **WordPress coding standards** compliance
- **Secure AJAX** with nonce verification
- **Proper sanitization** of all inputs
- **Comprehensive error handling** and logging
- **Efficient database queries** with prepared statements
- **Intelligent caching strategies** for external API calls
- **Modular design** with enhanced/basic mode support

### Vue.js Frontend Development

The frontend uses modern Vue.js 3 with Composition API:

- **TypeScript** for type safety
- **Responsive design** with CSS Grid/Flexbox
- **Smooth animations** with CSS transitions
- **Efficient API polling** with configurable intervals
- **Error handling** with user-friendly messages
- **Performance optimization** with image lazy loading

## Troubleshooting

### Common Issues

**1. No killmails appearing**
- Check that systems are configured in WordPress admin
- Verify WP-Cron is working: `wp cron event list`
- Check plugin logs in WordPress admin

**2. "Unknown Pilot" / "Unknown Ship" names**
- Install Enhanced Features for rich data
- Check that composer dependencies are installed
- Verify ESI API connectivity in admin

**3. API connection errors**
- Verify the API URL is correct
- Check WordPress permalink settings
- Ensure REST API is enabled

**4. Performance issues**
- Reduce `max_kills` parameter
- Increase `refreshInterval` in Vue component
- Enable WordPress object caching

**5. Enhanced features not working**
- Ensure composer is available on your server
- Check file permissions in plugin directory
- Verify PHP version compatibility (7.4+)

### WordPress Plugin Debug

Enable WordPress debug logging in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check logs at: `wp-content/debug.log`

### Vue.js Frontend Debug

Enable development mode and check browser console:

```bash
npm run dev
# Open browser developer tools → Console tab
```

### Enhanced API Debug

Check the WordPress admin logs for ESI API calls:

1. Go to WordPress Admin → EVE Killfeed → Logs
2. Look for entries with "Enhanced" in the message
3. Check for any ESI API errors or warnings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (both basic and enhanced modes)
5. Submit a pull request

## License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## Credits

- **zKillboard** - EVE Online killmail data
- **CCP Games** - EVE Online universe data via ESI
- **swagger-eve-php** - Enhanced ESI API integration
- **Vue.js** - Frontend framework
- **WordPress** - Content management system

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the WordPress admin logs
- Review the API documentation above
- Test both basic and enhanced modes

---

**Fly safe! o7**