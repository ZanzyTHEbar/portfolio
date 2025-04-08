# Zacariah Heim Portfolio

A modern portfolio website built with SolidJS and TailwindCSS.

## Features

- Responsive design with mobile-friendly navigation
- Modern UI with subtle animations
- Contact form with validation using solid-form-handler
- Dynamic content generation from CV data
- Optimized for performance with lazy loading
- Cloudflare Pages integration for form handling

## Dynamic CV Data Integration

This project uses a Cloudflare Worker to dynamically serve CV data to the portfolio website. This approach eliminates the need for a build step when CV data changes.

### How It Works

1. **Cloudflare Worker**: A serverless function that serves CV data as JSON
2. **Client-Side Fetching**: The portfolio fetches data from the Worker at runtime
3. **Automatic Updates**: The portfolio checks for updates periodically

This architecture provides several benefits:

- No rebuild needed when CV data changes
- Instant updates to the portfolio when CV is updated
- Reduced build times and simplified deployment
- Better separation of content and presentation

### Configuration

The portfolio is configured to fetch data from the Cloudflare Worker using environment variables:

```env
VITE_CV_API_URL=https://cv-api.yourdomain.workers.dev
```

### Cloudflare Worker

The Cloudflare Worker code is located in the `cloudflare/cv-api` directory. It provides the following endpoints:

- `/cv.json` - Raw CV data
- `/portfolio-data.json` - Transformed portfolio data
- `/version` - Version information

To deploy the Worker:

```bash
cd cloudflare/cv-api
npm install
npm run deploy
```

### Updating CV Data

To update your CV data:

1. Edit your CV JSON file
2. Upload it to the Cloudflare Worker:

```bash
cd cloudflare/cv-api
npm run upload-cv path/to/cv.json
```

The portfolio will automatically fetch the updated data on the next page load or when the periodic update check runs.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Analyze bundle
pnpm analyze
```

## Deployment

This site is configured for deployment on Cloudflare Pages with serverless functions for form handling.

## License

MIT
