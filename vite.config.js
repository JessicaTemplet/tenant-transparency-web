import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Slugs that have their own static index.html in public/ and must NOT
// fall through to the React SPA root.
const STATIC_ARTICLE_SLUGS = [
  'chicago-renters-rights-guide',
  'chicago-security-deposit-law',
  'chicago-habitability-violations',
  'chicago-heat-law-utility-complaints',
  'cook-county-eviction-process',
  'chicago-move-out-documentation',
  'chicago-deposit-not-returned',
]

export default defineConfig({
  // Served at https://<user>.github.io/tenant-transparency-web/ by default.
  // If/when a custom domain is attached via a CNAME file, change this back to '/'.
  base: '/', // served from tenanttransparency.com (custom domain), not a /repo-name/ subpath
  plugins: [
    react(),
    {
      // Dev-only middleware: serve static article HTML before Vite's SPA
      // fallback can intercept the request.
      name: 'static-articles',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const slug = req.url?.replace(/^\//, '').split('?')[0].split('#')[0]
          if (STATIC_ARTICLE_SLUGS.includes(slug)) {
            const filePath = path.resolve(
              __dirname,
              'public',
              slug,
              'index.html'
            )
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.end(fs.readFileSync(filePath, 'utf-8'))
              return
            }
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})
