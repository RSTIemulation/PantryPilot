# PantryPilot — Receipt to Recipes

An installable, mobile-friendly Progressive Web App (PWA) for grocery receipt OCR, pantry tracking, and recipe recommendations. No account or backend required.

## What it does

- **Scan receipts**: Take a photo on a phone or upload an image. Tesseract.js recognizes the receipt locally in the browser. Review the recognized products and quantities before saving.
- **Paste receipt text**: Works without a photo, and includes a sample receipt to try.
- **Pantry inventory**: Add/edit groceries, quantity, units, category and optional best-by dates. Quickly increase/decrease stock.
- **Recipe matches**: Browse 26 built-in recipes. See what ingredients you have, which are missing, and which quantities need checking.
- **Shopping list**: Add missing ingredients from recipes, check items off, and move picked-up items to the pantry.
- **Cooking mode**: Log meals and deduct ingredient quantities where the ingredient units are compatible.
- **Privacy & backup**: Pantry lives in local browser storage. Export/import a JSON backup.

## Launch on your computer

From this directory, run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` in a browser.

## Install on an Android phone

To install it like an app, the files need to be published over **HTTPS**. A static host such as GitHub Pages, Netlify, or Cloudflare Pages is sufficient. Upload the *contents* of this directory as a website, open the HTTPS URL in **Chrome on Android**, and choose **⋮ > Add to Home screen** or **Install app**.

The app can work offline once its shell has been cached. The OCR engine and English language data must be downloaded for first use, so internet is required for first-time scanning and may be necessary later if the external library isn't cached.

For a one-file preview, open `PantryPilot-preview.html` from the downloaded package in a browser; some phones restrict local-file access to scripts or camera features, so the hosted HTTPS version is recommended.

## Technical notes

- Built with vanilla HTML, CSS, and JavaScript; no backend or build step.
- Uses Tesseract.js v5 from jsDelivr via a dynamic script tag. Receipt images are processed in browser memory and are not transmitted to a proprietary server. Tesseract.js engine files are fetched from its CDN.
- Recognized receipt descriptions and quantities are *estimates*. Store abbreviations, bundles, fresh produce weights, ingredient conversions, and OCR output vary widely; review before committing stock.
- Unconvertible inventory units show a **?** in recipes; these ingredients are counted as present but quantities are not guaranteed.
- Recipe suggestions are prewritten and stored in the app; there is no generated/AI recipe API in this version.
- Pantry data is local to each browser installation; uninstalling, clearing site data, or private-browsing may remove it. Use export backups.
- Future product needs: cloud sync, barcode product catalog, store-specific receipt parsers, recipes API, expiry intelligence, family-sharing, and nutritional filtering.

## Files

- `index.html`, `styles.css`, `app.js` — app
- `manifest.webmanifest`, `sw.js`, `icons/` — mobile install / offline support
- `PantryPilot-preview.html` — single-file demonstration
