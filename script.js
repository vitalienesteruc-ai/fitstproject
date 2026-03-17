const videoIdInput = document.getElementById('videoId');
const addButton = document.getElementById('addButton');
const gallery = document.getElementById('gallery');
const player = document.getElementById('player');

const STORAGE_KEY = 'yt-preview-items';

function makeSearchEmbedUrl(query) {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

function isSearchEntry(value) {
  return value.startsWith('search:');
}

function getStoredIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures
  }
}

function makeThumbnailUrl(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function makeEmbedUrl(id) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

function makeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function makeSearchEmbedUrl(query) {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

function isValidVideoId(value) {
  // YouTube IDs are typically 11 characters, allow a loose match.
  return /^[A-Za-z0-9_-]{8,20}$/.test(value.trim());
}

function isValidVideoId(value) {
  // YouTube IDs are typically 11 characters, allow a loose match.
  return /^[A-Za-z0-9_-]{8,20}$/.test(value.trim());
}

function clearPlayer() {
  player.innerHTML = `<div class="empty">Select a video to play</div>`;
}

async function showVideo(entry) {
  const isSearch = isSearchEntry(entry);
  const value = isSearch ? entry.slice('search:'.length) : entry;
  const youtubeUrl = isSearch
    ? makeSearchUrl(value)
    : `https://www.youtube.com/watch?v=${value}`;

  const embedUrl = isSearch ? makeSearchEmbedUrl(value) : makeEmbedUrl(value);

  player.innerHTML = `
    <iframe
      title="YouTube preview"
      src="${embedUrl}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="player-footer">
      <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer">
        Open on YouTube
      </a>
      <span class="player-note">If the video doesn’t load here, use the link above to open it directly.</span>
    </div>
  `;
}

function renderGallery(ids) {
  gallery.innerHTML = '';

  if (ids.length === 0) {
    gallery.innerHTML = `<div class="empty">No videos added yet. Search by name or paste a video ID above to start.</div>`;
    return;
  }

  ids.forEach((item) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';

    const isSearch = isSearchEntry(item);
    const label = isSearch ? item.slice('search:'.length) : item;

    card.innerHTML = `
      <div class="card-thumb">
        ${isSearch ? '<div class="search-placeholder">Search</div>' : `<img loading="lazy" src="${makeThumbnailUrl(label)}" alt="YouTube thumbnail for ${label}" />`}
      </div>
      <div class="meta">
        <div class="id">${label}</div>
        <div class="label">${isSearch ? 'Search term' : 'Click to play'}</div>
      </div>
    `;

    card.addEventListener('click', async () => {
      await showVideo(item);
      // scroll to player on mobile
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    gallery.appendChild(card);
  });
}

async function addVideoId(input) {
  const query = input.trim();
  if (!query) {
    return;
  }

  const isId = isValidVideoId(query);
  const entry = isId ? query : `search:${query}`;

  const ids = getStoredIds();
  if (ids.includes(entry)) {
    await showVideo(entry);
    return;
  }

  ids.unshift(entry);
  setStoredIds(ids.slice(0, 60)); // keep a reasonably small history
  renderGallery(ids);
  videoIdInput.value = '';
  await showVideo(entry);
}

addButton.addEventListener('click', () => addVideoId(videoIdInput.value));
videoIdInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addVideoId(videoIdInput.value);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const ids = getStoredIds();
  renderGallery(ids);
  if (ids.length) {
    showVideo(ids[0]);
  }
});
