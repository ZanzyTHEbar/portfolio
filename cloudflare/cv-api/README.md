# CV API - Cloudflare Worker

This Cloudflare Worker serves CV data as JSON for the portfolio website. It eliminates the need for a build step by providing dynamic access to the latest CV data.

## Features

- Serves CV data in JSON format
- Transforms CV data into portfolio-ready format
- Provides version information for caching
- Includes CORS headers for cross-origin access
- Caches responses for performance

## API Endpoints

- `/cv.json` - Returns the raw CV data
- `/portfolio-data.json` - Returns the transformed portfolio data
- `/version` - Returns version information for the CV

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

3. Create KV namespaces:

   ```bash
   npm run setup-kv
   npm run setup-kv-preview
   ```

4. Update `wrangler.toml` with your KV namespace IDs:

   ```toml
   kv_namespaces = [
     { binding = "CV_DATA", id = "YOUR_KV_NAMESPACE_ID", preview_id = "YOUR_PREVIEW_KV_NAMESPACE_ID" }
   ]
   ```

5. Upload your CV data:

   ```bash
   npm run upload-cv path/to/cv.json
   ```

6. Test locally:

   ```bash
   npm run dev
   ```

7. Deploy to Cloudflare:

   ```bash
   npm run deploy
   ```

## Updating CV Data

To update your CV data:

1. Edit your CV JSON file
2. Run the upload script:

   ```bash
   npm run upload-cv path/to/cv.json
   ```

The script automatically updates the version and timestamp in the CV data.

## CV JSON Format

The CV should follow this format:

```json
{
  "basics": {
    "name": "Zacariah Heim",
    "label": "Tech Innovator | AI Consultant | Systems Architect",
    "email": "zacariahheim@gmail.com",
    "website": "https://zacariahheim.com",
    "summary": "Experienced technology leader...",
    "profiles": [...]
  },
  "workExperience": [...],
  "skills": [...],
  "projects": [...],
  "meta": {
    "version": "1.0.0",
    "lastUpdated": "2023-10-15"
  }
}
```

## Integration with Portfolio

The portfolio website fetches data from this API at runtime, eliminating the need for a build step when CV data changes.
