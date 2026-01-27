import './chatbot.js';

// Helper: Turns "Wipro Smart Bulb" into "wipro-smart-bulb"
function createId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace weird chars with hyphens
    .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens
}


// function setFavicon(theme) {
//   // Remove existing favicon
//   const oldFavicon = document.getElementById('dynamic-favicon');
//   if (oldFavicon) {
//     oldFavicon.remove();
//   }

//   // Create a new favicon element
//   const link = document.createElement('link');
//   link.id = 'dynamic-favicon';
//   link.rel = 'icon';
//   link.type = 'image/png';

//   // Cache-busting query
//   const version = Date.now();

//   link.href =
//     theme === 'dark'
//       ? `/favicon-dark-sq-v2.png?v=${version}`
//       : `/favicon-gold-sq-v2.png?v=${version}`;

//   document.head.appendChild(link);
// }
/* REPLACE THE OLD setFavicon FUNCTION WITH THIS CLEAN VERSION */
function setFavicon(theme) {
  const favicon = document.getElementById('dynamic-favicon');
  if (!favicon) return;
  // Just swap the href. Do not remove/create elements.
  favicon.href = theme === 'dark' 
      ? '/favicon-dark-sq-v2.png' 
      : '/favicon-gold-sq-v2.png';
}


document.addEventListener('DOMContentLoaded', async () => {
// ---------- 0. STYLE INJECTION (Homepage & Category Split) ----------
    const style = document.createElement('style');
    style.textContent = `
        /* 1. Universal card layout (Applies to BOTH) */
        .product-card, .js-card-fix {
            display: flex !important;
            flex-direction: column !important;
            padding: 15px; 
            box-sizing: border-box;
            /* FIX: Add top margin to gallery cards */
            margin-top: 40px; 
        }

        /* --- CATEGORY CARD HEIGHT --- */
        .product-card {
            height: 400px; /* FIXED: Locked card size and increased height */
        }
        /* --- HOMEPAGE CARD HEIGHT --- */
        .js-card-fix {
             /* No min-height! Content will define height. */
        }


        /* 2. --- IMAGE FIX FOR CATEGORY PAGES --- */
        .product-card .card-image-container {
            width: 100%;
            height: 180px; 
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0; /* CRITICAL: Prevents shrinking */
            border-radius: 8px; 
            background-color: transparent; 
        }
        .product-card .card-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover; 
            display: block;
        }

        /* 3. --- IMAGE STYLE FOR HOMEPAGE GALLERY --- */
        .js-card-fix .card-image-container {
            width: 100%;
            height: 150px; /* Kept small image */
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 8px;
            background-color: transparent; 
        }
        .js-card-fix .card-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover; 
            display: block;
        }

        /* 4. --- FOOTER LAYOUT (SPLIT) --- */
        
        /* Homepage Footer (Works) */
        .js-card-fix .product-card-footer {
            margin-top: auto; 
            padding-top: 15px; 
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0; /* CRITICAL */
        }

        /* Category Page Footer (FIXED) */
        .product-card .product-card-footer {
            margin-top: auto; /* FIXED: Re-added margin-top: auto */
            padding-top: 15px; 
            display: grid;
            grid-template-columns: 1fr auto 1fr; /* 3 columns: left, center, right */
            align-items: center;
            width: 100%;
            flex-shrink: 0; /* CRITICAL: Prevents shrinking */
        }

        /* 5. --- SHARE BUTTON (SPLIT) --- */
        
        /* Homepage Share Button (Works) */
        .js-card-fix .share-btn {
            background: none; border: none; padding: 5px; margin: 0;
            cursor: pointer; border-radius: 50%; display: inline-flex;
            color: var(--text-color, #555); opacity: 0.6;
            transition: opacity 0.2s, background-color 0.2s;
            flex-shrink: 0; 
        }
        .js-card-fix .share-btn svg {
            width: 22px; height: 22px; fill: currentColor;
        }

        /* Category Page Share Button (FIXED) */
        .product-card .share-btn {
            grid-column: 1 / 2; /* Place in left column */
            justify-self: start; /* Align to the left */
            align-self: center; /* FIXED: Aligned to center */
            position: relative;
            left: -7px; /* Nudges the button 5px to the left */
            /* top: 10px; (REMOVED) */
            
            background: none; border: none; padding: 5px; margin: 0;
            cursor: pointer; border-radius: 50%; display: inline-flex;
            color: var(--text-color, #555); opacity: 0.6;
            transition: opacity 0.2s, background-color 0.2s;
        }
        .product-card .share-btn svg {
            width: 18px; /* Smaller icon */
            height: 18px; /* Smaller icon */
            fill: currentColor;
        }

        .share-btn:hover { /* Universal hover */
            opacity: 1;
            background-color: var(--hover-bg, rgba(0,0,0,0.05));
        }

        /* 6. Description Truncation (MODIFIED) */
        
       /* Category page description (FIXED VISUALS) */
        .product-card > p {
            flex-grow: 0; 
            flex-shrink: 0; 
            overflow: hidden; 
            line-height: 1.4em;
            
            /* CHANGE 1: Increase height slightly so letters aren't cut */
            max-height: 4.5em; 
            
            /* CHANGE 2: Add these 3 lines to force "..." at the end */
            display: -webkit-box;
            -webkit-line-clamp: 3; 
            -webkit-box-orient: vertical;

            margin-bottom: 0; 
            margin-top: 10px;
            transition: max-height 0.3s ease-out;
            scrollbar-width: none;
            scrollbar-color: #8B4513 var(--card-bg, #f0e6dd);
        }

        /* Homepage description (Unchanged) */
        .js-card-fix > p {
            flex-grow: 0; flex-shrink: 0; 
            overflow: hidden; display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4; /* 4 lines */
            line-height: 1.3em; 
            max-height: 5.2em; /* 1.3 * 4 */
            margin-bottom: 0;
            margin-top: 0.5em; /* Kept 0.5em margin */
        }

        /* 7. Title truncation (MODIFIED) */
        .product-card > h3 {
            flex-grow: 0; flex-shrink: 0; /* CRITICAL */
            overflow: hidden; display: -webkit-box;
            -webkit-box-orient: vertical; -webkit-line-clamp: 3;
            line-height: 1.3em; max-height: 3.9em;
        }
        .js-card-fix > h3 {
            flex-grow: 0; flex-shrink: 0; /* CRITICAL */
            overflow: hidden; display: -webkit-box;
            -webkit-box-orient: vertical; -webkit-line-clamp: 2; /* 2 lines */
            line-height: 1.25em; 
            max-height: 2.5em; /* 1.25 * 2 */
            margin-top: 10px;
            margin-bottom: 0;
        }

        /* 8. --- BUY BUTTON (SPLIT) --- */
        
        /* Homepage Buy Button (Works) */
        .js-card-fix .product-card-footer .buy {
            flex-shrink: 0; 
        }

        /* Category Page Buy Button (FIXED) */
        .product-card .product-card-footer .buy {
            grid-column: 2 / 3; /* Place in center column */
            justify-self: center; /* Align to the center */
        }

        /* 9. --- "Show More" Button Style --- */
        .show-more-btn {
            background: none;
            border: none;
            padding: 2px 0 0 0; /* Tighter padding */
            margin: 0;
            font-size: 0.85em;
            font-weight: 600;
            color: var(--brand-color, #8B4513); /* Use a theme color */
            cursor: pointer;
            align-self: flex-start; /* Aligns to the left */
            flex-shrink: 0; /* CRITICAL */
        }
        .show-more-btn:hover {
            text-decoration: underline;
        }

        /* 10. --- MODIFIED: Expanded Card State --- */
        .product-card.is-expanded > p {
            max-height: 7em; /* FIXED: 1.4em * 5 lines */
            overflow-y: auto; /* FIXED: Add scrollbar */
            scrollbar-width: thin; /* For Firefox */
            transition: max-height 0.3s ease-in;
        }

        /* 11. --- NEW: Small Scrollbar Styling --- */
        .product-card > p::-webkit-scrollbar {
            width: 5px; /* Small scrollbar */
        }
        .product-card > p::-webkit-scrollbar-track {
            background: var(--card-bg, #f0e6dd); /* Track matches card */
        }
        .product-card > p::-webkit-scrollbar-thumb {
            background-color: var(--brand-color, #8B4513); /* Scrollbar color */
            border-radius: 4px;
        }

        /* --- LOGO SIZING FIX --- */
        .site-logo {
            display: flex;
            align-items: center;
        }

        .site-logo img {
            /* DESKTOP: Make it nice and big */
            height: 63px !important; 
            width: auto;
            
            /* SAFETY: Never let it be taller than the navigation bar itself */
            max-height: 80%; 
            object-fit: contain;
        }

            /* MOBILE: Slightly smaller to fit the tighter top bar */
        @media (max-width: 768px) {
            .site-logo img {
                height: 35px !important; /* Increase this if you have space */
            }
        }
    `;
    document.head.appendChild(style);

    // ---------- 1. ELEMENT SELECTORS (Unified) ----------
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchDropdown = document.getElementById('searchDropdown');
    const searchResults = document.getElementById("searchResults");
    const searchPagination = document.getElementById("searchPagination");
    const grid = document.getElementById("productGrid");
    const paginationContainer = document.getElementById("defaultPagination");
    const gallery = document.getElementById("gallery");
    const gallerySection = document.querySelector('.gallery-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const errorMessage = document.getElementById('error-message');

    // ---------- 2. CONFIG & STATE (Unified) ----------
    const ITEMS_PER_PAGE_CATEGORY = 15;
    const ITEMS_PER_PAGE_SEARCH = 10;
    const isHomePage = document.body.dataset.home === "true";
    const isCategoryPage = !!grid;
    const currentCategory = isCategoryPage ? grid.dataset.category : null;
    let allProducts = [];
    let categoryItems = [];
    let searchSelectedIndex = -1;
    let animatedPlaceholderTimeout;
   


    // ---------- 3. HELPER FUNCTIONS (Unified) ----------
    const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const debounce = (fn, wait = 200) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    };

    const STORAGE_KEY = 'ClassIt_recent_searches_v1';
    const loadRecent = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
    const saveRecent = (arr) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 3))); } catch {} };

    // --- NEW: Share Function ---
    // --- NEW: Share Function (Simplified for Text/Link sharing) ---
    async function handleShareClick(title, description, link, imageUrl) {
        const shareUrl = link || window.location.href;
        const shareTitle = title || "Check out this product";
        const shareDescription = description || "I thought you might like this!";
        
        // This text is what will pre-fill the body of the message (e.g., in WhatsApp)
        const shareText = `${shareTitle}\n\n${shareDescription}`;

        const shareData = {
            title: shareTitle, // Used as email subject, etc.
            text: shareText,   // Pre-fills the message body
            url: shareUrl      // The link the app will create a preview for
        };

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // This catches if the user cancels the share
                console.log('Share canceled or failed:', error);
            }
        } else {
            // Fallback for desktop
            try {
                // Combine all info for the clipboard
                await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                alert('Share not supported on this device. Product info copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
                alert('Share not supported on this device.');
            }
        }
    }



    // ---------- 4. DATA FETCHING (From Sanity) ----------
    async function fetchProducts() {
        if (window.PRODUCTS && window.PRODUCTS.length > 0) return window.PRODUCTS;
        
        const projectId = window.SANITY_PROJECT_ID;
        if (!projectId) return [];
        const dataset = window.SANITY_DATASET || 'production';
        const groq = `*[_type == "product"]{ title, description, price, category, link, altText, "imageUrl": image.asset->url, "slug": slug.current }`;
        const url = `https://${projectId}.api.sanity.io/v2024-11-08/data/query/${dataset}?query=${encodeURIComponent(groq)}`;

        try {
            const res = await fetch(url);
            if (!res.ok) { console.warn('Sanity fetch not ok', res.status); return []; }
            const json = await res.json();
            return json.result || [];
        } catch (err) {
            console.error('Error fetching Sanity products', err);
            return [];
        }
    }

    // ---------- 5. SIDEBAR LOGIC ----------
    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('show');
        if (overlay) overlay.classList.remove('hidden');
    }
    function hideSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('show');
        if (overlay) overlay.classList.add('hidden');
    }

    // ---------- 6. RENDERING LOGIC (MODIFIED) ----------

    function renderCategoryGrid(page = 1) {
        if (!isCategoryPage) return;
        const start = (page - 1) * ITEMS_PER_PAGE_CATEGORY;
        const paginated = categoryItems.slice(start, start + ITEMS_PER_PAGE_CATEGORY);

        grid.innerHTML = paginated.map(p => {
            // --- FIX START: Changed limit from 100 to 60 ---
            const fullDesc = escapeHtml(p.description || "");
            const limit = 60; // <--- THIS IS THE KEY CHANGE
            
            const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
            const needsToggle = fullDesc.length > limit; 
            const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
            // --- FIX END ---

            return `
                <article class="product-card" id="${createId(p.title)}">
                <div class="card-image-container"><img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/></div>
                <h3>${escapeHtml(p.title)}</h3>
                
                <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                    ${shortDescWithEllipsis}
                </p>
                ${needsToggle ? `
                <button class="show-more-btn" data-more-text="...more" data-less-text="less">
                    ...more
                </button>
                ` : ''}
                <div class="product-card-footer">
                    <button class="share-btn" 
                            aria-label="Share ${escapeHtml(p.title)}"
                            data-title="${escapeHtml(p.title)}"
                            data-description="${escapeHtml(p.description)}"
                            data-link="${escapeHtml(p.link || '')}"
                            data-image="${escapeHtml(p.imageUrl || '')}"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                    </button>
                    <a href="${escapeHtml(p.link || '#')}" target="_blank" class="buy">Buy Now</a>
                </div>
                </article>
            `;
        }).join("");

        const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE_CATEGORY);
        renderPagination(paginationContainer, totalPages, page, renderCategoryGrid);
    }
    
    // Renders search results and their pagination
    function renderSearchResults(results, page = 1, query = '') {
        if (!searchResults) return;
        const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE_SEARCH);
        const start = (page - 1) * ITEMS_PER_PAGE_SEARCH;
        const paginated = results.slice(start, start + ITEMS_PER_PAGE_SEARCH);

        if (!paginated.length) {
            /* --- STEP 4: TRACKING --- */
            gtag('event', 'search_no_results', { 'keyword': query });

            searchResults.innerHTML = `<div class="no-results-wrapper"><p class="no-results-message"><span>No results found for </span><strong>"${escapeHtml(query)}"</strong></p></div>`;
            
            if (isHomePage && gallerySection) {
                const galleryClone = gallerySection.cloneNode(true);
                galleryClone.id = '';
                galleryClone.style.display = 'block';
                galleryClone.style.marginTop = '40px';
                searchResults.appendChild(galleryClone);
            }

            if (isCategoryPage) {
                const defaultItems = categoryItems.slice(0, ITEMS_PER_PAGE_CATEGORY);
                const defaultGridHTML = defaultItems.map(p => {
                    // --- FIX START: Changed limit to 60 ---
                    const fullDesc = escapeHtml(p.description || "");
                    const limit = 60; 
                    const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
                    const needsToggle = fullDesc.length > limit; 
                    const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
                    // --- FIX END ---

                    return `
                    <article class="product-card" id="${createId(p.title)}">
                        <div class="card-image-container"><img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/></div>
                        <h3>${escapeHtml(p.title)}</h3>
                        <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                            ${shortDescWithEllipsis}
                        </p>
                        ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
                        <div class="product-card-footer">
                            <button class="share-btn" aria-label="Share" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || '')}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </button>
                            <a href="${escapeHtml(p.link || '#')}" target="_blank" class="buy">Buy Now</a>
                        </div>
                    </article>
                    `;
                }).join('');
                
                const gridContainer = document.createElement('div');
                gridContainer.className = 'product-grid';
                gridContainer.style.marginTop = '40px';
                gridContainer.innerHTML = defaultGridHTML;
                searchResults.appendChild(gridContainer);
            }

        } else {
            const gridDiv = document.createElement('div');
            gridDiv.className = 'product-grid';
            gridDiv.innerHTML = paginated.map(p => {
                // --- FIX START: Changed limit to 60 ---
                const fullDesc = escapeHtml(p.description || "");
                const limit = 60; 
                const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
                const needsToggle = fullDesc.length > limit; 
                const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
                // --- FIX END ---

                return `
                <article class="product-card">
                    <div class="card-image-container"><img src="${escapeHtml(p.imageUrl || p.image)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/></div>
                    <h3>${escapeHtml(p.title)}</h3>
                    <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                        ${shortDescWithEllipsis}
                    </p>
                    ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
                    <div class="product-card-footer">
                        <button class="share-btn" aria-label="Share" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || p.image || '')}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </button>
                        <a href="${escapeHtml(p.link || '#')}" target="_blank" class="buy">Buy Now</a>
                    </div>
                </article>
                `;
            }).join('');
            searchResults.innerHTML = '';
            searchResults.appendChild(gridDiv);
        }

        searchResults.classList.remove('hidden');
        if (gallerySection) gallerySection.style.display = 'none';
        if (grid) grid.classList.add('hidden');
        if (paginationContainer) paginationContainer.classList.add('hidden');

        renderPagination(searchPagination, totalPages, page, (newPage) => doSearch(query, newPage));
    }
    // Generic pagination UI creator
  function renderPagination(container, totalPages, currentPage, clickHandler) {
    if (container) container.innerHTML = "";
    if (!container || totalPages <= 1) return;

    const createBtn = (label, targetPage, isDisabled, isActive) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "pagination-btn";
        
        // --- 1. MOBILE OPTIMIZATIONS ---
        // 'manipulation' tells mobile browsers: "Don't wait for double-tap, click instantly."
        btn.style.touchAction = "manipulation"; 
        btn.style.minWidth = "45px";  // Minimum touch target size
        btn.style.minHeight = "45px";
        btn.style.margin = "0 5px";

        // Visual State
        if (isActive) btn.classList.add("active");
        
        // --- 2. HARD DISABLE ---
        // If disabled, use pointer-events: none. This makes the button "ghost" to clicks.
        if (isDisabled) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.pointerEvents = "none"; 
        }

        // --- 3. CLICK HANDLER ---
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop the click from bubbling up

            // Double check safety
            if (isDisabled || isActive) return;

            // *** THE FIX: LOCK THE UI ***
            // Immediately disable ALL buttons in this container.
            // This prevents you from tapping "Next" twice rapidly.
            const allButtons = container.querySelectorAll("button");
            allButtons.forEach(b => {
                b.disabled = true;
                b.style.pointerEvents = "none";
            });

            // Scroll Logic
            const productSection = document.getElementById("searchResults") || document.getElementById("gallerySection");
            if (productSection) {
                const y = productSection.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Fire the actual page change
            // (The buttons will be re-created enabled when this function finishes)
            clickHandler(targetPage);
        };

        container.appendChild(btn);
    };

    // Render logic
    createBtn("‹", currentPage - 1, currentPage === 1, false);
    createBtn(currentPage, currentPage, false, true);
    createBtn("›", currentPage + 1, currentPage === totalPages, false);
}

   // ---------- 7. SEARCH LOGIC (SMART & FUZZY) ----------

    // --- 7a. NEW: Smart Search Helpers ---
    
    // 1. Normalize String: Removes special chars & spaces (e.g., "Power Bank" -> "powerbank")
    const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    // 2. Levenshtein Distance: Calculates how many "typos" away two words are
    const levenshtein = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // deletion
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // substitution
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    // 3. The "Brain": Decides if a product matches the query
    const isMatch = (query, text) => {
        if (!query || !text) return false;
        const q = normalize(query);
        const t = normalize(text);
        
        // Strict check: if the user typed "bank", matches "powerbank"
        if (t.includes(q)) return true;
        
        // Fuzzy check: Only runs if query is > 2 chars to prevent lag
        if (q.length > 2) {
            // Allow 1 typo for every 4 letters (e.g. "ipone" -> "iphone")
            const allowedErrors = Math.floor(q.length / 4) || 1; 
            // Optimization: Only check math if lengths are somewhat close
            if (Math.abs(q.length - t.length) < 4) { 
                 return levenshtein(q, t) <= allowedErrors;
            }
        }
        return false;
    };

    // --- 7b. Main Search Functions ---

    function resetToDefaultGrid() {
        if (searchResults) searchResults.classList.add('hidden');
        if (searchPagination) searchPagination.innerHTML = '';
        if (isHomePage && gallerySection) gallerySection.style.display = 'block';
        if (isCategoryPage && grid) grid.classList.remove('hidden');
        if (isCategoryPage && paginationContainer) paginationContainer.classList.remove('hidden');
    }

    function doSearch(q, page = 1) {
        const query = (q || '').trim();
        if (!query) {
            resetToDefaultGrid();
            return;
        }

        // Save to history (Standard Logic)
        const recents = loadRecent();
        // Only save if it's NOT already there (case insensitive)
        if (!recents.some(x => x.toLowerCase() === query.toLowerCase())) {
            recents.unshift(query);
            saveRecent(recents);
        }
        hideDropdown();

        let pool = isCategoryPage ? categoryItems : [...allProducts];
        
        // --- SMART FILTERING ---
        // Checks Title OR Description using the smart 'isMatch' logic
        const results = pool.filter(p => 
            isMatch(query, p.title) || 
            (p.description && isMatch(query, p.description))
        );
        
        renderSearchResults(results, page, query);
    }

    function hideDropdown() { if (searchDropdown) searchDropdown.classList.add('hidden'); searchSelectedIndex = -1; }
    
    function renderDropdown(filter = '') {
        if (!searchDropdown) return;
        
        // Always reset selection on new type
        searchSelectedIndex = -1;

        const query = filter.trim();
        let displayItems = [];

        // 1. Get History Matches (Always check these)
        // We use standard 'includes' for history to keep it snappy
        const historyMatches = loadRecent().filter(s => 
            s.toLowerCase().includes(query.toLowerCase())
        );

        // 2. Get Product Matches (Only if typing >= 3 letters)
        let productMatches = [];
        if (query.length >= 3) {
            productMatches = allProducts
                .filter(p => isMatch(query, p.title)) // Use smart match
                .map(p => p.title);
        }

        // 3. Merge: History First, Then Products
        // Use a Set to prevent duplicates (e.g. if "Wipro" is in history AND is a product)
        const seen = new Set();
        
        // Add History items
        historyMatches.forEach(item => {
            const key = item.toLowerCase();
            if(!seen.has(key)) {
                seen.add(key);
                displayItems.push({ text: item, type: 'history' });
            }
        });

        // Add Product items (only if not seen)
        productMatches.forEach(item => {
             const key = item.toLowerCase();
             if(!seen.has(key)) {
                seen.add(key);
                displayItems.push({ text: item, type: 'product' });
            }
        });

        // Limit to 6 suggestions total
        displayItems = displayItems.slice(0, 6);

        if (!displayItems.length) {
            hideDropdown();
            return;
        }

        // Render with smart icons
        searchDropdown.innerHTML = displayItems.map(item => `
            <div class="row" data-value="${escapeHtml(item.text)}">
                <span class="value" style="display: flex; justify-content: space-between; width: 100%;">
                    <span>${escapeHtml(item.text)}</span>
                    ${item.type === 'product' 
                        ? '<span style="font-size: 0.75em; opacity: 0.5; font-style: italic;">Product</span>' 
                        : ''}
                </span>
                
                ${item.type === 'history' 
                    ? `<button class="remove" data-remove="${escapeHtml(item.text)}" aria-label="Remove">✕</button>` 
                    : ''}
            </div>
        `).join('');

        searchDropdown.classList.remove('hidden');
    }

    // ---------- 8. HOME PAGE LOGIC (Gallery & Placeholder) ----------
    
    let galleryInitialized = false;


    function initGallery() {
    if (!isHomePage || !gallery) return;
    if (galleryInitialized) return;
    galleryInitialized = true;


   const normalizeCategory = (cat) => {
  if (!cat) return null;
  const c = cat.toLowerCase().trim();

  if (c.includes('fit')) return 'fitness';
  if (c.includes('livogue')) return 'livogue';
  if (c.includes('tech')) return 'tech';

  return c;
};

const categories = [...new Set(
  allProducts
    .map(p => normalizeCategory(p.category))
    .filter(Boolean)
)];


    const topPicks = categories.map(cat => {
       const pool = allProducts.filter(
  p => normalizeCategory(p.category) === cat
);

        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }).filter(Boolean);

    if (topPicks.length === 0) {
        if (gallery.parentElement) gallery.parentElement.style.display = "none";
        return;
    }

    let active = 0;
    gallery.innerHTML = ""; // 🔥 HARD RESET — prevents duplicate cards
    gallery.innerHTML = topPicks.map(p => `
    <article class="card js-card-fix" id="${createId(p.title)}">
            <div class="card-image-container">
    <img src="${escapeHtml(p.imageUrl || "https://placehold.co/300x220?text=Image")}" 
            alt="${escapeHtml(p.title)}"
            onerror="this.src='https://placehold.co/300x220?text=Image'">
</div>
            <h3>${escapeHtml(p.title)}</h3>

            <p>${escapeHtml(p.description || "")}</p>
            <div class="product-card-footer">
                <button class="share-btn" 
                        aria-label="Share ${escapeHtml(p.title)}"
                        data-title="${escapeHtml(p.title)}"
                        data-description="${escapeHtml(p.description)}"
                        data-link="${escapeHtml(p.link || '')}"
                        data-image="${escapeHtml(p.imageUrl || '')}"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                </button>
                <a href="${escapeHtml(p.link || "#")}" target="_blank" class="buy">Buy Now</a>
            </div>
            </article>
    `).join("");

    const cards = Array.from(gallery.querySelectorAll(".card"));
    let autoplayTimer;

    function updateGallery() {
        cards.forEach((card, i) => {
            card.classList.remove("center", "left", "right", "hidden");
            if (i === active) card.classList.add("center");
            else if (i === (active - 1 + cards.length) % cards.length) card.classList.add("left");
            else if (i === (active + 1) % cards.length) card.classList.add("right");
            else card.classList.add("hidden");
        });
    }

    const next = () => { active = (active + 1) % cards.length; updateGallery(); };
    const prev = () => { active = (active - 1 + cards.length) % cards.length; updateGallery(); };

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    function startAutoplay() { stopAutoplay(); autoplayTimer = setInterval(next, 4200); }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }

    gallery.addEventListener("mouseenter", stopAutoplay);
    gallery.addEventListener("mouseleave", startAutoplay);

    document.addEventListener("keydown", e => {
        if (document.activeElement === searchInput) return;
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    });

    if (gallerySection) gallerySection.classList.remove("is-loading");
    updateGallery();
    startAutoplay();
    }

    // --- NEW FUNCTION: ANIMATED PLACEHOLDER ---
    function initAnimatedPlaceholder() {
        // Ensure we are on the homepage and have products to show
        if (!isHomePage || !allProducts || allProducts.length === 0) {
            if (searchInput) searchInput.setAttribute("placeholder", "Search products...");
            return;
        }

        // Shuffle the products and get a list of titles
        const productNames = shuffleArray([...allProducts].map(p => p.title).filter(Boolean));
        if (productNames.length === 0) return;

        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const pauseDuration = 1500;

        function loop() {
            clearTimeout(animatedPlaceholderTimeout);
            
            const currentWord = productNames[index];
            let displayText;

            if (isDeleting) {
                charIndex--;
                displayText = currentWord.substring(0, charIndex);
            } else {
                charIndex++;
                displayText = currentWord.substring(0, charIndex);
            }
            
            if(searchInput) searchInput.setAttribute("placeholder", `Search ${displayText}...`);

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                animatedPlaceholderTimeout = setTimeout(loop, pauseDuration);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % productNames.length;
                animatedPlaceholderTimeout = setTimeout(loop, 500);
            } else {
                const speed = isDeleting ? deletingSpeed : typingSpeed;
                animatedPlaceholderTimeout = setTimeout(loop, speed);
            }
        }
        loop(); // Start the animation
    }

    // ---------- 9. EVENT LISTENERS & INITIALIZATION (MODIFIED) ----------
    async function init() {
        // --- Global Event Listeners ---
        menuBtn?.addEventListener('click', openSidebar);
        closeSidebar?.addEventListener('click', hideSidebar);
        overlay?.addEventListener('click', hideSidebar);
        searchBtn?.addEventListener('click', () => doSearch(searchInput.value, 1));

        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                // Fixed typo Tomeout -> Timeout
                clearTimeout(animatedPlaceholderTimeout); 
                searchInput.setAttribute("placeholder", "Search products...");
                renderDropdown(searchInput.value);
            });
            searchInput.addEventListener('blur', () => {
                setTimeout(hideDropdown, 150);
                if (searchInput.value === "" && isHomePage) initAnimatedPlaceholder();
            });
            searchInput.addEventListener('input', debounce((e) => {
                renderDropdown(e.target.value || '');
                if (!e.target.value.trim()) resetToDefaultGrid();
            }, 120));
            searchInput.addEventListener('keydown', (e) => {
    const rows = searchDropdown?.querySelectorAll('.row');
    if (!rows || !rows.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchSelectedIndex = (searchSelectedIndex + 1) % rows.length;
    }

    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchSelectedIndex =
            (searchSelectedIndex - 1 + rows.length) % rows.length;
    }

    else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchSelectedIndex >= 0) {
            const value = rows[searchSelectedIndex].dataset.value;
            searchInput.value = value;
            hideDropdown();
            doSearch(value, 1);
        } else {
            doSearch(searchInput.value, 1);
        }
        return;
    }

    else if (e.key === 'Escape') {
        hideDropdown();
        return;
    }

    // Update visual active state
    rows.forEach((row, i) => {
    row.classList.toggle('hover', i === searchSelectedIndex);
});

});

// ✅ DROPDOWN CLICK HANDLER (ROW CLICK + ❌ DELETE)
if (searchDropdown) {
    searchDropdown.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();

        const removeBtn = ev.target.closest('button.remove');
        const row = ev.target.closest('.row');

        /* 🔴 DELETE SEARCH ITEM */
        if (removeBtn) {
            ev.stopImmediatePropagation();

            const value = removeBtn.dataset.remove;
            if (!value) return;

            const updated = loadRecent().filter(x => x !== value);
            saveRecent(updated);
            renderDropdown(searchInput?.value || '');
            return;
        }

        /* ✅ SELECT SEARCH ITEM */
        if (row) {
            const val = row.dataset.value;
            if (!val) return;

            if (searchInput) searchInput.value = val;
            hideDropdown();
            doSearch(val, 1);
        }
    });
}



        }

        // --- MODIFIED: Event delegation for share and "show more" buttons ---
        const handleGridClick = (e) => {
            const shareButton = e.target.closest('.share-btn');
            const showMoreButton = e.target.closest('.show-more-btn');

            if (shareButton) {
    e.preventDefault(); 

    // 1. Get data, BUT ignore the 'link' from dataset (which is Amazon)
    const { title, description, image } = shareButton.dataset;

    // 2. Generate the "Deep Link" to your site
    // This creates: https://classit.co.in/tech.html#wipro-smart-bulb
    const productId = createId(title);
    const deepLink = `${window.location.origin}${window.location.pathname}#${productId}`;

    // 3. Call the share handler with YOUR site link
    handleShareClick(title, description, deepLink, image);

                } else if (showMoreButton) {
                e.preventDefault();
                const card = showMoreButton.closest('.product-card');
                if (!card) return; // Make sure we are on a category card
                const p = card.querySelector('p');
                
                // Toggle the state
                const isExpanded = card.classList.toggle('is-expanded');

                if (isExpanded) {
                    // Expand: Show full text and "show less"
                    p.innerHTML = p.dataset.fullText;
                    showMoreButton.innerHTML = showMoreButton.dataset.lessText;
                } else {
                    // Collapse: Show short text and "show more"
                    p.innerHTML = p.dataset.shortText;
                    showMoreButton.innerHTML = showMoreButton.dataset.moreText;
                }
            }
        };

        // Add a single listener to each container
        if (grid) grid.addEventListener('click', handleGridClick);
        if (searchResults) searchResults.addEventListener('click', handleGridClick);
        if (gallery) gallery.addEventListener('click', handleGridClick); // This listener is fine, it won't find .show-more-btn

        // --- Data-dependent Initialization ---
        try {
            allProducts = await fetchProducts();

           if (isCategoryPage) {
                const allItems = allProducts.filter((p) => (p.category || '').toLowerCase() === (currentCategory || '').toLowerCase());
                categoryItems = shuffleArray(allItems);

                // --- START: DEEP LINK "VIP" LOGIC ---
                // If the URL has a #hash (like #wipro-bulb), find that product!
                const hash = window.location.hash.substring(1); 
                
                if (hash) {
                    // 1. Find where the product ended up after shuffling
                    const vipIndex = categoryItems.findIndex(p => createId(p.title) === hash);
                    
                    if (vipIndex > -1) {
                        // 2. Remove it from its random spot
                        const [vipProduct] = categoryItems.splice(vipIndex, 1);
                        
                        // 3. Force it to be the VERY FIRST item (Index 0)
                        categoryItems.unshift(vipProduct);
                        
                        // 4. Add a visual highlight and smooth scroll after rendering
                        setTimeout(() => {
                            const targetCard = document.getElementById(hash);
                            if (targetCard) {
                                // Scroll it to the CENTER of the screen (fixes the header issue)
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                
                                // Optional: Flash a border so they know which one it is
                                targetCard.style.transition = "box-shadow 0.5s";
                                targetCard.style.boxShadow = "0 0 0 4px #eab308"; // Yellow highlight
                                setTimeout(() => { targetCard.style.boxShadow = "none"; }, 2000);
                            }
                        }, 500); // Wait 0.5s for the DOM to be ready
                    }
                }
                // --- END: DEEP LINK LOGIC ---

                renderCategoryGrid(1);
            }
            if (isHomePage) {
                initGallery();
                initAnimatedPlaceholder();
            }
        } catch (error) {
            console.error("Error initializing page:", error);
            if (grid) grid.style.display = 'none';
            if (paginationContainer) paginationContainer.style.display = 'none';
            if (errorMessage) errorMessage.classList.remove('hidden');
        }
    }

    init(); // Run the application
});

document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');

    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPage) {
            link.classList.add('active');
        }
    });

    document.addEventListener('click', (event) => {
        if (!sidebar || !menuBtn) return;
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnOpenButton = menuBtn.contains(event.target);

        if (sidebar.classList.contains('show') && !isClickInsideSidebar && !isClickOnOpenButton) {
            sidebar.classList.remove('show');
        }
    });
});



/* =========================================
   THEME SWITCHER LOGIC (Correct HREF Swap)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggleInput');
    const currentTheme = localStorage.getItem('theme') || 'light';

   // Helper Function to Apply Theme
    const applyTheme = (theme) => {
        // 1. Set CSS Variable
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // 2. Update Toggle Switch Visuals
        if (themeToggle) themeToggle.checked = (theme === 'dark');
        
        // 3. SWAP FAVICON SOURCE
        const favicon = document.getElementById('dynamic-favicon');
        if (favicon) {
            favicon.href = theme === 'dark' 
                ? '/favicon-dark-sq-v2.png' 
                : '/favicon-gold-sq-v2.png';
        }

        /* --- CORRECTED TRACKING LINE --- */
        // We use 'theme' directly because it was passed into the function
        gtag('event', 'theme_toggle', { 'theme_selected': theme });
    };

    // Apply on initial load
    applyTheme(currentTheme);

    // Listen for toggle clicks
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
});
// Listen for any click on a "Buy Now" button
document.addEventListener('click', function(e) {
  if (e.target && (e.target.innerText === 'Buy Now' || e.target.closest('.buy-now-btn'))) {
    const productCard = e.target.closest('article');
    const productName = productCard ? productCard.querySelector('h2, h3').innerText : 'Unknown Product';
    
    gtag('event', 'affiliate_click', {
      'event_category': 'Outbound',
      'product_name': productName
    });
  }
});
// Track Left Arrow clicks
document.getElementById('prevBtn')?.addEventListener('click', () => {
  gtag('event', 'gallery_navigation', { 'direction': 'left' });
});

// Track Right Arrow clicks
document.getElementById('nextBtn')?.addEventListener('click', () => {
  gtag('event', 'gallery_navigation', { 'direction': 'right' });
});