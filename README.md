# Zacariah Heim Portfolio

A modern, performant personal portfolio website built with SolidJS and TailwindCSS, deployed on Cloudflare Pages with serverless functions and Google Sheets integration for the contact form.

## Table of Contents

- [Zacariah Heim Portfolio](#zacariah-heim-portfolio)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Deployment](#deployment)
    - [Building for Production](#building-for-production)
    - [Cloudflare Pages](#cloudflare-pages)
    - [Local Function Preview (Wrangler)](#local-function-preview-wrangler)
  - [Contact Form (Google Apps Script)](#contact-form-google-apps-script)
  - [License](#license)

## Features

- **Responsive Design**: Mobile-first layout with TailwindCSS
- **SolidJS + Vite**: Ultra-fast reactivity and build performance
- **Lazy Loading**: Components and images load on demand
- **Contact Form**: Client-side validation with `solid-form-handler`, serverless submission via Cloudflare Function + Google Sheets
- **Dynamic CV Data**: Fetches portfolio data from a Cloudflare Worker at runtime, no rebuild required
- **Optimized Bundles**: Bundle analysis and minimization

## Prerequisites

- Node.js (LTS)
- pnpm (or npm/yarn)
- Cloudflare account (for Pages + Workers)
- Wrangler CLI (`pnpm install -g wrangler`)
- Google (G Suite) account with a Google Sheet

## Getting Started

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root (not checked into Git):

```ini
# Google Apps Script Web App URL (deployed)
VITE_GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/your-webapp-id/exec
```

## Development

Run the Vite dev server with live reloading:

```bash
pnpm dev
```

To preview Cloudflare Functions locally (requires Wrangler):

```bash
pnpm pages:dev
```

Your app will be available at `http://localhost:3000` and functions at `/submit-form`.

## Deployment

### Building for Production

Build both client and serverless functions:

```bash
pnpm build
```

### Cloudflare Pages

1. Push your repository to GitHub (or link your Git repo in the Pages dashboard).
2. In Cloudflare Pages settings, set the **Build command** to:
   ```bash
   pnpm build
   ```
3. Set the **Build output directory** to:
   ```bash
   dist
   ```
4. Under **Functions**, ensure it's pointed at:
   ```bash
   ./functions
   ```
5. Add environment variables in the Pages UI (or `wrangler.toml`):
   - `GOOGLE_WEBHOOK_URL`
6. Deploy — Pages will build and publish your site with serverless functions automatically.

### Local Function Preview (Wrangler)

```bash
pnpm pages:dev
```

This command uses `wrangler pages dev dist --functions functions` to serve your production build locally with functions support.

## Contact Form (Google Apps Script)

1. Open [Google Apps Script](https://script.google.com/) and create a new project.
2. Copy the code from `scripts/google-apps-script.gs` into the editor.
3. Replace:
   - `SPREADSHEET_ID` with your Sheet's ID
   - `you@yourdomain.com` with your notification email
4. Deploy as **Web App**, executing as **you**, and allow **Anyone, even anonymous**.
5. Copy the Web App URL into your Pages environment as `GOOGLE_WEBHOOK_URL`.

## License

MIT
