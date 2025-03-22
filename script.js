function showSection(sectionId) {
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
    }
    async function handleSearch() {
      const query = document.getElementById('searchInput').value;
      if (!query) return;
      document.getElementById('loading').style.display = 'block';
      document.getElementById('results').innerHTML = '';
      setTimeout(async () => {
        const tracks = await searchSpotifyTracks(query);
        document.getElementById('loading').style.display = 'none';
        displaySearchResults(tracks);
      }, 2000);
    }
    async function searchSpotifyTracks(query) {
      const clientId = 'acc6302297e040aeb6e4ac1fbdfd62c3';
      const clientSecret = '0e8439a1280a43aba9a5bc0a16f3f009';
      const auth = btoa(`${clientId}:${clientSecret}`);
      const getToken = async () => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          body: new URLSearchParams({ grant_type: 'client_credentials' }),
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return (await response.json()).access_token;
      };
      const accessToken = await getToken();
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
      const response = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return data.tracks.items;
    }
    // Menampilkan hasil pencarian dengan desain baru
function displaySearchResults(tracks) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  tracks.forEach(track => {
    const trackCard = document.createElement('div');
    trackCard.classList.add('track-card');
    trackCard.innerHTML = `
      <div class="favorite-btn" onclick="toggleFavorite(this)">❤️</div>
      <img src="${track.img}" alt="${track.title}">
      <div class="track-info">
        <h3 class="track-title">${track.title}</h3>
        <p class="track-artist">${track.artist} · ${track.genre} · ${track.duration}</p>
      </div>
      <div class="waveform">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <button class="play-btn" onclick="playSong('${track.title}', '${track.artist}', '${track.img}')">▶ Play</button>
    `;
    resultsContainer.appendChild(trackCard);
  });
}

// Toggle tombol favorit
function toggleFavorite(element) {
  element.classList.toggle('active');
  if (element.classList.contains('active')) {
    element.innerHTML = "💖";
  } else {
    element.innerHTML = "❤️";
  }
}
    function playSong(previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
    }
