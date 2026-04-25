/* =========================================================
   FACUNDO BALBO — STATIC SITE
   main.js — sidebar, mobile nav, animaciones, reloj, apuntes home
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------- */

  const NAV_ITEMS = [
    { num: '01', label: 'INICIO',    href: 'index.html',         page: 'inicio' },
    { num: '02', label: 'TRABAJO',   href: 'trabajo.html',       page: 'trabajo' },
    { num: '03', label: 'ESCRITURA', href: 'escritura.html',     page: 'escritura' },
    { num: '04', label: 'MÚSICA',    href: 'musica.html',        page: 'musica' },
    { num: '05', label: 'LECTURAS',  href: 'biblioteca.html',    page: 'biblioteca' },
  ];

  const SOCIALS_HTML = `
    <a href="https://www.instagram.com/facu.balbo/" target="_blank" rel="noopener" class="sidebar-social-link" aria-label="Instagram">
      <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a href="https://www.youtube.com/@facubalbo" target="_blank" rel="noopener" class="sidebar-social-link" aria-label="YouTube">
      <svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
    </a>
    <a href="https://github.com/facundobalbo" target="_blank" rel="noopener" class="sidebar-social-link" aria-label="GitHub">
      <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    </a>
    <a href="https://www.linkedin.com/in/facundobalbo/" target="_blank" rel="noopener" class="sidebar-social-link" aria-label="LinkedIn">
      <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
    <a href="https://vsco.co/facubalbo" target="_blank" rel="noopener" class="sidebar-social-link" aria-label="VSCO">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
    </a>
  `;

  /* -------------------------------------------------------
     SIDEBAR (desktop)
     ------------------------------------------------------- */

  function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = document.body.dataset.page || '';

    const navItemsHtml = NAV_ITEMS.map((item) => {
      const isActive = item.page === currentPage;
      const activeClass = isActive ? ' active' : '';
      return `<a href="${item.href}" class="sidebar-nav-item${activeClass}">
        <span class="sidebar-nav-number">${item.num}</span>${item.label}
      </a>`;
    }).join('');

    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <span class="sidebar-logo-name">Facundo Balbo</span>
      </div>
      <nav class="sidebar-nav">
        ${navItemsHtml}
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-clock" id="sidebar-clock">San Luis · ––:––</div>
        <div class="sidebar-socials">
          ${SOCIALS_HTML}
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------
     MOBILE NAV
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

    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      ${navItemsHtml}
      <a href="mailto:facundobalbo@gmail.com" class="nav-overlay-contact">CONTACTO</a>
    `;

    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.querySelectorAll('.nav-overlay-item, .nav-overlay-contact').forEach((el) => {
      el.addEventListener('click', () => {
        overlay.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------------
     ANIMACIONES DE CARGA
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

  function animatePageLoad() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainContent.classList.add('visible');
      });
    });
  }

  /* -------------------------------------------------------
     RELOJ — sidebar y footer
     ------------------------------------------------------- */

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateClocks() {
    const now = new Date();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());

    const sidebarClock = document.getElementById('sidebar-clock');
    if (sidebarClock) sidebarClock.textContent = `San Luis · ${hh}:${mm}`;

    const footerStatus = document.getElementById('footer-status');
    if (footerStatus) footerStatus.textContent = `${hh}:${mm} — ARG`;
  }

  function startClocks() {
    updateClocks();
    setInterval(updateClocks, 30000);
  }

  /* -------------------------------------------------------
     LIBRARY FILTER (página biblioteca)
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
     APUNTES — feed paginado del Inicio
     ------------------------------------------------------- */

  const PER_PAGE = 10;
  let currentPage = 0;
  let allApuntes = [];

  function renderApunte(apunte) {
    const badge = apunte.etiqueta
      ? `<span class="apunte-badge">${apunte.etiqueta}</span>`
      : '';
    const parrafos = (apunte.contenido || '')
      .split('\n\n')
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
    return `<article class="apunte-item">
      <div class="apunte-meta">
        <span class="apunte-date">${apunte.fecha || ''}</span>
        ${badge}
      </div>
      <div class="apunte-text">${parrafos}</div>
    </article>`;
  }

  function renderApuntesPage(page) {
    const start = page * PER_PAGE;
    const slice = allApuntes.slice(start, start + PER_PAGE);
    const container = document.getElementById('home-apuntes-container');
    if (!container) return;
    container.innerHTML = slice.map(renderApunte).join('');

    const totalPages = Math.ceil(allApuntes.length / PER_PAGE);
    const pagination = document.getElementById('home-apuntes-pagination');
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }

    pagination.style.display = 'flex';
    pagination.innerHTML =
      `<button class="apuntes-page-btn" id="apuntes-prev"${page === 0 ? ' disabled' : ''}>← ANTERIORES</button>` +
      `<span class="apuntes-page-info">PÁGINA ${page + 1} DE ${totalPages}</span>` +
      `<button class="apuntes-page-btn" id="apuntes-next"${page >= totalPages - 1 ? ' disabled' : ''}>SIGUIENTES →</button>`;

    document.getElementById('apuntes-prev').addEventListener('click', () => {
      if (currentPage > 0) { currentPage--; renderApuntesPage(currentPage); }
    });
    document.getElementById('apuntes-next').addEventListener('click', () => {
      if (currentPage < totalPages - 1) { currentPage++; renderApuntesPage(currentPage); }
    });
  }

  function loadHomeApuntes() {
    const container = document.getElementById('home-apuntes-container');
    if (!container) return;

    fetch('/api/apuntes')
      .then((r) => r.json())
      .then((data) => {
        if (data.error || !data.apuntes || data.apuntes.length === 0) {
          container.innerHTML = '<p class="apuntes-empty">Sin entradas por el momento.</p>';
          return;
        }
        allApuntes = data.apuntes;
        renderApuntesPage(0);
      })
      .catch(() => {
        container.innerHTML = '<p class="apuntes-error">No se pudieron cargar las entradas.</p>';
      });
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
    startClocks();
    initLibraryFilter();
    loadHomeApuntes();
  });

})();
