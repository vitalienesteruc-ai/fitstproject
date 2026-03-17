const videoIdInput = document.getElementById('videoId');
const addButton = document.getElementById('addButton');
const gallery = document.getElementById('gallery');
const player = document.getElementById('player');

const STORAGE_KEY = 'yt-preview-ids';

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

function isValidVideoId(value) {
  // YouTube IDs are typically 11 characters, allow a loose match.
  return /^[A-Za-z0-9_-]{8,20}$/.test(value.trim());
}

function clearPlayer() {
  player.innerHTML = `<div class="empty">Select a video to play</div>`;
}

function showVideo(id) {
  player.innerHTML = `
    <iframe
      title="YouTube preview"
      src="${makeEmbedUrl(id)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
}

function renderGallery(ids) {
  gallery.innerHTML = '';

  if (ids.length === 0) {
    gallery.innerHTML = `<div class="empty">No videos added yet. Add a YouTube video ID above to start.</div>`;
    return;
  }

  ids.forEach((id) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${makeThumbnailUrl(id)}" alt="YouTube thumbnail for ${id}" />
      <div class="meta">
        <div class="id">${id}</div>
        <div class="label">Click to play</div>
      </div>
    `;

    card.addEventListener('click', () => {
      showVideo(id);
      // scroll to player on mobile
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    gallery.appendChild(card);
  });
}

function addVideoId(id) {
  const normalized = id.trim();
  if (!isValidVideoId(normalized)) {
    window.alert('Please enter a valid YouTube video ID (e.g., dQw4w9WgXcQ).');
    return;
  }

  const ids = getStoredIds();
  if (ids.includes(normalized)) {
    return;
  }

  ids.unshift(normalized);
  setStoredIds(ids.slice(0, 60)); // keep a reasonably small history
  renderGallery(ids);
  videoIdInput.value = '';
  showVideo(normalized);
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
