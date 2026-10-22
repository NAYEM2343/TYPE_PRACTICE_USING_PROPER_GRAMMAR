# TypeWise — Grammar & Typing Trainer

A static, browser-based English grammar and typing trainer extracted from the original single-file HTML into separate HTML, CSS, and JavaScript files. The original UI and application logic are preserved as closely as possible.

## Project files

- `index.html` — page markup and external library references.
- `style.css` — the original application styles.
- `script.js` — the original Tailwind configuration and TypeWise application JavaScript.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser. For best results, use a local static server (for example, VS Code Live Server or `python -m http.server 8000`) and open `http://localhost:8000`.
3. Internet access is required for the CDN-hosted Tailwind CSS, Chart.js, and Google Fonts resources.

## Publish with GitHub Pages

1. Create a GitHub repository (for example, `TypeWise`).
2. Upload `index.html`, `style.css`, `script.js`, and this `README.md` to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **`main`** and folder **`/(root)`**, then click **Save**.
6. Wait for the Pages deployment to finish. The site URL will typically be `https://YOUR-USERNAME.github.io/TypeWise/` (replace the username and repository name with yours).

## Notes and verification

- This project is a static front-end site; GitHub Pages can host it without a server-side runtime.
- Third-party CDN dependencies must remain reachable for Tailwind CSS, Chart.js, and web fonts to load.
- Browser storage is local to each browser/device; it does not automatically sync between visitors or devices.
- Static checks can confirm file references and JavaScript syntax, but a full interaction test should still be done in a browser after publishing.
