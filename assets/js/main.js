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
    
    
    /* 1 --- IMAGE FIX FOR CATEGORY PAGES --- */
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

            /*2. Universal card layout (Applies to BOTH) */
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
           /* --- HOMEPAGE CARD HEIGHT (Mobile vs Laptop) --- */
            .js-card-fix {
                 /* MOBILE: Let content decide height (Compact) */
                 height: auto; 
                 min-height: 300px;
            }
        
            /* LAPTOP: Force cards to be tall and uniform */
            @media (min-width: 768px) {
                .js-card-fix {
                    height: 480px !important; 
                }
            }

            

        /* 3. --- IMAGE STYLE FOR HOMEPAGE GALLERY (Mobile vs Laptop) --- */
        
        /* MOBILE (Default): Smaller, Compact Image */
        .js-card-fix .card-image-container {
            width: 181px;
            height: 180px; /* Standard Mobile Height */
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 8px;
            background-color: transparent; 
        }

        /* LAPTOP (Override): Bigger, Taller Image */
        @media (min-width: 768px) {
            .js-card-fix .card-image-container {
                height: 220px !important; /* Increased to 220px for Laptop */
                width: 240px !important;  /* <--- ADD THIS (Adjust 280px to preference) */
            }
                /* ADD THIS block to make sure the card background grows with the image */
    .js-card-fix {
        width: 280px !important; /* <--- Match this number with the one above */
    }
        }

        /* SHARED IMAGE FIT */
        .js-card-fix .card-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover; 
            display: block;
        }

/* LAPTOP ONLY: Adds space between Text and Cards */
@media only screen and (min-width: 769px) {
    div:has(> .js-card-fix) {
        padding-top: 60px !important; /* Only happens on big screens */
    }
}

@media only screen and (max-width: 768px) {
    
    /* 1. Target ONLY the Homepage Top Picks Container */
    .js-card-fix .card-image-container {
        width: 100%;       /* Full width */
        height: 180px;     /* INCREASED HEIGHT: This is the key! */
        background: #fff;  /* White background looks cleaner than gray */
    }

    /* 2. Target the Image inside it */
    .js-card-fix .card-image-container img {
        width: 100%;
        height: 100%;
     /* object-fit: contain !important;*//*Keep the full image visible */ 
      
    }
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
                height: 75px !important; /* Increase this if you have space */
            }
        }

        /* --- MOBILE DARK MODE TOP BAR FIX --- */
        @media (max-width: 768px) {
            [data-theme="dark"] .topbar {
                height: 60px !important;     /* Force it smaller (Standard is usually 60px) */
                min-height: 50px !important; /* Override any minimums */
                padding-top: 0 !important;   /* Remove extra padding */
                padding-bottom: 0 !important;
            }
            
            /* Optional: Adjust logo slightly if the bar gets too tight */
            [data-theme="dark"] .site-logo img {
                height: 75px !important; 
            }
        }
      
/* --- STICKY FOOTER FIX (FORCE BOTTOM) --- */
    html, body {
        height: 100%;
        margin: 0;
    }
    body {
        display: flex !important;
        flex-direction: column !important;
        min-height: 100vh !important;
    }
    main.main {
        /* This is the magic line: "1" means GROW to fill space */
        flex: 1 0 auto !important; 
        width: 100% !important;
        display: block !important;
    }
    footer {
        flex-shrink: 0 !important;
        margin-top: auto !important; /* Push to bottom */
        width: 100% !important;
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
        
        // UPDATED GROQ: Added _createdAt and default order
        const groq = `*[_type == "product"] | order(_createdAt desc) { 
            title, 
            description, 
            price, 
            category, 
            link, 
            altText, 
            "imageUrl": image.asset->url, 
            "mobileImageUrl": mobileImage.asset->url, 
            "slug": slug.current,
            _createdAt
        }`;
        
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
    // Overlay: use inline styles so no CSS (e.g. .hidden !important) can block the dim
    function getOverlay() {
        let el = document.getElementById('overlay');
        if (!el) {
            el = document.createElement('div');
            el.id = 'overlay';
            el.className = 'overlay hidden';
            el.setAttribute('aria-hidden', 'true');
            document.body.appendChild(el);
            el.addEventListener('click', hideSidebar);
        }
        return el;
    }
    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('show');
        const ov = getOverlay();
        ov.classList.remove('hidden');
        ov.classList.add('show');
        ov.style.display = 'block';
        ov.style.opacity = '1';
        ov.style.pointerEvents = 'auto';
        ov.style.background = 'rgba(0,0,0,0.5)';
        ov.setAttribute('aria-hidden', 'false');
    }
    function hideSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('show');
        const ov = document.getElementById('overlay');
        if (ov) {
            ov.classList.remove('show');
            ov.classList.add('hidden');
            ov.style.display = '';
            ov.style.opacity = '';
            ov.style.pointerEvents = '';
            ov.style.background = '';
            ov.setAttribute('aria-hidden', 'true');
        }
    }

//     // ---------- 6. RENDERING LOGIC (MODIFIED) ----------

//     function renderCategoryGrid(page = 1) {
//         if (!isCategoryPage) return;
//         const start = (page - 1) * ITEMS_PER_PAGE_CATEGORY;
//         const paginated = categoryItems.slice(start, start + ITEMS_PER_PAGE_CATEGORY);

//         grid.innerHTML = paginated.map(p => {
//             // --- FIX START: Changed limit from 100 to 60 ---
//             const fullDesc = escapeHtml(p.description || "");
//             const limit = 60; // <--- THIS IS THE KEY CHANGE
            
//             const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
//             const needsToggle = fullDesc.length > limit; 
//             const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
//             // --- FIX END ---

//             return `
//                 <article class="product-card" id="${createId(p.title)}">
//                <div class="card-image-container">
//                     <picture style="display: contents;">
//                         <source media="(max-width: 768px)" srcset="${escapeHtml(p.mobileImageUrl || p.imageUrl)}">
//                         <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/>
//                     </picture>
//                 </div>
//                 <h3>${escapeHtml(p.title)}</h3>
                
//                 <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
//                     ${shortDescWithEllipsis}
//                 </p>
//                 ${needsToggle ? `
//                 <button class="show-more-btn" data-more-text="...more" data-less-text="less">
//                     ...more
//                 </button>
//                 ` : ''}
//                 <div class="product-card-footer">
//                     <button class="share-btn" 
//                             aria-label="Share ${escapeHtml(p.title)}"
//                             data-title="${escapeHtml(p.title)}"
//                             data-description="${escapeHtml(p.description)}"
//                             data-link="${escapeHtml(p.link || '')}"
//                             data-image="${escapeHtml(p.imageUrl || '')}"
//                         >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
//                     </button>
//                     <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
//                 </div>
//                 </article>
//             `;
//         }).join("");

//         const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE_CATEGORY);
//         renderPagination(paginationContainer, totalPages, page, renderCategoryGrid);
//     }
    
//     // Renders search results and their pagination
//     function renderSearchResults(results, page = 1, query = '') {
//         if (!searchResults) return;
//         const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE_SEARCH);
//         const start = (page - 1) * ITEMS_PER_PAGE_SEARCH;
//         const paginated = results.slice(start, start + ITEMS_PER_PAGE_SEARCH);

//         if (!paginated.length) {
//             /* --- STEP 4: TRACKING --- */
//             gtag('event', 'search_no_results', { 'keyword': query });

//             searchResults.innerHTML = `<div class="no-results-wrapper"><p class="no-results-message"><span>No results found for </span><strong>"${escapeHtml(query)}"</strong></p></div>`;
            
//             if (isHomePage && gallerySection) {
//                 const galleryClone = gallerySection.cloneNode(true);
//                 galleryClone.id = '';
//                 galleryClone.style.display = 'block';
//                 galleryClone.style.marginTop = '40px';
//                 searchResults.appendChild(galleryClone);
//             }

//             if (isCategoryPage) {
//                 const defaultItems = categoryItems.slice(0, ITEMS_PER_PAGE_CATEGORY);
//                 const defaultGridHTML = defaultItems.map(p => {
//                     // --- FIX START: Changed limit to 60 ---
//                     const fullDesc = escapeHtml(p.description || "");
//                     const limit = 60; 
//                     const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
//                     const needsToggle = fullDesc.length > limit; 
//                     const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
//                     // --- FIX END ---

//                     return `
//                     <article class="product-card" id="${createId(p.title)}">
//                         <div class="card-image-container">
//                     <picture style="display: contents;">
//                         <source media="(max-width: 768px)" srcset="${escapeHtml(p.mobileImageUrl || p.imageUrl)}">
//                         <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/>
//                     </picture>
//                 </div>
//                         <h3>${escapeHtml(p.title)}</h3>
//                         <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
//                             ${shortDescWithEllipsis}
//                         </p>
//                         ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
//                         <div class="product-card-footer">
//                             <button class="share-btn" aria-label="Share" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || '')}">
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
//                             </button>
//                             <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
//                         </div>
//                     </article>
//                     `;
//                 }).join('');
                
//                 const gridContainer = document.createElement('div');
//                 gridContainer.className = 'product-grid';
//                 gridContainer.style.marginTop = '40px';
//                 gridContainer.innerHTML = defaultGridHTML;
//                 searchResults.appendChild(gridContainer);
//             }

//         } else {
//             const gridDiv = document.createElement('div');
//             gridDiv.className = 'product-grid';
//             gridDiv.innerHTML = paginated.map(p => {
//                 // --- FIX START: Changed limit to 60 ---
//                 const fullDesc = escapeHtml(p.description || "");
//                 const limit = 60; 
//                 const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
//                 const needsToggle = fullDesc.length > limit; 
//                 const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;
//                 // --- FIX END ---

//                 return `
//                 <article class="product-card">
//                     <div class="card-image-container"><img src="${escapeHtml(p.imageUrl || p.image)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/></div>
//                     <h3>${escapeHtml(p.title)}</h3>
//                     <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
//                         ${shortDescWithEllipsis}
//                     </p>
//                     ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
//                     <div class="product-card-footer">
//                         <button class="share-btn" aria-label="Share" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || p.image || '')}">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
//                         </button>
//                         <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
//                     </div>
//                 </article>
//                 `;
//             }).join('');
//             searchResults.innerHTML = '';
//             searchResults.appendChild(gridDiv);
//         }

//         searchResults.classList.remove('hidden');
//         if (gallerySection) gallerySection.style.display = 'none';
//         if (grid) grid.classList.add('hidden');
//         if (paginationContainer) paginationContainer.classList.add('hidden');

//         renderPagination(searchPagination, totalPages, page, (newPage) => doSearch(query, newPage));
//     }
//     // Generic pagination UI creator
//   function renderPagination(container, totalPages, currentPage, clickHandler) {
//     if (container) container.innerHTML = "";
//     if (!container || totalPages <= 1) return;

//     const createBtn = (label, targetPage, isDisabled, isActive) => {
//         const btn = document.createElement("button");
//         btn.textContent = label;
//         btn.className = "pagination-btn";
        
//         // --- 1. MOBILE OPTIMIZATIONS ---
//         // 'manipulation' tells mobile browsers: "Don't wait for double-tap, click instantly."
//         btn.style.touchAction = "manipulation"; 
//         btn.style.minWidth = "45px";  // Minimum touch target size
//         btn.style.minHeight = "45px";
//         btn.style.margin = "0 5px";

//         // Visual State
//         if (isActive) btn.classList.add("active");
        
//         // --- 2. HARD DISABLE ---
//         // If disabled, use pointer-events: none. This makes the button "ghost" to clicks.
//         if (isDisabled) {
//             btn.disabled = true;
//             btn.style.opacity = "0.5";
//             btn.style.pointerEvents = "none"; 
//         }

//         // --- 3. CLICK HANDLER ---
//         btn.onclick = (e) => {
//             e.preventDefault();
//             e.stopPropagation(); // Stop the click from bubbling up

//             // Double check safety
//             if (isDisabled || isActive) return;

//             // *** THE FIX: LOCK THE UI ***
//             // Immediately disable ALL buttons in this container.
//             // This prevents you from tapping "Next" twice rapidly.
//             const allButtons = container.querySelectorAll("button");
//             allButtons.forEach(b => {
//                 b.disabled = true;
//                 b.style.pointerEvents = "none";
//             });

//             // Scroll Logic
//             const productSection = document.getElementById("searchResults") || document.getElementById("gallerySection");
//             if (productSection) {
//                 const y = productSection.getBoundingClientRect().top + window.scrollY - 80;
//                 window.scrollTo({ top: y, behavior: 'smooth' });
//             } else {
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//             }

//             // Fire the actual page change
//             // (The buttons will be re-created enabled when this function finishes)
//             clickHandler(targetPage);
//         };

//         container.appendChild(btn);
//     };

//     // Render logic
//     createBtn("‹", currentPage - 1, currentPage === 1, false);
//     createBtn(currentPage, currentPage, false, true);
//     createBtn("›", currentPage + 1, currentPage === totalPages, false);
// }

// ---------- 6. RENDERING LOGIC (MODIFIED) ----------

    function renderCategoryGrid(page = 1) {
        if (!isCategoryPage) return;
        const start = (page - 1) * ITEMS_PER_PAGE_CATEGORY;
        const paginated = categoryItems.slice(start, start + ITEMS_PER_PAGE_CATEGORY);

        grid.innerHTML = paginated.map(p => {
            const fullDesc = escapeHtml(p.description || "");
            const limit = 60; 
            const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
            const needsToggle = fullDesc.length > limit; 
            const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;

            return `
                <article class="product-card" id="${createId(p.title)}">
               <div class="card-image-container">
                    <picture style="display: contents;">
                        <source media="(max-width: 768px)" srcset="${escapeHtml(p.mobileImageUrl || p.imageUrl)}">
                        <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/>
                    </picture>
                </div>
                <h3>${escapeHtml(p.title)}</h3>
                <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                    ${shortDescWithEllipsis}
                </p>
                ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
                <div class="product-card-footer">
                    <button class="share-btn" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || '')}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                    </button>
                    <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
                </div>
                </article>
            `;
        }).join("");

        const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE_CATEGORY);
        renderPagination(paginationContainer, totalPages, page, renderCategoryGrid);
    }
    
    // Renders search results and their pagination
// Renders search results and their pagination
    function renderSearchResults(results, page = 1, query = '') {
        if (!searchResults) return;
        const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE_SEARCH);
        const start = (page - 1) * ITEMS_PER_PAGE_SEARCH;
        const paginated = results.slice(start, start + ITEMS_PER_PAGE_SEARCH);

        const mainTitle = document.getElementById('mainTitle');

        // --- CASE 1: NO RESULTS FOUND ---
        if (!paginated.length) {
            
            // 1. Show Title (Home Page)
            if (mainTitle) mainTitle.style.display = 'block';

            // 2. Hide Filters (Home Page)
            const filterContainer = document.getElementById('searchFilterContainer');
            if (isHomePage && filterContainer) {
                filterContainer.classList.add('hidden');
            }

            gtag('event', 'search_no_results', { 'keyword': query });

            // 3. Render "No Results" Message
            searchResults.innerHTML = `<div class="no-results-wrapper"><p class="no-results-message"><span>No results found for </span><strong>"${escapeHtml(query)}"</strong></p></div>`;
            
            // 4. FALLBACK: Show Homepage Gallery
            if (isHomePage && gallerySection) {
                const galleryClone = gallerySection.cloneNode(true);
                galleryClone.id = '';
                galleryClone.style.display = 'block';
                galleryClone.style.marginTop = '40px';
                searchResults.appendChild(galleryClone);
            }

            // 5. FALLBACK: Show Category Grid (RESTORED THIS BLOCK)
            if (isCategoryPage) {
                const defaultItems = categoryItems.slice(0, ITEMS_PER_PAGE_CATEGORY);
                
                const defaultGridHTML = defaultItems.map(p => {
                    const fullDesc = escapeHtml(p.description || "");
                    const limit = 60; 
                    const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
                    const needsToggle = fullDesc.length > limit; 
                    const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;

                    return `
                    <article class="product-card" id="${createId(p.title)}">
                        <div class="card-image-container">
                            <picture style="display: contents;">
                                <source media="(max-width: 768px)" srcset="${escapeHtml(p.mobileImageUrl || p.imageUrl)}">
                                <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/>
                            </picture>
                        </div>
                        <h3>${escapeHtml(p.title)}</h3>
                        <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                            ${shortDescWithEllipsis}
                        </p>
                        ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
                        <div class="product-card-footer">
                            <button class="share-btn" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || '')}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </button>
                            <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
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
            // --- CASE 2: RESULTS FOUND ---

            // 1. Hide Title (Focus on results)
            if (mainTitle) mainTitle.style.display = 'none';

            // 2. Show Filters (Home Page)
            const filterContainer = document.getElementById('searchFilterContainer');
            if (isHomePage && filterContainer && (query || activeFilters.size > 0)) {
                filterContainer.classList.remove('hidden');
            }

            const gridDiv = document.createElement('div');
            gridDiv.className = 'product-grid';
            gridDiv.innerHTML = paginated.map(p => {
                const fullDesc = escapeHtml(p.description || "");
                const limit = 60; 
                const shortDesc = `${escapeHtml((p.description || "").slice(0, limit))}`;
                const needsToggle = fullDesc.length > limit; 
                const shortDescWithEllipsis = `${shortDesc}${needsToggle ? '...' : ''}`;

                return `
                <article class="product-card">
                    <div class="card-image-container"><img src="${escapeHtml(p.imageUrl || p.image)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/300x220?text=Image'"/></div>
                    <h3>${escapeHtml(p.title)}</h3>
                    <p data-full-text="${fullDesc}" data-short-text="${shortDescWithEllipsis}">
                        ${shortDescWithEllipsis}
                    </p>
                    ${needsToggle ? `<button class="show-more-btn" data-more-text="...more" data-less-text="less">...more</button>` : ''}
                    <div class="product-card-footer">
                        <button class="share-btn" data-title="${escapeHtml(p.title)}" data-description="${escapeHtml(p.description)}" data-link="${escapeHtml(p.link || '')}" data-image="${escapeHtml(p.imageUrl || p.image || '')}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </button>
                        <a href="${escapeHtml(p.link || '#')}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
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

    function renderPagination(container, totalPages, currentPage, clickHandler) {
        if (container) container.innerHTML = "";
        if (!container || totalPages <= 1) return;

        const createBtn = (label, targetPage, isDisabled, isActive) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.className = "pagination-btn";
            btn.style.touchAction = "manipulation"; 
            btn.style.minWidth = "45px";  
            btn.style.minHeight = "45px";
            btn.style.margin = "0 5px";
            if (isActive) btn.classList.add("active");
            if (isDisabled) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none"; 
            }
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isDisabled || isActive) return;
                const allButtons = container.querySelectorAll("button");
                allButtons.forEach(b => { b.disabled = true; b.style.pointerEvents = "none"; });
                const productSection = document.getElementById("searchResults") || document.getElementById("gallerySection");
                if (productSection) {
                    const y = productSection.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                clickHandler(targetPage);
            };
            container.appendChild(btn);
        };
        createBtn("‹", currentPage - 1, currentPage === 1, false);
        createBtn(currentPage, currentPage, false, true);
        createBtn("›", currentPage + 1, currentPage === totalPages, false);
    }

    // ---------- 7. SEARCH LOGIC (SMART, FUZZY & FILTERS) ----------

    let activeFilters = new Set(); // Stores "tech", "livogue", etc.

    const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

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
                        matrix[i - 1][j - 1] + 1, 
                        matrix[i][j - 1] + 1,     
                        matrix[i - 1][j] + 1      
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const isMatch = (query, text) => {
        if (!query || !text) return false;
        const q = normalize(query);
        const t = normalize(text);
        if (t.includes(q)) return true;
        if (q.length > 2) {
            const allowedErrors = Math.floor(q.length / 4) || 1; 
            if (Math.abs(q.length - t.length) < 4) { 
                 return levenshtein(q, t) <= allowedErrors;
            }
        }
        return false;
    };

    function renderFilterUI() {
        const container = document.getElementById('searchFilterContainer');
        if (!container) return;

        const filters = ['Livogue', 'Wellfit', 'Tech']; 
        
        container.innerHTML = filters.map(cat => {
            const isActive = activeFilters.has(cat.toLowerCase());
            return `<button class="filter-pill ${isActive ? 'active' : ''}" data-cat="${cat.toLowerCase()}">${cat}</button>`;
        }).join('');

        container.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = e.target.dataset.cat;
                if (activeFilters.has(cat)) activeFilters.delete(cat);
                else activeFilters.add(cat);
                
                renderFilterUI(); 
                doSearch(searchInput.value, 1); 
            });
        });
    }

   function resetToDefaultGrid() {
        if (searchResults) searchResults.classList.add('hidden');
        if (searchPagination) searchPagination.innerHTML = '';
        
        // Show the Title back
        const mainTitle = document.getElementById('mainTitle');
        if (mainTitle) mainTitle.style.display = 'block';

        // Hide Filters
        const filterContainer = document.getElementById('searchFilterContainer');
        if (filterContainer) {
            filterContainer.classList.add('hidden');
            activeFilters.clear(); 
        }

        // --- NEW: Hide Sort Dropdown (ONLY on Home Page) ---
        const sortWrapper = document.querySelector('.sort-wrapper');
        if (isHomePage && sortWrapper) {
            sortWrapper.classList.add('hidden');
        }
        
        // Reset Breadcrumbs
        if (searchInput) searchInput.value = ''; // Ensure input is visually clear
        renderBreadcrumbs();

        if (isHomePage && gallerySection) gallerySection.style.display = 'block';
        if (isCategoryPage && grid) grid.classList.remove('hidden');
        if (isCategoryPage && paginationContainer) paginationContainer.classList.remove('hidden');
    }

    function doSearch(q, page = 1) {
        const query = (q || '').trim();
        
        const filterContainer = document.getElementById('searchFilterContainer');
        if (filterContainer) {
            if (query || activeFilters.size > 0) {
                filterContainer.classList.remove('hidden');
                if (filterContainer.innerHTML === '') renderFilterUI();
            } else {
                filterContainer.classList.add('hidden');
            }
        }

        if (!query && activeFilters.size === 0) {
            resetToDefaultGrid();
            return;
        }

        // --- NEW: Show Sort Dropdown (When Searching) ---
        const sortWrapper = document.querySelector('.sort-wrapper');
        if (sortWrapper) {
            sortWrapper.classList.remove('hidden');
        }
        
        // Update Breadcrumbs to show "Home / Search"
        renderBreadcrumbs();

        if (query) {
            const recents = loadRecent();
            if (!recents.some(x => x.toLowerCase() === query.toLowerCase())) {
                recents.unshift(query);
                saveRecent(recents);
            }
        }
        hideDropdown();

        let pool = isCategoryPage ? categoryItems : [...allProducts];

        if (activeFilters.size > 0) {
            pool = pool.filter(p => {
                const pCat = (p.category || '').toLowerCase();
                return [...activeFilters].some(filter => pCat.includes(filter));
            });
        }
        
        let results = pool;
        if (query) {
             results = pool.filter(p => 
                isMatch(query, p.title) || 
                (p.description && isMatch(query, p.description))
            );
        }
        
        renderSearchResults(results, page, query);
    }

    function hideDropdown() { if (searchDropdown) searchDropdown.classList.add('hidden'); searchSelectedIndex = -1; }
    
    function renderDropdown(filter = '') {
        if (!searchDropdown) return;
        searchSelectedIndex = -1;
        const query = filter.trim();
        let displayItems = [];

        const historyMatches = loadRecent().filter(s => s.toLowerCase().includes(query.toLowerCase()));
        let productMatches = [];
        if (query.length >= 3) {
            productMatches = allProducts.filter(p => isMatch(query, p.title)).map(p => p.title);
        }

        const seen = new Set();
        historyMatches.forEach(item => {
            const key = item.toLowerCase();
            if(!seen.has(key)) { seen.add(key); displayItems.push({ text: item, type: 'history' }); }
        });
        productMatches.forEach(item => {
             const key = item.toLowerCase();
             if(!seen.has(key)) { seen.add(key); displayItems.push({ text: item, type: 'product' }); }
        });

        displayItems = displayItems.slice(0, 6);
        if (!displayItems.length) { hideDropdown(); return; }

        searchDropdown.innerHTML = displayItems.map(item => `
            <div class="row" data-value="${escapeHtml(item.text)}">
                <span class="value" style="display: flex; justify-content: space-between; width: 100%;">
                    <span>${escapeHtml(item.text)}</span>
                    ${item.type === 'product' ? '<span style="font-size: 0.75em; opacity: 0.5;">Product</span>' : ''}
                </span>
                ${item.type === 'history' ? `<button class="remove" data-remove="${escapeHtml(item.text)}">✕</button>` : ''}
            </div>
        `).join('');
        searchDropdown.classList.remove('hidden');
    }

//    // ---------- 7. SEARCH LOGIC (SMART & FUZZY) ----------

//     // --- 7a. NEW: Smart Search Helpers ---
    
//     // 1. Normalize String: Removes special chars & spaces (e.g., "Power Bank" -> "powerbank")
//     const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

//     // 2. Levenshtein Distance: Calculates how many "typos" away two words are
//     const levenshtein = (a, b) => {
//         const matrix = [];
//         for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
//         for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
//         for (let i = 1; i <= b.length; i++) {
//             for (let j = 1; j <= a.length; j++) {
//                 if (b.charAt(i - 1) == a.charAt(j - 1)) {
//                     matrix[i][j] = matrix[i - 1][j - 1];
//                 } else {
//                     matrix[i][j] = Math.min(
//                         matrix[i - 1][j - 1] + 1, // deletion
//                         matrix[i][j - 1] + 1,     // insertion
//                         matrix[i - 1][j] + 1      // substitution
//                     );
//                 }
//             }
//         }
//         return matrix[b.length][a.length];
//     };

//     // 3. The "Brain": Decides if a product matches the query
//     const isMatch = (query, text) => {
//         if (!query || !text) return false;
//         const q = normalize(query);
//         const t = normalize(text);
        
//         // Strict check: if the user typed "bank", matches "powerbank"
//         if (t.includes(q)) return true;
        
//         // Fuzzy check: Only runs if query is > 2 chars to prevent lag
//         if (q.length > 2) {
//             // Allow 1 typo for every 4 letters (e.g. "ipone" -> "iphone")
//             const allowedErrors = Math.floor(q.length / 4) || 1; 
//             // Optimization: Only check math if lengths are somewhat close
//             if (Math.abs(q.length - t.length) < 4) { 
//                  return levenshtein(q, t) <= allowedErrors;
//             }
//         }
//         return false;
//     };

//     // --- 7b. Main Search Functions ---

//     function resetToDefaultGrid() {
//         if (searchResults) searchResults.classList.add('hidden');
//         if (searchPagination) searchPagination.innerHTML = '';
//         if (isHomePage && gallerySection) gallerySection.style.display = 'block';
//         if (isCategoryPage && grid) grid.classList.remove('hidden');
//         if (isCategoryPage && paginationContainer) paginationContainer.classList.remove('hidden');
//     }

//     function doSearch(q, page = 1) {
//         const query = (q || '').trim();
//         if (!query) {
//             resetToDefaultGrid();
//             return;
//         }

//         // Save to history (Standard Logic)
//         const recents = loadRecent();
//         // Only save if it's NOT already there (case insensitive)
//         if (!recents.some(x => x.toLowerCase() === query.toLowerCase())) {
//             recents.unshift(query);
//             saveRecent(recents);
//         }
//         hideDropdown();

//         let pool = isCategoryPage ? categoryItems : [...allProducts];
        
//         // --- SMART FILTERING ---
//         // Checks Title OR Description using the smart 'isMatch' logic
//         const results = pool.filter(p => 
//             isMatch(query, p.title) || 
//             (p.description && isMatch(query, p.description))
//         );
        
//         renderSearchResults(results, page, query);
//     }

//     function hideDropdown() { if (searchDropdown) searchDropdown.classList.add('hidden'); searchSelectedIndex = -1; }
    
//     function renderDropdown(filter = '') {
//         if (!searchDropdown) return;
        
//         // Always reset selection on new type
//         searchSelectedIndex = -1;

//         const query = filter.trim();
//         let displayItems = [];

//         // 1. Get History Matches (Always check these)
//         // We use standard 'includes' for history to keep it snappy
//         const historyMatches = loadRecent().filter(s => 
//             s.toLowerCase().includes(query.toLowerCase())
//         );

//         // 2. Get Product Matches (Only if typing >= 3 letters)
//         let productMatches = [];
//         if (query.length >= 3) {
//             productMatches = allProducts
//                 .filter(p => isMatch(query, p.title)) // Use smart match
//                 .map(p => p.title);
//         }

//         // 3. Merge: History First, Then Products
//         // Use a Set to prevent duplicates (e.g. if "Wipro" is in history AND is a product)
//         const seen = new Set();
        
//         // Add History items
//         historyMatches.forEach(item => {
//             const key = item.toLowerCase();
//             if(!seen.has(key)) {
//                 seen.add(key);
//                 displayItems.push({ text: item, type: 'history' });
//             }
//         });

//         // Add Product items (only if not seen)
//         productMatches.forEach(item => {
//              const key = item.toLowerCase();
//              if(!seen.has(key)) {
//                 seen.add(key);
//                 displayItems.push({ text: item, type: 'product' });
//             }
//         });

//         // Limit to 6 suggestions total
//         displayItems = displayItems.slice(0, 6);

//         if (!displayItems.length) {
//             hideDropdown();
//             return;
//         }

//         // Render with smart icons
//         searchDropdown.innerHTML = displayItems.map(item => `
//             <div class="row" data-value="${escapeHtml(item.text)}">
//                 <span class="value" style="display: flex; justify-content: space-between; width: 100%;">
//                     <span>${escapeHtml(item.text)}</span>
//                     ${item.type === 'product' 
//                         ? '<span style="font-size: 0.75em; opacity: 0.5; font-style: italic;">Product</span>' 
//                         : ''}
//                 </span>
                
//                 ${item.type === 'history' 
//                     ? `<button class="remove" data-remove="${escapeHtml(item.text)}" aria-label="Remove">✕</button>` 
//                     : ''}
//             </div>
//         `).join('');

//         searchDropdown.classList.remove('hidden');
//     }

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
            <picture style="display: contents;">
                <source media="(max-width: 768px)" srcset="${escapeHtml(p.mobileImageUrl || p.imageUrl)}">
                <img src="${escapeHtml(p.imageUrl || "https://placehold.co/300x220?text=Image")}" 
                     alt="${escapeHtml(p.title)}"
                     onerror="this.src='https://placehold.co/300x220?text=Image'">
            </picture>
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
            <a href="${escapeHtml(p.link || "#")}" target="_blank" rel="noopener noreferrer" class="buy">Buy Now</a>
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

// ---------- NEW: BREADCRUMBS & SORTING LOGIC ----------

    function renderBreadcrumbs() {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        // Base Path
        let html = `<a href="/">Home</a>`;
        
        // 1. Check Explicit Page Tag (This fixes Contact/About)
        const pageType = document.body.dataset.page; 

        if (pageType === 'contact') {
            html += ` <span>/</span> <span class="current">Contact</span>`;
        }
        else if (pageType === 'about') { // Ensure about.html has <body data-page="about">
            html += ` <span>/</span> <span class="current">About Us</span>`;
        }
        // 2. Search Results
        else if (searchInput && searchInput.value.trim() !== '') {
             html += ` <span>/</span> <span class="current">Search</span>`;
        }
        // 3. Category Page
        else if (isCategoryPage && currentCategory) {
            const catName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
            html += ` <span>/</span> <span class="current">${escapeHtml(catName)}</span>`;
        } 

        container.innerHTML = html;
    }

    function sortProducts(criteria) {
        // Determine which list to sort
        let listToSort = isCategoryPage ? categoryItems : allProducts;
        
        // If on homepage but searching, we might be sorting search results. 
        // But usually, sorting affects the main "pool". 
        // For simplicity, we sort the master list, then re-render.
        
        switch (criteria) {
            case 'newest':
                listToSort.sort((a, b) => new Date(b._createdAt || 0) - new Date(a._createdAt || 0));
                break;
            case 'oldest':
                listToSort.sort((a, b) => new Date(a._createdAt || 0) - new Date(b._createdAt || 0));
                break;
            case 'price-low':
                listToSort.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                listToSort.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'alpha-asc':
                listToSort.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        // Re-render based on current page state
        if (isCategoryPage) {
            renderCategoryGrid(1); // Reset to page 1
        } else if (searchInput.value.trim() !== '') {
            // If searching, re-run search to apply sort to results
            doSearch(searchInput.value, 1);
        } else {
            // Homepage Gallery is usually random/curated, but we can re-init if needed.
            // For now, we leave the gallery random as requested previously.
        }
    }

    // ... existing helper functions ...

// --- NEW: Custom Sort Dropdown Logic ---
function setupCustomSort() {
    const trigger = document.getElementById('customSortTrigger');
    const optionsMenu = document.getElementById('customSortOptions');
    const options = document.querySelectorAll('.custom-option');
    const label = document.getElementById('sortLabel');

    if (!trigger || !optionsMenu) return;

    // 1. Toggle Menu
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from bubbling
        optionsMenu.classList.toggle('show');
        trigger.classList.toggle('open');
    });

    // 2. Handle Option Selection
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Visual Update
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            label.textContent = option.textContent;

            // Close Menu
            optionsMenu.classList.remove('show');
            trigger.classList.remove('open');

            // --- TRIGGER THE ACTUAL SORT ---
            const value = option.dataset.value;
            sortProducts(value); // Calls your existing sort logic
        });
    });

    // 3. Close when clicking outside
    document.addEventListener('click', () => {
        optionsMenu.classList.remove('show');
        trigger.classList.remove('open');
    });
}



// ---------- 9. EVENT LISTENERS & INITIALIZATION (MODIFIED) ----------
    async function init() {

        // --- 1. Handle "View Product" Clicks from Chatbot (PRESERVED) ---
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.classList.contains('chat-link') && link.getAttribute('href').includes('#')) {
                const href = link.getAttribute('href');
                const targetId = href.split('#')[1]; 
                const targetCard = document.getElementById(targetId);
                if (targetCard) {
                    e.preventDefault(); 
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.style.transition = "box-shadow 0.5s ease, transform 0.5s ease";
                    targetCard.style.boxShadow = "0 0 20px 5px rgba(234, 179, 8, 0.6)"; 
                    targetCard.style.transform = "scale(1.02)";
                    targetCard.style.zIndex = "10"; 
                    setTimeout(() => {
                        targetCard.style.boxShadow = "none";
                        targetCard.style.transform = "scale(1)";
                        targetCard.style.zIndex = "1";
                    }, 2000);
                }
            }
        });
    
        // --- 2. Global Event Listeners (PRESERVED) ---
        menuBtn?.addEventListener('click', openSidebar);
        closeSidebar?.addEventListener('click', hideSidebar);
        overlay?.addEventListener('click', hideSidebar);

        // --- 3. SMART SEARCH BAR LOGIC (Google Style) (PRESERVED) ---
        const ICON_SEARCH = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
        const ICON_CLOSE = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        // Button Click: Decides whether to SEARCH or CLEAR
        searchBtn?.addEventListener('click', () => {
            if (searchBtn.dataset.mode === 'clear') {
                searchInput.value = '';
                searchInput.focus(); 
                searchBtn.innerHTML = ICON_SEARCH;
                searchBtn.dataset.mode = 'search';
                
                hideDropdown();
                resetToDefaultGrid(); 
            } else {
                doSearch(searchInput.value, 1);
            }
        });

        if (searchInput) {
            // Focus/Blur 
            searchInput.addEventListener('focus', () => {
                clearTimeout(animatedPlaceholderTimeout); 
                searchInput.setAttribute("placeholder", "Search products...");
                renderDropdown(searchInput.value);
            });
            
            searchInput.addEventListener('blur', () => {
                setTimeout(hideDropdown, 150);
                if (searchInput.value === "" && isHomePage) initAnimatedPlaceholder();
            });

            // INSTANT TOGGLE: Switch icon immediately when typing
            searchInput.addEventListener('input', (e) => {
                const hasText = e.target.value.trim().length > 0;
                
                if (hasText && searchBtn.dataset.mode !== 'clear') {
                    searchBtn.innerHTML = ICON_CLOSE;
                    searchBtn.dataset.mode = 'clear';
                } else if (!hasText && searchBtn.dataset.mode === 'clear') {
                    searchBtn.innerHTML = ICON_SEARCH;
                    searchBtn.dataset.mode = 'search';
                }
            });

            // DEBOUNCED SEARCH: The heavy lifting 
            searchInput.addEventListener('input', debounce((e) => {
                renderDropdown(e.target.value || '');
                if (!e.target.value.trim()) resetToDefaultGrid();
            }, 120));

            // KEYBOARD NAV (Enter, Arrows, Escape)
            searchInput.addEventListener('keydown', (e) => {
                const rows = searchDropdown?.querySelectorAll('.row');
                
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (rows && rows.length && searchSelectedIndex >= 0) {
                        const value = rows[searchSelectedIndex].dataset.value;
                        searchInput.value = value;
                        hideDropdown();
                        searchBtn.innerHTML = ICON_CLOSE;
                        searchBtn.dataset.mode = 'clear';
                        doSearch(value, 1);
                    } else {
                        doSearch(searchInput.value, 1);
                    }
                    return;
                }

                if (!rows || !rows.length) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    searchSelectedIndex = (searchSelectedIndex + 1) % rows.length;
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    searchSelectedIndex = (searchSelectedIndex - 1 + rows.length) % rows.length;
                }
                else if (e.key === 'Escape') {
                    hideDropdown();
                    return;
                }

                rows.forEach((row, i) => {
                    row.classList.toggle('hover', i === searchSelectedIndex);
                });
            });
            
            // DROPDOWN CLICK HANDLER
            if (searchDropdown) {
                 searchDropdown.addEventListener('pointerdown', (ev) => {
                    ev.preventDefault();
                    const removeBtn = ev.target.closest('button.remove');
                    const row = ev.target.closest('.row');

                    if (removeBtn) {
                        ev.stopImmediatePropagation();
                        const value = removeBtn.dataset.remove;
                        if (!value) return;
                        const updated = loadRecent().filter(x => x !== value);
                        saveRecent(updated);
                        renderDropdown(searchInput?.value || '');
                        return;
                    }

                    if (row) {
                        const val = row.dataset.value;
                        if (!val) return;
                        searchInput.value = val;
                        hideDropdown();
                        searchBtn.innerHTML = ICON_CLOSE;
                        searchBtn.dataset.mode = 'clear';
                        doSearch(val, 1);
                    }
                });
            }
        }

        // --- 4. Event delegation for share and "show more" (PRESERVED) ---
        const handleGridClick = (e) => {
            const shareButton = e.target.closest('.share-btn');
            const showMoreButton = e.target.closest('.show-more-btn');

            if (shareButton) {
                e.preventDefault(); 
                const { title, description, image } = shareButton.dataset;
                const productId = createId(title);
                const deepLink = `${window.location.origin}${window.location.pathname}#${productId}`;
                handleShareClick(title, description, deepLink, image);

            } else if (showMoreButton) {
                e.preventDefault();
                const card = showMoreButton.closest('.product-card');
                if (!card) return; 
                const p = card.querySelector('p');
                const isExpanded = card.classList.toggle('is-expanded');
                if (isExpanded) {
                    p.innerHTML = p.dataset.fullText;
                    showMoreButton.innerHTML = showMoreButton.dataset.lessText;
                } else {
                    p.innerHTML = p.dataset.shortText;
                    showMoreButton.innerHTML = showMoreButton.dataset.moreText;
                }
            }
        };

        if (grid) grid.addEventListener('click', handleGridClick);
        if (searchResults) searchResults.addEventListener('click', handleGridClick);
        if (gallery) gallery.addEventListener('click', handleGridClick); 

        // --- 5. Data-dependent Initialization (UPDATED) ---
        try {
            allProducts = await fetchProducts();
            window.CLASSIT_PRODUCTS = allProducts; 

            // --- NEW: Toolbar Initialization (Sort & Breadcrumbs) ---
            renderBreadcrumbs();
            setupCustomSort(); // <--- ADD THIS LINE HERE!
            
            const sortDropdown = document.getElementById('sortDropdown');
            const sortWrapper = document.querySelector('.sort-wrapper');

            // LOGIC: Hide Sort on Home Page initially, Show on Category Pages
            if (isHomePage && sortWrapper) {
                sortWrapper.classList.add('hidden');
            } else if (sortWrapper) {
                sortWrapper.classList.remove('hidden');
            }

            if (sortDropdown) {
                sortDropdown.addEventListener('change', (e) => {
                    sortProducts(e.target.value);
                });
            }
            // --------------------------------------------------------

           if (isCategoryPage) {
                const allItems = allProducts.filter((p) => (p.category || '').toLowerCase() === (currentCategory || '').toLowerCase());
                categoryItems = shuffleArray(allItems);

                // Deep Link "VIP" Logic
                const hash = window.location.hash.substring(1); 
                if (hash) {
                    const vipIndex = categoryItems.findIndex(p => createId(p.title) === hash);
                    if (vipIndex > -1) {
                        const [vipProduct] = categoryItems.splice(vipIndex, 1);
                        categoryItems.unshift(vipProduct);
                        setTimeout(() => {
                            const targetCard = document.getElementById(hash);
                            if (targetCard) {
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                targetCard.style.transition = "box-shadow 0.5s";
                                targetCard.style.boxShadow = "0 0 0 4px #eab308"; 
                                setTimeout(() => { targetCard.style.boxShadow = "none"; }, 2000);
                            }
                        }, 500); 
                    }
                }
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

const sidebarMenu = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('menuBtn');
    
    // 1. Highlight Current Page (Smart Match)
    // This removes trailing slashes and 'index.html' to ensure it works everywhere
    const currentPath = window.location.pathname.replace(/\/$/, "").replace("/index.html", "") || "/";
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    sidebarLinks.forEach(link => {
        try {
            const url = new URL(link.href);
            // Normalize the link path just like the current path
            const linkPath = url.pathname.replace(/\/$/, "").replace("/index.html", "") || "/";
            
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        } catch(e) { /* Ignore errors */ }
    });

    // 2. Close Sidebar on Outside Click
    document.addEventListener('click', (event) => {
        if (!sidebarMenu || !sidebarToggle) return;
        const clickedInside = sidebarMenu.contains(event.target);
        const clickedBtn = sidebarToggle.contains(event.target);

        if (sidebarMenu.classList.contains('show') && !clickedInside && !clickedBtn) {
            sidebarMenu.classList.remove('show');
        }
    });
init();  // <--- ADD THIS (Runs the app)
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

/* ===============================================
   SMART SORT FIX (Handles Search Results)
   =============================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Index all cards on load (so we can restore "Newest" order)
    const indexCards = () => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            if (!card.hasAttribute('data-index')) {
                card.setAttribute('data-index', index);
            }
        });
    };
    
    // Run initially and whenever search might update
    indexCards();
    const observer = new MutationObserver(indexCards);
    const searchContainer = document.getElementById('searchResults');
    if(searchContainer) observer.observe(searchContainer, { childList: true });

    // 2. Hijack the Sort Clicks
    document.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Wait a tiny bit for the UI to update
            setTimeout(() => {
                const sortType = this.getAttribute('data-value');
                applySmartSort(sortType);
            }, 50);
        });
    });
});

function applySmartSort(sortType) {
    const searchResults = document.getElementById('searchResults');
    const mainGrid = document.getElementById('productGrid'); 
    
    let containerToSort = mainGrid;

    // 1. CHECK: Are we looking at search results?
    if (searchResults && !searchResults.classList.contains('hidden') && searchResults.querySelector('.product-card')) {
        // CRITICAL FIX: The cards are actually inside a child div called .product-grid
        // We must sort THIS inner div, not the parent, to keep the layout.
        const innerGrid = searchResults.querySelector('.product-grid');
        if (innerGrid) {
            containerToSort = innerGrid;
        } else {
            // Fallback: If no wrapper exists, use the parent (and ensure it has grid class)
            containerToSort = searchResults;
            containerToSort.classList.add('product-grid'); 
        }
    }

    if (!containerToSort) return;

    // 2. Get all cards
    const cards = Array.from(containerToSort.querySelectorAll('.product-card'));

    // 3. Sort them
    cards.sort((a, b) => {
        const priceA = getPriceFromCard(a);
        const priceB = getPriceFromCard(b);
        // Default to 0 if index is missing to prevent NaN errors
        const indexA = parseInt(a.getAttribute('data-index') || 0);
        const indexB = parseInt(b.getAttribute('data-index') || 0);
        const nameA = a.querySelector('h3') ? a.querySelector('h3').innerText.toLowerCase() : '';
        const nameB = b.querySelector('h3') ? b.querySelector('h3').innerText.toLowerCase() : '';

        if (sortType === 'price-low') return priceA - priceB;
        if (sortType === 'price-high') return priceB - priceA;
        if (sortType === 'newest') return indexA - indexB; 
        if (sortType === 'oldest') return indexB - indexA;
        if (sortType === 'alpha-asc') return nameA.localeCompare(nameB);
        return 0;
    });

    // 4. Re-append sorted cards to the CORRECT container
    containerToSort.innerHTML = '';
    cards.forEach(card => containerToSort.appendChild(card));
}

// Helper to extract price from text (e.g., "$1,200" -> 1200)
function getPriceFromCard(card) {
    // Looks for any text that looks like a price inside the card
    const text = card.innerText;
    const match = text.match(/[\d,.]+/); 
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}