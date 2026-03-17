# YouTube Preview Site

A simple free static website that lets you add YouTube video IDs and preview them using embedded player previews.

## Usage

1. Open `index.html` in a browser.
2. Enter a YouTube *video ID* (e.g., `dQw4w9WgXcQ`).
3. Click **Add Preview** or press **Enter**.
4. Click a thumbnail to load the video preview.

## Run locally

### Option A: Open directly
Open `index.html` in any browser. (Some browsers may block autoplay or cross-origin access when not served.)

### Option B: Run a local static server (recommended)

#### Python 3
```sh
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Notes

- This project does not use any build tools or dependencies.
- Video thumbnails are loaded from YouTube's public thumbnail URL patterns.
- The site stores the most recent video IDs in `localStorage`.

## Auto-deploy via GitHub Actions

If you push this repo to GitHub and enable GitHub Pages, the included GitHub Actions workflow will automatically deploy the `main` branch to the `gh-pages` branch.

Just push to `main` and the site will update within a minute or two.
