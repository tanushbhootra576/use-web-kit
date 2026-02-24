use-web-kit documentation (Hook Engine)

This `docs/` folder contains a single-page documentation site for the `use-web-kit` package. It is pure HTML/CSS/JS and intended to be published as static files (GitHub Pages, Netlify, Vercel static site, or any static host).

Preview locally

Use a simple static server from the project root. Examples:

# Python 3

python -m http.server --directory docs 8000

# Node.js (if you have serve installed)

npx serve docs -p 8000

Then open http://localhost:8000 in a browser.

Deployment

- GitHub Pages: push the `docs/` folder to the `gh-pages` branch or enable Pages from the repository's `docs/` folder.
- Netlify / Vercel: point a site to the `docs/` folder as the publish directory.

Notes

- Fonts are loaded from Google Fonts (preconnect + stylesheet). For maximum privacy and stability, self-host `Orbitron` and `JetBrains Mono` and replace the font `link` with `@font-face` references in `styles.css`.
- The page respects `prefers-reduced-motion` and includes ARIA attributes for improved accessibility.
