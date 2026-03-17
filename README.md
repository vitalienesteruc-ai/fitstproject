# YouTube Preview Site

A simple free static website that lets you add YouTube video IDs and preview them using embedded player previews.

## Usage

1. Open `index.html` in a browser.
2. Enter a YouTube *video name* (e.g., `never gonna give you up`) or paste a YouTube video ID (e.g., `dQw4w9WgXcQ`).
3. Click **Search & Add** or press **Enter**.
4. Click a thumbnail to load the video preview.

### Enabling search by name

This feature requires a **YouTube Data API v3 key**. Set it in the `YOUTUBE_API_KEY` constant at the top of `script.js`.

- To get a key, follow:
  1. https://developers.google.com/youtube/v3/getting-started
  2. Create a project, enable the YouTube Data API, and create an API key.
  3. Paste the key into `YOUTUBE_API_KEY` in `script.js`.

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

This repo includes a GitHub Actions workflow that deploys the `main` branch to the `gh-pages` branch on every push.

### GitHub Pages URL
After enabling Pages (branch: `gh-pages`, folder: `/`), the site should be available at:

```
https://vitalienesteruc-ai.github.io/fitstproject/
```

It can take a minute or two for changes to appear.

### Confirm deployment
1. Open the **Actions** tab in your repo.
2. Verify the **Deploy to GitHub Pages** workflow ran successfully.
3. If it failed, open the workflow details to see errors.
