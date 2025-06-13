# EVE Online Killfeed Overlay

A Vue.js application for displaying live EVE Online killmails from zKillboard as a streaming overlay or web application.

## Features

- 🎨 Clean, OBS-compatible overlay design :)
- 🔄 Real-time data from zKillboard + ESI APIs
- ✨ Smooth fade-in animations for new kills
- 🌓 Dark/light theme support
- 📱 Responsive design for all devices
- 🎮 EVE Online-inspired UI with corporate logos
- ⚙️ URL parameter configuration
- 📊 Real-time killmail display
- 🚀 **No backend required** - fetches data directly from public APIs

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eve-killfeed-overlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production build**
   ```bash
   npm run build
   ```

## How It Works

The application fetches killmail data directly from:

1. **zKillboard API** - Gets recent killmails for specified systems
2. **ESI API** - Gets detailed killmail information and pilot/corp/ship names
3. **EVE Image Server** - Loads corporation and alliance logos

**No backend server required!** Everything runs in the browser using public APIs.

## Configuration

### URL Parameters

Customize the overlay using URL parameters:

```
https://your-site.com/?systems=EFM-C4,Jita&obs=1&theme=dark&max_kills=25
```

**Available Parameters:**

- `systems=System1,System2` - Comma-separated list of systems to monitor
- `obs=1` - OBS mode (removes headers/footers)
- `theme=light|dark` - Theme selection
- `max_kills=N` - Maximum killmails to display (default: 50)
- `auto_scroll=0|1` - Enable/disable auto-scrolling
- `api_url=URL` - Optional WordPress API endpoint (if you have the backend)
- `api_key=KEY` - API authentication key (if using WordPress backend)

### Supported Systems

The application includes built-in support for popular EVE systems:

**Major Trade Hubs:**
- Jita, Amarr, Dodixie, Rens, Hek, Perimeter

**Popular PvP Systems:**
- EFM-C4, Tama, Amamake, Rancer, Uedama, Niarja

**Default Systems:** If no systems are specified, it will monitor EFM-C4, Jita, and Amarr.

### Examples

**Monitor specific systems:**
```
https://your-site.com/?systems=Jita,Amarr,Dodixie
```

**OBS overlay for EFM-C4:**
```
https://your-site.com/?systems=EFM-C4&obs=1&theme=dark
```

**Light theme with 10 killmails:**
```
https://your-site.com/?theme=light&max_kills=10
```

## OBS Integration

### Browser Source Setup

1. **Add Browser Source** in OBS
2. **Set URL**: `https://your-site.com/?obs=1&systems=EFM-C4&theme=dark`
3. **Set Dimensions**: 1920x1080 (or your preferred resolution)
4. **Enable**: "Shutdown source when not visible"
5. **Disable**: "Refresh browser when scene becomes active" (optional)

### Recommended Settings

- **Width**: 1920px
- **Height**: 1080px
- **FPS**: 30
- **Custom CSS**: Not required (styling is built-in)

## API Rate Limiting

The application implements proper rate limiting to respect API guidelines:

- **1 second delay** between zKillboard requests
- **Caching** of ESI data to reduce API calls
- **Timeout handling** for failed requests
- **Graceful fallbacks** when APIs are unavailable

## Development

### Project Structure

```
├── src/
│   ├── components/
│   │   ├── KillmailCard.vue      # Individual killmail display
│   │   ├── KillfeedOverlay.vue   # Main overlay component
│   │   ├── TestInterface.vue     # API testing interface
│   │   └── ApiTestInterface.vue  # Advanced API testing
│   ├── services/
│   │   └── api.ts                # API service layer
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── main.ts                   # Application entry point
```

### Technology Stack

- **Vue.js 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Axios** for HTTP requests
- **Day.js** for date formatting

### Adding New Systems

To add support for new systems, update the `systemIds` object in `src/services/api.ts`:

```typescript
const systemIds: Record<string, number> = {
  // ... existing systems ...
  'your-system-name': 12345678, // Replace with actual system ID
};
```

You can find system IDs using the ESI API or EVE databases.

## Testing

The application includes built-in testing interfaces:

- **Basic Test**: `?test=1` - Test WordPress API connectivity
- **Advanced Test**: `?apitest=1` - Test ESI and zKillboard APIs directly

## Troubleshooting

### Common Issues

**1. No killmails appearing**
- Check that the specified systems have recent activity
- Verify system names are spelled correctly
- Check browser console for API errors

**2. CORS errors**
- This is normal for direct API access from browsers
- The application handles CORS issues gracefully
- Consider using the WordPress backend for production

**3. Rate limiting**
- The application automatically handles rate limits
- If you see delays, this is normal behavior
- Avoid refreshing too frequently

**4. Performance issues**
- Reduce `max_kills` parameter
- Monitor fewer systems simultaneously
- Check your internet connection

### Debug Information

Enable debug mode by opening browser developer tools. The application logs:

- API requests and responses
- Data processing steps
- Error messages and fallbacks
- Performance metrics

## WordPress Backend (Optional)

While this frontend works standalone, you can optionally use it with the WordPress backend for:

- **Data persistence** - Store killmails in database
- **Better performance** - Cached data and reduced API calls
- **System management** - Admin interface for configuration
- **Enhanced features** - Rich metadata and statistics

See the WordPress plugin documentation for backend setup.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GPL v2 or later.

## Credits

- **zKillboard** - EVE Online killmail data
- **CCP Games** - EVE Online universe data via ESI
- **Vue.js** - Frontend framework

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the browser console for error messages
- Review the troubleshooting section above

---

**Fly safe! o7**