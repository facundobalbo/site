/* =========================================================
   FACUNDO BALBO — STATIC SITE
   main.js — All interactions & sidebar injection
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     SIDEBAR TEMPLATE
     ------------------------------------------------------- */

  const NAV_ITEMS = [
    { num: '01', label: 'HOME',         href: 'index.html',         page: 'home' },
    { num: '02', label: 'ENGINEERING',  href: 'ingenieria.html',    page: 'ingenieria' },
    { num: '03', label: 'CODE',         href: 'codigo.html',        page: 'codigo' },
    { num: '04', label: 'MUSIC',        href: 'musica.html',        page: 'musica' },
    { num: '05', label: 'WRITING',      href: 'escritura.html',     page: 'escritura' },
    { num: '06', label: 'BOOK PROJECT', href: 'cuantificados.html', page: 'cuantificados', special: true },
    { num: '07', label: 'LIBRARY',      href: 'biblioteca.html',    page: 'biblioteca' },
    { num: '08', label: 'PHOTOGRAPHY',  href: 'galeria.html',       page: 'galeria' },
    { num: '09', label: 'ABOUT',        href: 'sobre-mi.html',      page: 'sobre-mi' },
  ];

  function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = document.body.dataset.page || '';

    const navItemsHtml = NAV_ITEMS.map((item) => {
      const isActive = item.page === currentPage;
      const specialClass = item.special ? ' sidebar-nav-item--book' : '';
      const activeClass = isActive ? ' active' : '';
      return `<a href="${item.href}" class="sidebar-nav-item${specialClass}${activeClass}">
        <span class="sidebar-nav-number">${item.num}</span>${item.label}
      </a>`;
    }).join('');

    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <span class="sidebar-logo-name">Facundo Balbo</span>
        <span class="sidebar-logo-role">Engineer &amp; Polymath</span>
      </div>
      <nav class="sidebar-nav">
        ${navItemsHtml}
      </nav>
      <div class="sidebar-bottom">
        <a href="mailto:facundobalbo@gmail.com" class="sidebar-contact-btn">GET IN TOUCH</a>
      </div>
    `;
  }

  /* -------------------------------------------------------
     MOBILE NAV OVERLAY
     ------------------------------------------------------- */

  function buildMobileNav() {
    const topbar = document.getElementById('mobile-topbar');
    if (!topbar) return;

    const currentPage = document.body.dataset.page || '';

    const navItemsHtml = NAV_ITEMS.map((item) => {
      const isActive = item.page === currentPage;
      const activeClass = isActive ? ' active' : '';
      return `<a href="${item.href}" class="nav-overlay-item${activeClass}">
        <span class="nav-overlay-number">${item.num}</span>${item.label}
      </a>`;
    }).join('');

    topbar.innerHTML = `
      <span class="mobile-topbar-name">Facundo Balbo</span>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    `;

    // Build overlay
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      ${navItemsHtml}
      <a href="mailto:facundobalbo@gmail.com" class="nav-overlay-contact">GET IN TOUCH</a>
    `;

    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on item click
    overlay.querySelectorAll('.nav-overlay-item, .nav-overlay-contact').forEach((el) => {
      el.addEventListener('click', () => {
        overlay.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------------
     SIDEBAR NAV STAGGER ANIMATION
     ------------------------------------------------------- */

  function animateSidebarNav() {
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }, i * 50);
    });
  }

  /* -------------------------------------------------------
     PAGE LOAD ANIMATION
     ------------------------------------------------------- */

  function animatePageLoad() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    // Small delay to allow CSS transition to fire
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainContent.classList.add('visible');
      });
    });
  }

  /* -------------------------------------------------------
     REAL-TIME CLOCK
     ------------------------------------------------------- */

  function updateClock() {
    const el = document.getElementById('live-time');
    if (!el) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    el.textContent = `ACTIVO / ${hh}:${mm}`;
  }

  function startClock() {
    if (!document.getElementById('live-time')) return;
    updateClock();
    setInterval(updateClock, 60000);
  }

  /* -------------------------------------------------------
     LIBRARY FILTER
     ------------------------------------------------------- */

  function initLibraryFilter() {
    const pills = document.querySelectorAll('.filter-pill');
    if (!pills.length) return;

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        const cards = document.querySelectorAll('.book-card');

        cards.forEach((card) => {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            const match = card.dataset.category === filter;
            card.classList.toggle('hidden', !match);
          }
        });
      });
    });
  }

  /* -------------------------------------------------------
     GALLERY FILTER
     ------------------------------------------------------- */

  function initGalleryFilter() {
    const pills = document.querySelectorAll('.gallery-filter-pill');
    if (!pills.length) return;

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        const items = document.querySelectorAll('.gallery-item');

        items.forEach((item) => {
          if (filter === 'all') {
            item.classList.remove('hidden');
          } else {
            const match = item.dataset.category === filter;
            item.classList.toggle('hidden', !match);
          }
        });
      });
    });
  }

  /* -------------------------------------------------------
     GALLERY LIGHTBOX
     ------------------------------------------------------- */

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let items = [];
    let currentIndex = 0;

    function openLightbox(index) {
      // Refresh visible items each time (handles filter)
      items = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      currentIndex = index;
      const item = items[currentIndex];
      if (!item) return;
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || img.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    function showPrev() {
      items = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      const item = items[currentIndex];
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || img.alt || '';
    }

    function showNext() {
      items = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      currentIndex = (currentIndex + 1) % items.length;
      const item = items[currentIndex];
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || img.alt || '';
    }

    // Attach click handlers to gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        // Compute index among visible items
        const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
        const idx = visibleItems.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Click outside image closes lightbox
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* -------------------------------------------------------
     PROGRESS BAR ANIMATION (cuantificados)
     ------------------------------------------------------- */

  function animateProgressBar() {
    const fill = document.querySelector('.progress-bar-fill');
    if (!fill) return;
    const target = parseFloat(fill.dataset.target || '64');
    setTimeout(() => {
      fill.style.width = target + '%';
    }, 300);
  }

  /* -------------------------------------------------------
     SMOOTH SCROLL
     ------------------------------------------------------- */

  document.documentElement.style.scrollBehavior = 'smooth';

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    buildMobileNav();
    animateSidebarNav();
    animatePageLoad();
    startClock();
    initLibraryFilter();
    initGalleryFilter();
    initLightbox();
    animateProgressBar();
  });

})();
