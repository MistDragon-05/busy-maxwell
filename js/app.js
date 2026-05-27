/**
 * Flow Media SPA App Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initBentoEffects();
  initIframeHandler();
});

/**
 * SPA Router
 */
function initRouter() {
  const routes = {
    '#/': 'page-home',
    '#/process': 'page-process',
    '#/book': 'page-book'
  };

  const navItems = {
    '#/': 'nav-home',
    '#/process': 'nav-process',
    '#/book': 'nav-book'
  };

  function handleRoute() {
    let hash = window.location.hash || '#/';
    
    // Fallback for invalid hashes
    if (!routes[hash]) {
      hash = '#/';
    }

    const targetPageId = routes[hash];
    const targetNavItemId = navItems[hash];

    // Transition Pages
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => {
      if (page.id === targetPageId) {
        page.classList.add('active-page');
      } else {
        page.classList.remove('active-page');
      }
    });

    // Update Navigation Active State
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
      if (link.id === targetNavItemId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to Top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Listen to hash change and on load
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/**
 * 3D Parallax Hover Effects for Bento Cards
 */
function initBentoEffects() {
  const cards = document.querySelectorAll('.bento-card');
  
  cards.forEach(card => {
    const media = card.querySelector('.bento-card-media');
    const img = card.querySelector('.bento-card-media img');
    
    if (!media || !img) return;

    // Apply perspective styling dynamically to support 3D
    media.style.perspective = '1000px';
    img.style.transformStyle = 'preserve-3d';
    img.style.transition = 'transform 0.1s ease-out'; // Fast tracking

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside element
      const y = e.clientY - rect.top;  // y position inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt rotation angles (Max 8 degrees tilt)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      // Slightly shift position for depth
      const translateZ = 15; // Z-axis translate for 3D POP effect
      
      img.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Restore smoothly
      img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      
      // Reset transition back to fast tracking after restoring completes
      setTimeout(() => {
        if (card.matches(':hover')) return; // Ignore if user hovered back fast
        img.style.transition = 'transform 0.1s ease-out';
      }, 600);
    });
  });
}

/**
 * Cal.com iframe loading safety checker
 */
function initIframeHandler() {
  const iframe = document.getElementById('cal-booking-iframe');
  const loading = document.getElementById('booking-loading');
  
  if (!iframe || !loading) return;

  // Set timeout if the widget fails to load within 8 seconds
  const loadTimeout = setTimeout(() => {
    if (loading.style.display !== 'none') {
      loading.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <p style="margin-bottom: 12px; color: var(--accent-green);">Booking widget taking too long to respond.</p>
          <a href="https://cal.com/flow.media" target="_blank" class="btn-primary" style="display: inline-block;">
            Open Cal.com in New Tab
          </a>
        </div>
      `;
    }
  }, 8000);

  iframe.addEventListener('load', () => {
    clearTimeout(loadTimeout);
    loading.style.display = 'none';
  });
}
