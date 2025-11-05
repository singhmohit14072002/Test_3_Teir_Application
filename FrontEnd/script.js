// Anime dataset with working image links
const ANIME = [
  {
    id: 'naruto',
    title: "Naruto",
    year: 2002,
    genre: ["Action", "Adventure"],
    desc: "A young ninja strives to become the Hokage while making friends and facing enemies.",
    img: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg"
  },
  {
    id: 'onepiece',
    title: "One Piece",
    year: 1999,
    genre: ["Adventure", "Fantasy"],
    desc: "Monkey D. Luffy sails the Grand Line to find the ultimate treasure — the One Piece.",
    img: "https://upload.wikimedia.org/wikipedia/en/6/65/OnePieceVol1Cover.jpg"
  },
  {
    id: 'aot',
    title: "Attack on Titan",
    year: 2013,
    genre: ["Action", "Drama"],
    desc: "Humanity fights for survival against giant humanoid Titans — truths are revealed along the way.",
    img: "https://upload.wikimedia.org/wikipedia/en/0/0c/Attack_on_Titan_S1_DVD.jpg"
  },
  {
    id: 'demon',
    title: "Demon Slayer",
    year: 2019,
    genre: ["Action", "Supernatural"],
    desc: "A young swordsman seeks a cure for his sister and vengeance against demons.",
    img: "https://upload.wikimedia.org/wikipedia/en/3/3a/Kimetsu_no_Yaiba_Volume_1_cover.jpg"
  },
  {
    id: 'spyxfamily',
    title: "Spy × Family",
    year: 2022,
    genre: ["Comedy", "Slice of Life"],
    desc: "A spy, an assassin, and a telepath form an eccentric family to keep up appearances.",
    img: "https://upload.wikimedia.org/wikipedia/en/f/f0/Spy_%C3%97_Family_Volume_1.jpg"
  },
  {
    id: 'jujutsu',
    title: "Jujutsu Kaisen",
    year: 2020,
    genre: ["Action", "Supernatural"],
    desc: "A student battles Cursed Spirits after inheriting a dangerous curse.",
    img: "https://upload.wikimedia.org/wikipedia/en/6/6a/Jujutsu_kaisen_vol_1_cover.jpg"
  }
];

// DOM references
const grid = document.getElementById('animeGrid');
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genreFilter');
const emptyState = document.getElementById('empty');

// Modal references
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalMeta = document.getElementById('modalMeta');
const modalDescription = document.getElementById('modalDescription');
const watchBtn = document.getElementById('watchBtn');
const favBtn = document.getElementById('favBtn');

let currentList = [...ANIME];

function uniqueGenres(list) {
  const s = new Set();
  list.forEach(a => a.genre.forEach(g => s.add(g)));
  return Array.from(s).sort();
}

function renderGenres() {
  const genres = uniqueGenres(ANIME);
  genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });
}

function createCard(anime) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img class="poster" src="${anime.img}" alt="${anime.title} poster" loading="lazy" />
    <div class="body">
      <h3>${anime.title}</h3>
      <p class="meta">${anime.year} • ${anime.genre.join(', ')}</p>
      <div class="actions">
        <button class="btn" data-id="${anime.id}">Details</button>
        <button class="btn btn-ghost" data-fav="${anime.id}">+List</button>
      </div>
    </div>
  `;
  const detailsBtn = card.querySelector('button[data-id]');
  detailsBtn.addEventListener('click', () => openModal(anime.id));
  const favBtnLocal = card.querySelector('button[data-fav]');
  favBtnLocal.addEventListener('click', () => {
    favBtnLocal.textContent = '✓ Added';
    favBtnLocal.disabled = true;
  });
  return card;
}

function render(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  const frag = document.createDocumentFragment();
  list.forEach(a => frag.appendChild(createCard(a)));
  grid.appendChild(frag);
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;
  currentList = ANIME.filter(a => {
    const matchesQuery = !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    const matchesGenre = genre === 'all' || a.genre.includes(genre);
    return matchesQuery && matchesGenre;
  });
  render(currentList);
}

function openModal(id) {
  const a = ANIME.find(x => x.id === id);
  if (!a) return;
  modalImage.src = a.img;
  modalImage.alt = `${a.title} poster`;
  modalTitle.textContent = a.title;
  modalMeta.textContent = `${a.year} • ${a.genre.join(', ')}`;
  modalDescription.textContent = a.desc;
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  watchBtn.onclick = () => {
    const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(a.title + ' trailer')}`;
    window.open(trailerUrl, '_blank');
  };
  favBtn.onclick = () => {
    favBtn.textContent = '✓ Added';
    favBtn.disabled = true;
  };
  modalCloseBtn.focus();
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
}

searchInput.addEventListener('input', debounce(applyFilters, 220));
genreFilter.addEventListener('change', applyFilters);
modalClose.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

renderGenres();
render(ANIME);
