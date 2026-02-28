import './chatbot.js';

const STORAGE_KEY = 'ClassIt_recent_searches_v1';
const ITEMS_PER_PAGE_CATEGORY = 15;
const ITEMS_PER_PAGE_SEARCH = 16;

const ICON_SEARCH = `
<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="7"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
`;

const ICON_CLOSE = `
<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;

const SEARCH_FILTERS = [
  { key: 'livogue', label: 'Livogue' },
  { key: 'wellfit', label: 'Wellfit' },
  { key: 'tech', label: 'Tech' },
];

function createId(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function shuffleArray(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function debounce(fn, wait = 200) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeCategory(value) {
  const normalized = normalizeText(value);
  if (!normalized) return '';
  if (normalized.includes('wellfit') || normalized.includes('fit')) return 'wellfit';
  if (normalized.includes('livogue')) return 'livogue';
  if (normalized.includes('tech')) return 'tech';
  return normalized;
}

function levenshtein(a, b) {
  const rows = b.length + 1;
  const cols = a.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let col = 0; col < cols; col += 1) matrix[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      if (b[row - 1] === a[col - 1]) {
        matrix[row][col] = matrix[row - 1][col - 1];
      } else {
        matrix[row][col] = Math.min(
          matrix[row - 1][col - 1] + 1,
          matrix[row][col - 1] + 1,
          matrix[row - 1][col] + 1,
        );
      }
    }
  }

  return matrix[rows - 1][cols - 1];
}

function fuzzyMatch(query, target) {
  if (!query || !target) return false;

  const q = normalizeText(query);
  const t = normalizeText(target);
  if (!q || !t) return false;

  if (t.includes(q)) return true;
  if (q.length <= 2) return false;

  const allowedErrors = Math.max(1, Math.floor(q.length / 4));
  if (Math.abs(q.length - t.length) > 3) return false;
  return levenshtein(q, t) <= allowedErrors;
}

function loadRecent() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveRecent(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 3)));
  } catch (error) {
    // Intentionally ignored.
  }
}

function safeTrack(eventName, payload = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
}

function setFavicon(theme) {
  const favicon = document.getElementById('dynamic-favicon');
  if (!favicon) return;

  const currentHref = favicon.getAttribute('href') || '';
  const nextName = theme === 'dark'
    ? 'favicon-dark-sq-v2.png'
    : 'favicon-gold-sq-v2.png';

  if (/favicon-(dark|gold)-sq-v2\.png/.test(currentHref)) {
    favicon.setAttribute('href', currentHref.replace(/favicon-(dark|gold)-sq-v2\.png/, nextName));
    return;
  }

  if (currentHref.includes('/assets/images/')) {
    favicon.setAttribute('href', currentHref.replace(/[^/]*$/, nextName));
    return;
  }

  favicon.setAttribute('href', `/assets/images/${nextName}`);
}

function applyTheme(theme, themeToggle, shouldTrack = false) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  if (themeToggle) {
    themeToggle.checked = nextTheme === 'dark';
  }
  setFavicon(nextTheme);

  if (shouldTrack) {
    safeTrack('theme_toggle', { theme_selected: nextTheme });
  }
}

function buildImageMarkup(product) {
  const desktopImage = escapeHtml(product.imageUrl || 'https://placehold.co/600x400?text=Image');
  const mobileImage = escapeHtml(product.mobileImageUrl || product.imageUrl || '');
  const altText = escapeHtml(product.altText || product.title || 'Product image');

  return `
    <div class="card-image-container">
      <picture>
        ${mobileImage ? `<source media="(max-width: 768px)" srcset="${mobileImage}">` : ''}
        <img src="${desktopImage}" alt="${altText}" onerror="this.src='https://placehold.co/600x400?text=Image'">
      </picture>
    </div>
  `;
}

function buildShareButtonMarkup(product) {
  return `
    <button
      type="button"
      class="share-btn"
      aria-label="Share ${escapeHtml(product.title || 'product')}"
      data-title="${escapeHtml(product.title || '')}"
      data-description="${escapeHtml(product.description || '')}"
      data-link="${escapeHtml(product.link || '')}"
      data-image="${escapeHtml(product.imageUrl || '')}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.36 3.36 0 0 0 0-1.4l7.05-4.11A2.97 2.97 0 0 0 18 8a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 1 0 6 15a3 3 0 0 0 2.04-.81l7.12 4.16a2.99 2.99 0 1 0 2.84-2.27z"></path>
      </svg>
    </button>
  `;
}

function buildBuyLinkMarkup(product) {
  return `
    <a href="${escapeHtml(product.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">
      Buy Now
    </a>
  `;
}

function buildDescriptionParts(description, limit = 60) {
  const plain = String(description || '');
  const short = plain.slice(0, limit);
  const needsToggle = plain.length > limit;
  const shortEscaped = escapeHtml(short);

  return {
    full: escapeHtml(plain),
    short: shortEscaped,
    shortWithEllipsis: `${shortEscaped}${needsToggle ? '...' : ''}`,
    needsToggle,
  };
}

function renderGridCard(product) {
  const parts = buildDescriptionParts(product.description, 60);

  return `
    <article class="product-card" id="${createId(product.title)}">
      ${buildImageMarkup(product)}
      <h3>${escapeHtml(product.title)}</h3>
      <p data-full-text="${parts.full}" data-short-text="${parts.shortWithEllipsis}">
        ${parts.shortWithEllipsis}
      </p>
      ${parts.needsToggle ? '<button type="button" class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>' : ''}
      <div class="product-card-footer">
        ${buildShareButtonMarkup(product)}
        ${buildBuyLinkMarkup(product)}
      </div>
    </article>
  `;
}

function renderGalleryCard(product) {
  return `
    <article class="card js-card-fix" id="${createId(product.title)}">
      ${buildImageMarkup(product)}
      <h3>${escapeHtml(product.title)}</h3>
      <p>${escapeHtml(product.description || '')}</p>
      <div class="product-card-footer">
        ${buildShareButtonMarkup(product)}
        ${buildBuyLinkMarkup(product)}
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  const ui = {
    menuBtn: document.getElementById('menuBtn'),
    sidebar: document.getElementById('sidebar'),
    closeSidebar: document.getElementById('closeSidebar'),
    overlay: document.getElementById('overlay'),
    searchWrap: document.querySelector('.search-wrap'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchDropdown: document.getElementById('searchDropdown'),
    searchResults: document.getElementById('searchResults'),
    searchPagination: document.getElementById('searchPagination'),
    grid: document.getElementById('productGrid'),
    paginationContainer: document.getElementById('defaultPagination'),
    gallery: document.getElementById('gallery'),
    gallerySection: document.getElementById('gallerySection'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    breadcrumbs: document.getElementById('breadcrumbs'),
    errorMessage: document.getElementById('error-message'),
    filterContainer: document.getElementById('searchFilterContainer'),
    mainTitle: document.getElementById('mainTitle'),
    sortWrapper: document.querySelector('.sort-wrapper'),
    customSortTrigger: document.getElementById('customSortTrigger'),
    customSortOptions: document.getElementById('customSortOptions'),
    sortLabel: document.getElementById('sortLabel'),
    homeBottomSentinel: document.getElementById('homeSearchBottomSentinel'),
  };

  const state = {
    allProducts: [],
    categoryItems: [],
    activeFilters: new Set(),
    searchSelectedIndex: -1,
    currentSort: 'newest',
  };

  const isHomePage = document.body.dataset.home === 'true';
  const isCategoryPage = Boolean(ui.grid);
  const currentCategory = isCategoryPage ? normalizeCategory(ui.grid.dataset.category) : '';

  let homeFooterObserver = null;
  let placeholderTimer = null;
  let galleryTimer = null;
  let galleryCards = [];
  let activeGalleryIndex = 0;

  function stopPlaceholderAnimation() {
    clearTimeout(placeholderTimer);
  }

  function startPlaceholderAnimation() {
    if (!isHomePage || !ui.searchInput || document.body.classList.contains('searching')) return;
    if (!state.allProducts.length) return;

    stopPlaceholderAnimation();

    const names = shuffleArray(
      state.allProducts
        .map((product) => product.title)
        .filter(Boolean),
    );
    if (!names.length) return;

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const loop = () => {
      const word = names[wordIndex];
      if (!word) return;

      if (deleting) characterIndex -= 1;
      else characterIndex += 1;

      const fragment = word.slice(0, Math.max(0, characterIndex));
      ui.searchInput.setAttribute('placeholder', `Search ${fragment}...`);

      if (!deleting && characterIndex >= word.length) {
        deleting = true;
        placeholderTimer = setTimeout(loop, 1400);
        return;
      }

      if (deleting && characterIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % names.length;
        placeholderTimer = setTimeout(loop, 420);
        return;
      }

      placeholderTimer = setTimeout(loop, deleting ? 55 : 85);
    };

    loop();
  }

  function updateSearchButtonMode() {
    if (!ui.searchBtn || !ui.searchInput) return;
    const hasText = ui.searchInput.value.trim().length > 0;
    ui.searchBtn.dataset.mode = hasText ? 'clear' : 'search';
    ui.searchBtn.innerHTML = hasText ? ICON_CLOSE : ICON_SEARCH;
  }

  function openSidebar() {
    if (!ui.sidebar) return;
    ui.sidebar.classList.add('show');
    ui.sidebar.setAttribute('aria-hidden', 'false');

    if (ui.overlay) {
      ui.overlay.classList.remove('hidden');
      ui.overlay.classList.add('show');
      ui.overlay.setAttribute('aria-hidden', 'false');
    }
  }

  function hideSidebar() {
    if (!ui.sidebar) return;
    ui.sidebar.classList.remove('show');
    ui.sidebar.setAttribute('aria-hidden', 'true');

    if (ui.overlay) {
      ui.overlay.classList.remove('show');
      ui.overlay.classList.add('hidden');
      ui.overlay.setAttribute('aria-hidden', 'true');
    }
  }

  function closeSortMenu() {
  if (!ui.customSortOptions || !ui.customSortTrigger) return;

  ui.customSortOptions.classList.remove('show');
  ui.customSortOptions.classList.add('hidden');  // IMPORTANT
  ui.customSortTrigger.classList.remove('open');
}


  function getFooterAnchorElement() {
    if (ui.homeBottomSentinel) return ui.homeBottomSentinel;

    const hasPagination = ui.searchPagination
      && !ui.searchPagination.classList.contains('hidden')
      && ui.searchPagination.childElementCount > 0;
    if (hasPagination) return ui.searchPagination;

    if (ui.searchResults?.lastElementChild) return ui.searchResults.lastElementChild;
    return ui.searchResults || null;
  }

  function updateSearchFooterVisibility() {
    if (!isHomePage) return;

    const searching = document.body.classList.contains('searching');
    if (!searching) {
      document.body.classList.remove('show-search-footer');
      return;
    }

    const anchor = getFooterAnchorElement();
    if (!anchor) {
      document.body.classList.remove('show-search-footer');
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const reachedBottom = anchorRect.top <= window.innerHeight + 6;
    document.body.classList.toggle('show-search-footer', reachedBottom);
  }

  function setupHomeSearchFooterObserver() {
    if (!isHomePage || !ui.homeBottomSentinel) return;
    if (!('IntersectionObserver' in window)) return;

    if (homeFooterObserver) homeFooterObserver.disconnect();

    homeFooterObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const searching = document.body.classList.contains('searching');
      const shouldReveal = Boolean(searching && entry?.isIntersecting);
      document.body.classList.toggle('show-search-footer', shouldReveal);
    }, { root: null, threshold: 0, rootMargin: '0px' });

    homeFooterObserver.observe(ui.homeBottomSentinel);
  }

  function highlightSidebarLink() {
    const currentPath = window.location.pathname.replace(/\/$/, '').replace('/index.html', '') || '/';
    const links = document.querySelectorAll('.sidebar-nav a');

    links.forEach((link) => {
      try {
        const path = new URL(link.href).pathname.replace(/\/$/, '').replace('/index.html', '') || '/';
        if (path === currentPath) link.classList.add('active');
      } catch (error) {
        // Ignore malformed links.
      }
    });
  }

  function renderBreadcrumbs() {
    if (!ui.breadcrumbs) return;

    let html = '<a href="/">Home</a>';
    const pageType = document.body.dataset.page;
    const searching = document.body.classList.contains('searching');
    const query = ui.searchInput?.value.trim() || '';

    if (pageType === 'contact') {
      html += ' <span>/</span> <span class="current">Contact</span>';
    } else if (pageType === 'about') {
      html += ' <span>/</span> <span class="current">About Us</span>';
    } else if (searching && (query || state.activeFilters.size > 0)) {
      html += ' <span>/</span> <span class="current">Search</span>';
    } else if (isCategoryPage && currentCategory) {
      const title = currentCategory[0].toUpperCase() + currentCategory.slice(1);
      html += ` <span>/</span> <span class="current">${escapeHtml(title)}</span>`;
    }

    ui.breadcrumbs.innerHTML = html;
  }

  function renderPagination(container, totalPages, currentPage, onPageChange) {
    if (!container) return;
    container.innerHTML = '';

    if (totalPages <= 1) {
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');

    const addButton = (label, targetPage, disabled, active = false) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pagination-btn';
      if (active) button.classList.add('active');
      button.textContent = label;
      button.disabled = disabled;
      button.addEventListener('click', () => {
        if (disabled || active) return;

        const section = ui.searchResults && !ui.searchResults.classList.contains('hidden')
          ? ui.searchResults
          : (ui.grid || ui.gallerySection);

        if (section) {
          const y = section.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }

        onPageChange(targetPage);
      });
      container.appendChild(button);
    };

    addButton('<', currentPage - 1, currentPage === 1);
    addButton(String(currentPage), currentPage, true, true);
    addButton('>', currentPage + 1, currentPage === totalPages);
  }

  function renderFilterUI() {
    if (!ui.filterContainer) return;

    ui.filterContainer.innerHTML = SEARCH_FILTERS.map((filter) => {
      const active = state.activeFilters.has(filter.key);
      return `
        <button
          type="button"
          class="filter-pill ${active ? 'active' : ''}"
          data-cat="${filter.key}"
        >
          ${filter.label}
        </button>
      `;
    }).join('');

    ui.filterContainer.querySelectorAll('.filter-pill').forEach((button) => {
      button.addEventListener('click', () => {
        const categoryKey = button.dataset.cat;
        if (!categoryKey) return;

        if (state.activeFilters.has(categoryKey)) {
          state.activeFilters.delete(categoryKey);
        } else {
          state.activeFilters.add(categoryKey);
        }

        renderFilterUI();
        doSearch(ui.searchInput?.value || '', 1);
      });
    });
  }

  function hideDropdown() {
    if (!ui.searchDropdown) return;
    state.searchSelectedIndex = -1;
    ui.searchDropdown.classList.add('hidden');
  }

  function renderDropdown(filter = '') {
    if (!ui.searchDropdown) return;

    const query = filter.trim();
    const historyMatches = loadRecent()
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()));

    let productMatches = [];
    if (query.length >= 3) {
      productMatches = state.allProducts
        .filter((item) => fuzzyMatch(query, item.title))
        .map((item) => item.title);
    }

    const displayItems = [];
    const seen = new Set();

    historyMatches.forEach((item) => {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        displayItems.push({ text: item, type: 'history' });
      }
    });

    productMatches.forEach((item) => {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        displayItems.push({ text: item, type: 'product' });
      }
    });

    const limitedItems = displayItems.slice(0, 6);
    state.searchSelectedIndex = -1;

    if (!limitedItems.length) {
      hideDropdown();
      return;
    }

    ui.searchDropdown.innerHTML = limitedItems.map((item) => `
      <div class="row" data-value="${escapeHtml(item.text)}">
        <span class="value">
          <span class="label">${escapeHtml(item.text)}</span>
          ${item.type === 'product' ? '<span class="badge">Product</span>' : ''}
        </span>
        ${item.type === 'history'
    ? `<button type="button" class="remove" data-remove="${escapeHtml(item.text)}" aria-label="Remove search">x</button>`
    : ''}
      </div>
    `).join('');

    ui.searchDropdown.classList.remove('hidden');
  }

  function handleDropdownClick(event) {
    const removeButton = event.target.closest('.remove');
    if (removeButton) {
      const valueToRemove = removeButton.dataset.remove;
      if (!valueToRemove) return;

      const updated = loadRecent().filter((item) => item !== valueToRemove);
      saveRecent(updated);
      renderDropdown(ui.searchInput?.value || '');
      ui.searchInput?.focus();
      return;
    }

    const row = event.target.closest('.row');
    if (!row || !ui.searchInput) return;
    const selectedValue = row.dataset.value;
    if (!selectedValue) return;

    ui.searchInput.value = selectedValue;
    updateSearchButtonMode();
    hideDropdown();
    doSearch(selectedValue, 1);
    ui.searchInput.blur();
  }

  async function handleShareClick({ title, description, link }) {
    const shareUrl = link || window.location.href;
    const shareTitle = title || 'Check this product';
    const shareDescription = description || 'You may like this';
    const shareText = `${shareTitle}\n\n${shareDescription}`;
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User canceled share.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      alert('Share is not supported on this device. Product details were copied.');
    } catch (error) {
      alert('Share is not supported on this device.');
    }
  }

  function highlightCard(card) {
    if (!card) return;
    card.classList.add('is-spotlight');
    setTimeout(() => {
      card.classList.remove('is-spotlight');
    }, 2000);
  }

  function handleCardActionClick(event) {
    const shareButton = event.target.closest('.share-btn');
    if (shareButton) {
      event.preventDefault();

      const productTitle = shareButton.dataset.title || '';
      const deepLink = `${window.location.origin}${window.location.pathname}#${createId(productTitle)}`;

      handleShareClick({
        title: productTitle,
        description: shareButton.dataset.description || '',
        link: deepLink,
      });
      return;
    }

    const toggleButton = event.target.closest('.show-more-btn');
    if (!toggleButton) return;
    event.preventDefault();

    const card = toggleButton.closest('.product-card');
    if (!card) return;

    const paragraph = card.querySelector('p[data-full-text]');
    if (!paragraph) return;

    const expanded = card.classList.toggle('is-expanded');
    paragraph.innerHTML = expanded
      ? paragraph.dataset.fullText || ''
      : paragraph.dataset.shortText || '';
    toggleButton.textContent = expanded
      ? (toggleButton.dataset.lessText || 'less')
      : (toggleButton.dataset.moreText || '...more');
  }

  function updateGallery() {
    if (!galleryCards.length) return;
    galleryCards.forEach((card, index) => {
      card.classList.remove('center', 'left', 'right', 'hidden');
      if (index === activeGalleryIndex) card.classList.add('center');
      else if (index === (activeGalleryIndex - 1 + galleryCards.length) % galleryCards.length) card.classList.add('left');
      else if (index === (activeGalleryIndex + 1) % galleryCards.length) card.classList.add('right');
      else card.classList.add('hidden');
    });
  }

  function moveGallery(step) {
    if (!galleryCards.length) return;
    activeGalleryIndex = (activeGalleryIndex + step + galleryCards.length) % galleryCards.length;
    updateGallery();
  }

  function stopGalleryAutoplay() {
    clearInterval(galleryTimer);
    galleryTimer = null;
  }

  function startGalleryAutoplay() {
    if (!isHomePage || galleryCards.length <= 1) return;
    stopGalleryAutoplay();
    galleryTimer = setInterval(() => {
      moveGallery(1);
    }, 4200);
  }

  function initGallery() {
    if (!isHomePage || !ui.gallery) return;

    const categories = [...new Set(
      state.allProducts
        .map((product) => normalizeCategory(product.category))
        .filter(Boolean),
    )];

    const topPicks = categories
      .map((categoryKey) => {
        const pool = state.allProducts.filter(
          (product) => normalizeCategory(product.category) === categoryKey,
        );
        if (!pool.length) return null;
        return pool[Math.floor(Math.random() * pool.length)];
      })
      .filter(Boolean);

    if (!topPicks.length) {
      ui.gallerySection?.classList.add('hidden');
      return;
    }

    ui.gallery.innerHTML = topPicks.map((product) => renderGalleryCard(product)).join('');
    galleryCards = Array.from(ui.gallery.querySelectorAll('.card'));
    activeGalleryIndex = 0;
    updateGallery();
    startGalleryAutoplay();
    ui.gallerySection?.classList.remove('is-loading');
  }

function renderCategoryGrid(page = 1) {
  if (!isCategoryPage || !ui.grid) return;

  // 🔥 STOP rendering grid if search input has text
  if (ui.searchInput && ui.searchInput.value.trim() !== '') return;

  const start = (page - 1) * ITEMS_PER_PAGE_CATEGORY;
  const paginated = state.categoryItems.slice(start, start + ITEMS_PER_PAGE_CATEGORY);

  ui.grid.innerHTML = paginated.map((product) => renderGridCard(product)).join('');
  ui.grid.classList.remove('hidden');

  const totalPages = Math.ceil(state.categoryItems.length / ITEMS_PER_PAGE_CATEGORY);
  renderPagination(ui.paginationContainer, totalPages, page, renderCategoryGrid);

  updateSearchFooterVisibility();
}


  function renderCategoryFallbackIntoSearchResults() {
    if (!isCategoryPage || !ui.searchResults) return;

    const defaultItems = state.categoryItems.slice(0, ITEMS_PER_PAGE_CATEGORY);
    const fallbackGrid = document.createElement('div');
    fallbackGrid.className = 'product-grid';
    fallbackGrid.innerHTML = defaultItems.map((product) => renderGridCard(product)).join('');
    ui.searchResults.appendChild(fallbackGrid);
  }

function renderSearchResults(results, page = 1, query = '') {
  if (!ui.searchResults) return;

  const start = (page - 1) * ITEMS_PER_PAGE_SEARCH;
  const paginated = results.slice(start, start + ITEMS_PER_PAGE_SEARCH);
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE_SEARCH);

  document.body.classList.add('searching');
  ui.searchResults.innerHTML = '';

  const hasResults = paginated.length > 0;

  // ---- BODY STATE CLASSES ----
  document.body.classList.toggle('search-has-results', hasResults);
  document.body.classList.toggle('search-no-results', !hasResults);

  // ---- HOME PAGE BEHAVIOUR ----
  if (isHomePage) {
    ui.gallerySection?.classList.toggle('hidden', hasResults);
    ui.mainTitle?.classList.toggle('hidden', hasResults);
  }

  // ---- CATEGORY PAGE BEHAVIOUR ----
  if (isCategoryPage) {
  if (hasResults) {
    ui.grid.style.display = 'none';
    ui.paginationContainer.style.display = 'none';
  } else {
    ui.grid.style.display = '';
    ui.paginationContainer.style.display = '';
  }
}


  if (!hasResults) {

    safeTrack('search_no_results', { keyword: query });

    ui.searchResults.innerHTML = `
      <div class="no-results-wrapper">
        <p class="no-results-message">
          <span>No results found for </span><strong>"${escapeHtml(query)}"</strong>
        </p>
      </div>
    `;

    ui.searchResults.classList.remove('hidden');
    ui.searchPagination?.classList.add('hidden');

  } else {

    const resultGrid = document.createElement('div');
    resultGrid.className = 'product-grid';
    resultGrid.innerHTML = paginated.map((product) => renderGridCard(product)).join('');
    ui.searchResults.appendChild(resultGrid);

    ui.searchResults.classList.remove('hidden');
    ui.searchPagination?.classList.remove('hidden');

    renderPagination(
      ui.searchPagination,
      totalPages,
      page,
      (newPage) => doSearch(query, newPage)
    );
  }

  updateSearchFooterVisibility();
}


  function resetToDefaultView({ clearInput = true } = {}) {
    document.body.classList.remove('searching', 'search-has-results', 'search-no-results', 'show-search-footer');

    if (ui.searchResults) {
      ui.searchResults.classList.add('hidden');
      ui.searchResults.innerHTML = '';
    }

    if (ui.searchPagination) {
      ui.searchPagination.innerHTML = '';
      ui.searchPagination.classList.add('hidden');
    }

    if (ui.filterContainer) {
      ui.filterContainer.classList.add('hidden');
      ui.filterContainer.innerHTML = '';
    }
    state.activeFilters.clear();

    if (clearInput && ui.searchInput) {
      ui.searchInput.value = '';
    }

    if (isHomePage && ui.gallerySection) {
      ui.gallerySection.classList.remove('hidden');
    }

    if (isCategoryPage) {
      ui.grid?.classList.remove('hidden');
      ui.paginationContainer?.classList.remove('hidden');
      renderCategoryGrid(1);
    }
    ui.grid.style.display = '';
ui.paginationContainer.style.display = '';


    hideDropdown();
    updateSearchButtonMode();
    renderBreadcrumbs();
    updateSearchFooterVisibility();

    if (ui.searchInput && ui.searchInput.value.trim() === '') {
      startPlaceholderAnimation();
    }
  }

  function doSearch(rawQuery, page = 1) {
    const query = String(rawQuery || '').trim();
    const hasFilters = state.activeFilters.size > 0;

    if (!query && !hasFilters) {
      resetToDefaultView({ clearInput: false });
      return;
    }

    document.body.classList.add('searching');
    document.body.classList.remove('show-search-footer');

    if (ui.filterContainer) {
      ui.filterContainer.classList.remove('hidden');
      if (!ui.filterContainer.childElementCount) {
        renderFilterUI();
      }
    }

    if (query) {
      const recents = loadRecent();
      if (!recents.some((item) => item.toLowerCase() === query.toLowerCase())) {
        recents.unshift(query);
        saveRecent(recents);
      }
    }

    renderBreadcrumbs();
    hideDropdown();

    const source = isCategoryPage ? [...state.categoryItems] : [...state.allProducts];
    const filteredByCategory = hasFilters
      ? source.filter((item) => state.activeFilters.has(normalizeCategory(item.category)))
      : source;

    const matched = query
      ? filteredByCategory.filter((item) => (
        fuzzyMatch(query, item.title)
        || fuzzyMatch(query, item.description || '')
      ))
      : filteredByCategory;

    renderSearchResults(matched, page, query);
  }

  function getComparablePrice(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function sortProducts(criteria) {
    state.currentSort = criteria;
    const list = isCategoryPage ? state.categoryItems : state.allProducts;
    const getDate = (entry) => new Date(entry?._updatedAt || entry?._createdAt || 0).getTime();

    switch (criteria) {
      case 'oldest':
        list.sort((a, b) => {
          const diff = getDate(a) - getDate(b);
          return diff !== 0 ? diff : b.title.localeCompare(a.title);
        });
        break;
      case 'price-low':
        list.sort((a, b) => getComparablePrice(a.price) - getComparablePrice(b.price));
        break;
      case 'price-high':
        list.sort((a, b) => getComparablePrice(b.price) - getComparablePrice(a.price));
        break;
      case 'alpha-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        list.sort((a, b) => {
          const diff = getDate(b) - getDate(a);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
    }

    if (document.body.classList.contains('searching')) {
      doSearch(ui.searchInput?.value || '', 1);
      return;
    }

    if (isCategoryPage) {
      renderCategoryGrid(1);
    }
  }

function setupCustomSort() {
  if (!ui.customSortTrigger || !ui.customSortOptions || !ui.sortLabel) return;

  ui.customSortOptions.innerHTML = `
    <div class="custom-option selected" data-value="newest">Sort by: Newest</div>
    <div class="custom-option" data-value="oldest">Sort by: Oldest</div>
    <div class="custom-option" data-value="price-low">Price: Low to High</div>
    <div class="custom-option" data-value="price-high">Price: High to Low</div>
    <div class="custom-option" data-value="alpha-asc">Name: A to Z</div>
  `;

  // Toggle dropdown
  ui.customSortTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    ui.customSortTrigger.addEventListener('click', (event) => {
  event.stopPropagation();

  const isOpen = ui.customSortOptions.classList.contains('show');

  if (isOpen) {
    ui.customSortOptions.classList.remove('show');
    ui.customSortOptions.classList.add('hidden');
    ui.customSortTrigger.classList.remove('open');
  } else {
    ui.customSortOptions.classList.remove('hidden');   // IMPORTANT
    ui.customSortOptions.classList.add('show');
    ui.customSortTrigger.classList.add('open');
  }
});

  });

  // Option click
  ui.customSortOptions.querySelectorAll('.custom-option').forEach((option) => {
    option.addEventListener('click', (event) => {
      event.stopPropagation();

      ui.customSortOptions.querySelectorAll('.custom-option')
        .forEach((item) => item.classList.remove('selected'));

      option.classList.add('selected');
      ui.sortLabel.textContent = option.textContent;

      const nextSort = option.dataset.value || 'newest';
      sortProducts(nextSort);

      closeSortMenu();
    });
  });

  // Close when clicking outside (ONLY ONCE)
  document.addEventListener('click', (event) => {
    if (!ui.customSortTrigger.contains(event.target)) {
      closeSortMenu();
    }
  });
}


  async function fetchProducts() {
    if (window.PRODUCTS && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) {
      return window.PRODUCTS;
    }

    const projectId = window.SANITY_PROJECT_ID;
    if (!projectId) return [];
    const dataset = window.SANITY_DATASET || 'production';

    const query = `
      *[_type == "product"] | order(_updatedAt desc) {
        title,
        description,
        price,
        category,
        link,
        altText,
        "imageUrl": image.asset->url,
        "mobileImageUrl": mobileImage.asset->url,
        "slug": slug.current,
        _createdAt,
        _updatedAt
      }
    `;

    const endpoint = `https://${projectId}.api.sanity.io/v2024-11-08/data/query/${dataset}?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) return [];
      const payload = await response.json();
      return payload.result || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  function wireEvents() {
    ui.menuBtn?.addEventListener('click', openSidebar);
    ui.closeSidebar?.addEventListener('click', hideSidebar);
    ui.overlay?.addEventListener('click', hideSidebar);

    ui.searchBtn?.addEventListener('click', () => {
      const mode = ui.searchBtn.dataset.mode || 'search';
      if (mode === 'clear' && ui.searchInput) {
        ui.searchInput.value = '';
        updateSearchButtonMode();
        resetToDefaultView({ clearInput: false });
        ui.searchInput.focus();
        return;
      }

      doSearch(ui.searchInput?.value || '', 1);
    });

    if (ui.searchInput) {
      ui.searchInput.addEventListener('focus', () => {
        stopPlaceholderAnimation();
        ui.searchInput.setAttribute('placeholder', 'Search products...');
        renderDropdown(ui.searchInput.value);
      });

      ui.searchInput.addEventListener('click', (event) => {
        event.stopPropagation();
        renderDropdown(ui.searchInput.value);
      });

      ui.searchInput.addEventListener('input', () => {
        updateSearchButtonMode();
      });

      ui.searchInput.addEventListener('input', debounce((event) => {
        const value = event.target.value || '';
        renderDropdown(value);

        if (!value.trim() && state.activeFilters.size === 0) {
          resetToDefaultView({ clearInput: false });
        }
      }, 140));

      ui.searchInput.addEventListener('keydown', (event) => {
        const rows = ui.searchDropdown?.querySelectorAll('.row') || [];

        if (event.key === 'Enter') {
          event.preventDefault();
          if (rows.length && state.searchSelectedIndex >= 0) {
            const selectedRow = rows[state.searchSelectedIndex];
            const selectedValue = selectedRow?.dataset.value || '';
            ui.searchInput.value = selectedValue;
            updateSearchButtonMode();
            hideDropdown();
            doSearch(selectedValue, 1);
            return;
          }
          doSearch(ui.searchInput.value, 1);
          return;
        }

        if (!rows.length) return;

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          state.searchSelectedIndex = (state.searchSelectedIndex + 1) % rows.length;
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          state.searchSelectedIndex = (state.searchSelectedIndex - 1 + rows.length) % rows.length;
        } else if (event.key === 'Escape') {
          hideDropdown();
          return;
        } else {
          return;
        }

        rows.forEach((row, index) => {
          row.classList.toggle('hover', index === state.searchSelectedIndex);
        });
      });
    }

    ui.searchDropdown?.addEventListener('pointerdown', (event) => {
      event.preventDefault();
    });
    ui.searchDropdown?.addEventListener('click', handleDropdownClick);

    const delegatedTargets = [ui.grid, ui.searchResults, ui.gallery];
    delegatedTargets.forEach((target) => {
      target?.addEventListener('click', handleCardActionClick);
    });

    ui.prevBtn?.addEventListener('click', () => {
      moveGallery(-1);
      safeTrack('gallery_navigation', { direction: 'left' });
    });

    ui.nextBtn?.addEventListener('click', () => {
      moveGallery(1);
      safeTrack('gallery_navigation', { direction: 'right' });
    });

    ui.gallery?.addEventListener('mouseenter', stopGalleryAutoplay);
    ui.gallery?.addEventListener('mouseleave', startGalleryAutoplay);

    document.addEventListener('keydown', (event) => {
      if (!isHomePage || document.activeElement === ui.searchInput) return;
      if (event.key === 'ArrowLeft') moveGallery(-1);
      if (event.key === 'ArrowRight') moveGallery(1);
    });

    document.addEventListener('click', (event) => {
      if (ui.searchWrap && !ui.searchWrap.contains(event.target)) {
        hideDropdown();
        if (isHomePage && ui.searchInput && ui.searchInput.value.trim() === '') {
          startPlaceholderAnimation();
        }
      }

      if (ui.sidebar?.classList.contains('show')) {
        const clickedSidebar = ui.sidebar.contains(event.target);
        const clickedToggle = ui.menuBtn?.contains(event.target);
        if (!clickedSidebar && !clickedToggle) hideSidebar();
      }

      if (ui.customSortOptions && ui.customSortTrigger) {
        const clickedSort = ui.customSortOptions.contains(event.target);
        const clickedTrigger = ui.customSortTrigger.contains(event.target);
        if (!clickedSort && !clickedTrigger) {
          closeSortMenu();
        }
      }
    });

    document.addEventListener('click', (event) => {
      const buyLink = event.target.closest('a.buy');
      if (!buyLink) return;

      const card = buyLink.closest('article');
      const productTitle = card?.querySelector('h2, h3')?.textContent?.trim() || 'Unknown Product';
      safeTrack('affiliate_click', {
        event_category: 'Outbound',
        product_name: productTitle,
      });
    });

    document.addEventListener('click', (event) => {
      const chatLink = event.target.closest('a.chat-link[href*="#"]');
      if (!chatLink) return;

      let url;
      try {
        url = new URL(chatLink.href, window.location.href);
      } catch (error) {
        return;
      }

      if (url.pathname !== window.location.pathname) return;

      const targetId = decodeURIComponent(url.hash.replace('#', ''));
      if (!targetId) return;
      const targetCard = document.getElementById(targetId);
      if (!targetCard) return;

      event.preventDefault();
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightCard(targetCard);
    });

    window.addEventListener('resize', updateSearchFooterVisibility);
    window.addEventListener('scroll', updateSearchFooterVisibility, { passive: true });
  }

  async function initData() {
    try {
      state.allProducts = await fetchProducts();
      window.CLASSIT_PRODUCTS = state.allProducts;

      if (isCategoryPage) {
        state.categoryItems = shuffleArray(
          state.allProducts.filter((product) => normalizeCategory(product.category) === currentCategory),
        );

        const hash = decodeURIComponent(window.location.hash.replace('#', ''));
        if (hash) {
          const priorityIndex = state.categoryItems.findIndex((item) => createId(item.title) === hash);
          if (priorityIndex > 0) {
            const [priorityItem] = state.categoryItems.splice(priorityIndex, 1);
            state.categoryItems.unshift(priorityItem);
          }
        }

        renderCategoryGrid(1);

        if (hash) {
          requestAnimationFrame(() => {
            const targetCard = document.getElementById(hash);
            if (!targetCard) return;
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightCard(targetCard);
          });
        }
      }

      if (isHomePage) {
        initGallery();
        startPlaceholderAnimation();
      }
    } catch (error) {
      console.error('Error initializing page:', error);
      ui.grid?.classList.add('hidden');
      ui.paginationContainer?.classList.add('hidden');
      ui.errorMessage?.classList.remove('hidden');
    }
  }

  wireEvents();
  renderBreadcrumbs();
  setupCustomSort();
  setupHomeSearchFooterObserver();
  highlightSidebarLink();
  updateSearchButtonMode();
  await initData();
  updateSearchFooterVisibility();
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggleInput');
  const initialTheme = localStorage.getItem('theme')
    || document.documentElement.getAttribute('data-theme')
    || 'light';

  applyTheme(initialTheme, themeToggle, false);

  if (!themeToggle) return;
  themeToggle.addEventListener('change', () => {
    applyTheme(themeToggle.checked ? 'dark' : 'light', themeToggle, true);
  });
});
