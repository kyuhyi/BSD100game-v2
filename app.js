const CATEGORY_LABELS = {
  all: "전체",
  arcade: "아케이드",
  puzzle: "퍼즐",
  action: "액션",
  strategy: "전략",
  casual: "캐주얼"
};

const state = {
  category: "all",
  query: "",
  renderedCount: 0,
  filtered: [],
  observer: null
};

const games = Array.isArray(window.GAME_REGISTRY) ? window.GAME_REGISTRY : [];
const randomOrderById = new Map(
  shuffle(games.map((g) => g.id)).map((id, idx) => [id, idx])
);

const gamesGrid = document.getElementById("gamesGrid");
const categoryChips = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const heroCards = document.getElementById("heroCards");

init();

function init() {
  renderHeroMorph();
  renderCategoryChips();
  renderGames();

  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    renderGames();
  });
}

function renderHeroMorph() {
  if (!heroCards) return;
  const selected = shuffle([...games]).slice(0, 20);
  heroCards.innerHTML = "";
  selected.forEach((game) => {
    const img = document.createElement("img");
    img.className = "hero-mini";
    img.src = getLocalThumb(game.thumbnail, game.title || "GAME");
    img.alt = `${game.title || "game"} thumbnail`;
    img.loading = "eager";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.src = getFallbackThumb(game.title || "GAME");
    }, { once: true });
    heroCards.appendChild(img);
  });
}

function getCategories() {
  const set = new Set(["all"]);
  games.forEach((g) => {
    if (g.category) set.add(String(g.category).toLowerCase());
  });
  return [...set];
}

function renderCategoryChips() {
  categoryChips.innerHTML = "";
  getCategories().forEach((category) => {
    const btn = document.createElement("button");
    btn.className = `chip ${category === state.category ? "active" : ""}`;
    btn.textContent = CATEGORY_LABELS[category] || category;
    btn.addEventListener("click", () => {
      state.category = category;
      renderCategoryChips();
      renderGames();
    });
    categoryChips.appendChild(btn);
  });
}

function getFilteredGames() {
  const q = state.query.toLowerCase();
  const filtered = games.filter((game) => {
    const gameCategory = String(game.category || "casual").toLowerCase();
    const categoryMatch = state.category === "all" || gameCategory === state.category;
    if (!categoryMatch) return false;
    if (!q) return true;
    const target = `${game.title || ""} ${game.description || ""} ${gameCategory}`.toLowerCase();
    return target.includes(q);
  });

  filtered.sort((a, b) => {
    const ai = randomOrderById.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bi = randomOrderById.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });

  return filtered;
}

function renderGames() {
  const filtered = getFilteredGames();
  state.filtered = filtered;
  state.renderedCount = 0;
  document.getElementById("scrollSentinel")?.remove();
  if (state.observer) {
    state.observer.disconnect();
    state.observer = null;
  }

  gamesGrid.innerHTML = "";

  if (!filtered.length) {
    gamesGrid.innerHTML = `<article class="game-card"><p class="game-desc">검색 결과가 없어요. 다른 키워드를 입력해보세요!</p></article>`;
    return;
  }

  loadMoreCards();
  setupInfiniteScroll();
}

function loadMoreCards() {
  const PAGE_SIZE = 18;
  const end = Math.min(state.renderedCount + PAGE_SIZE, state.filtered.length);

  for (let i = state.renderedCount; i < end; i += 1) {
    const game = state.filtered[i];
    const card = document.createElement("article");
    card.className = "game-card";
    card.style.animationDelay = `${Math.min(i * 0.01, 0.2)}s`;

    const thumb = getLocalThumb(game.thumbnail, game.title || "GAME");
    const badge = game.hot ? "HOT" : game.new ? "NEW" : CATEGORY_LABELS[String(game.category || "").toLowerCase()] || "GAME";

    const playUrl = `play.html?game=${encodeURIComponent(game.id)}`;
    const priority = i < 6 ? "high" : "low";

    const fallbackThumb = getFallbackThumb(game.title || "GAME");

    card.innerHTML = `
      <div class="thumb-wrap">
        <img class="thumb" src="${thumb}" alt="${escapeHtml(game.title || "게임 썸네일")}" loading="eager" decoding="async" fetchpriority="${priority}">
        <span class="badge">${badge}</span>
      </div>
      <h3 class="game-title">${escapeHtml(game.title || "이름 없는 게임")}</h3>
      <p class="game-desc">${escapeHtml(game.description || "설명이 없습니다.")}</p>
      <div class="card-footer">
        <span class="badge chip-mini">${CATEGORY_LABELS[String(game.category || "").toLowerCase()] || "기타"}</span>
        <a class="play-btn" href="${playUrl}">플레이</a>
      </div>
    `;
    const img = card.querySelector(".thumb");
    img.addEventListener("error", () => {
      img.src = fallbackThumb;
    }, { once: true });
    gamesGrid.appendChild(card);
  }

  state.renderedCount = end;
}

function setupInfiniteScroll() {
  if (state.renderedCount >= state.filtered.length) return;
  const sentinel = document.createElement("div");
  sentinel.id = "scrollSentinel";
  sentinel.style.height = "1px";
  gamesGrid.insertAdjacentElement("afterend", sentinel);

  state.observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    loadMoreCards();
    if (state.renderedCount >= state.filtered.length) {
      state.observer.disconnect();
      state.observer = null;
      sentinel.remove();
    }
  }, { rootMargin: "300px" });

  state.observer.observe(sentinel);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getLocalThumb(originalThumbnail, title) {
  if (originalThumbnail) {
    const fileName = String(originalThumbnail).split("/").pop();
    if (fileName) return `assets/${fileName}?v=2`;
  }
  return getFallbackThumb(title);
}

function getFallbackThumb(title) {
  const safeTitle = escapeHtml(String(title).slice(0, 16));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 340'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#4e5bff'/><stop offset='100%' stop-color='#ff4fc4'/></linearGradient></defs><rect width='600' height='340' fill='url(#g)'/><text x='300' y='188' text-anchor='middle' font-size='40' fill='white' font-family='sans-serif' font-weight='700'>${safeTitle}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
