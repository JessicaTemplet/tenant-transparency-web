# Tenant Transparency (frontend)

React + Vite frontend for the Tenant Transparency project. Split out from the
main `TenantTransparency` repo so it can be hosted for free on GitHub Pages.
The backend (Rust API + data scraper + Postgres) lives in the private
`TenantTransparency` repo and is deployed separately.

## Local development

```bash
npm install
npm run dev
```

By default the dev server calls the API at `http://localhost:3000` (see
`.env.example`). Copy it to `.env` and point `VITE_API_BASE_URL` at wherever
your backend is running.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
app and publishes it to GitHub Pages. One-time setup on GitHub:

1. Repo Settings > Pages > Source > set to "GitHub Actions".
2. Repo Settings > Secrets and variables > Actions > Variables > add
   `VITE_API_BASE_URL` pointing at the live backend URL once it exists.
3. If you later attach a custom domain, add a `public/CNAME` file with the
   domain, and change `base` in `vite.config.js` back to `'/'`.

## Notes

- `basename={import.meta.env.BASE_URL}` on the router keeps client-side
  routes working under the `/tenant-transparency-web/` subpath GitHub Pages
  serves this from by default.
- `dist/404.html` is a copy of `dist/index.html`, created at build time,
  since GitHub Pages has no server-side rewrites and needs this to let
  react-router-dom handle deep links (e.g. sharing a direct link to a
  property page).
