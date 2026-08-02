# Tenant Transparency (frontend)

React + Vite frontend for the Tenant Transparency project. Split out from the
main `TenantTransparency` repo so it can be hosted for free on GitHub Pages.
The backend (Rust API + data scraper + Postgres) lives in the private
`TenantTransparency` repo and is deployed separately.

Live at: https://tenanttransparency.com

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
app and publishes it to GitHub Pages via the official Actions flow (not a
`gh-pages` branch). One-time setup on GitHub:

1. Repo Settings > Pages > Source > set to "GitHub Actions".
2. Repo Settings > Pages > Custom domain > `tenanttransparency.com` > Save.
   Since this repo publishes via a custom Actions workflow (not from a
   branch), GitHub does not need or use a `CNAME` file in the repo for
   this — the domain is stored in the repo's Pages settings instead.
3. Repo Settings > Secrets and variables > Actions > Variables > add
   `VITE_API_BASE_URL` pointing at the live backend URL once it exists.
4. DNS side (GoDaddy): four `A` records at `@` pointing at GitHub Pages'
   IPs, and a `CNAME` record for `www` pointing at
   `JessicaTemplet.github.io`. `www.tenanttransparency.com` will then
   auto-redirect to the apex domain.
5. Once DNS has propagated, come back to Settings > Pages and check
   "Enforce HTTPS".

## Notes

- `basename={import.meta.env.BASE_URL}` on the router keeps client-side
  routes working correctly regardless of what `base` is set to in
  `vite.config.js`.
- `dist/404.html` is a copy of `dist/index.html`, created at build time,
  since GitHub Pages has no server-side rewrites and needs this to let
  react-router-dom handle deep links (e.g. sharing a direct link to a
  property page).
