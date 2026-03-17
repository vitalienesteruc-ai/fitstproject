const videoIdInput = document.getElementById('videoId');
const addButton = document.getElementById('addButton');
const gallery = document.getElementById('gallery');
const player = document.getElementById('player');

// ⚠️ To search by name, set your YouTube Data API v3 key here:
//   https://developers.google.com/youtube/v3/getting-started
const YOUTUBE_API_KEY = 'AIzaSyAl3gseOihzDlXyI4yi1JYD1H68rfM9m68';

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

async function searchVideoId(query) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is missing. Set YOUTUBE_API_KEY in script.js.');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: query,
    maxResults: '1',
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.items?.[0]?.id?.videoId || null;
}

function isValidVideoId(value) {
  // YouTube IDs are typically 11 characters, allow a loose match.
  return /^[A-Za-z0-9_-]{8,20}$/.test(value.trim());
}

function clearPlayer() {
  player.innerHTML = `<div class="empty">Select a video to play</div>`;
}

function showVideo(id) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
  player.innerHTML = `
    <iframe
      title="YouTube preview"
      src="${makeEmbedUrl(id)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="player-footer">
      <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer">
        Open on YouTube
      </a>
      <span class="player-note">If you see a player error, this link opens the video on YouTube.</span>
    </div>
  `;
}

function renderGallery(ids) {
  gallery.innerHTML = '';

  if (ids.length === 0) {
    gallery.innerHTML = `<div class="empty">No videos added yet. Search by name or paste a video ID above to start.</div>`;
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

async function addVideoId(input) {
  const query = input.trim();
  if (!query) {
    return;
  }

  let videoId = query;
  if (!isValidVideoId(query)) {
    try {
      videoId = await searchVideoId(query);
    } catch (err) {
      window.alert(err.message);
      return;
    }

    if (!videoId) {
      window.alert('No videos found for that search term. Try a different phrase.');
      return;
    }
  }

  const ids = getStoredIds();
  if (ids.includes(videoId)) {
    return;
  }

  ids.unshift(videoId);
  setStoredIds(ids.slice(0, 60)); // keep a reasonably small history
  renderGallery(ids);
  videoIdInput.value = '';
  showVideo(videoId);
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
