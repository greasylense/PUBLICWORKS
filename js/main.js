/**
 * PUBLICWORKS — Main JavaScript
 * Handles project loading, cursor effects, and interactions
 */

(function () {
  'use strict';

  // ---------- Configuration ----------
  const CONFIG = {
    projectsPath: 'data/projects.json',
    animationDelay: 50,
    cursor: {
      trailLength: 12,
      fadeSpeed: 0.08,
      gridSize: 40,
      gridOpacity: 0.15,
    },
    scroll: {
      throttleMs: 50,
    },
  };

  // ---------- Feature Detection ----------
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // ---------- DOM Elements ----------
  const elements = {
    projectList: document.getElementById('project-list'),
    indexNumber: document.querySelector('.index-number'),
    scrollIndicator: null,
    cursorCanvas: null,
  };

  // ---------- Project Loading ----------
  async function loadProjects() {
    const { projectList } = elements;

    if (!projectList) {
      console.warn('Project list element not found');
      return;
    }

    projectList.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(CONFIG.projectsPath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const projects = await response.json();
      renderProjects(projects);
      updateIndexNumber(projects.length);
    } catch (error) {
      console.error('Failed to load projects:', error);
      renderError();
    } finally {
      projectList.removeAttribute('aria-busy');
    }
  }

  // ---------- Project Rendering ----------
  function renderProjects(projects) {
    const { projectList } = elements;

    if (!projects || projects.length === 0) {
      projectList.innerHTML = '<li class="no-projects">No projects yet.</li>';
      return;
    }

    const fragment = document.createDocumentFragment();

    projects.forEach((project, index) => {
      const item = createProjectItem(project);
      item.style.animationDelay = `${index * CONFIG.animationDelay}ms`;
      fragment.appendChild(item);
    });

    projectList.innerHTML = '';
    projectList.appendChild(fragment);
  }

  function createProjectItem(project) {
    const li = document.createElement('li');
    li.className = 'project-item';

    const isExternal = project.url && project.url.startsWith('http');
    const href = project.url || `projects/${project.id}/`;

    li.innerHTML = `
      <a href="${escapeHtml(href)}"
         class="project-link"
         ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="project-number">${escapeHtml(project.number)}</span>
        <div class="project-info">
          <span class="project-name">${escapeHtml(project.name)}</span>
          <span class="project-description">${escapeHtml(project.description)}</span>
        </div>
        <span class="project-status" data-status="${escapeHtml(project.status)}">${escapeHtml(project.status)}</span>
      </a>
    `;

    return li;
  }

  function renderError() {
    const { projectList } = elements;
    projectList.innerHTML = `
      <li class="project-error">
        <span class="error-text">Unable to load projects. Please try again later.</span>
      </li>
    `;
  }

  // ---------- Index Number ----------
  function updateIndexNumber(count) {
    const { indexNumber } = elements;
    if (indexNumber) {
      indexNumber.textContent = String(count).padStart(3, '0');
    }
  }

  // ---------- Utility Functions ----------
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  // ---------- Keyboard Navigation ----------
  function initKeyboardNav() {
    const { projectList } = elements;

    projectList.addEventListener('keydown', (e) => {
      const items = Array.from(projectList.querySelectorAll('.project-link'));
      const currentIndex = items.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + 1, items.length - 1);
          items[nextIndex].focus();
          break;

        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          items[nextIndex].focus();
          break;
      }
    });
  }

  // ---------- Blueprint Cursor Effect ----------
  function initCursorEffect() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    elements.cursorCanvas = canvas;

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInWindow = false;

    // Trail points with opacity
    const trail = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawGrid(x, y) {
      const { gridSize, gridOpacity } = CONFIG.cursor;
      ctx.strokeStyle = `rgba(0, 71, 255, ${gridOpacity})`;
      ctx.lineWidth = 0.5;

      // Calculate grid cell boundaries around cursor
      const cellX = Math.floor(x / gridSize) * gridSize;
      const cellY = Math.floor(y / gridSize) * gridSize;

      // Draw a small grid around cursor (3x3 cells)
      const range = 1;
      for (let i = -range; i <= range + 1; i++) {
        for (let j = -range; j <= range + 1; j++) {
          const gx = cellX + i * gridSize;
          const gy = cellY + j * gridSize;

          // Calculate distance-based opacity
          const dist = Math.hypot(gx - x, gy - y);
          const maxDist = gridSize * 2;
          const opacity = Math.max(0, 1 - dist / maxDist) * gridOpacity;

          if (opacity > 0.01) {
            ctx.strokeStyle = `rgba(0, 71, 255, ${opacity})`;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(gx, gy - gridSize);
            ctx.lineTo(gx, gy + gridSize);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(gx - gridSize, gy);
            ctx.lineTo(gx + gridSize, gy);
            ctx.stroke();
          }
        }
      }
    }

    function drawTrail() {
      if (trail.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < trail.length; i++) {
        const p1 = trail[i - 1];
        const p2 = trail[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 71, 255, ${p2.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isMouseInWindow) {
        // Draw grid around cursor
        drawGrid(mouseX, mouseY);

        // Update trail
        trail.push({ x: mouseX, y: mouseY, opacity: 1 });

        // Limit trail length
        while (trail.length > CONFIG.cursor.trailLength) {
          trail.shift();
        }

        // Fade trail points
        trail.forEach((point) => {
          point.opacity -= CONFIG.cursor.fadeSpeed;
        });

        // Remove fully faded points
        while (trail.length > 0 && trail[0].opacity <= 0) {
          trail.shift();
        }

        drawTrail();
      } else {
        // Fade out when mouse leaves
        trail.forEach((point) => {
          point.opacity -= CONFIG.cursor.fadeSpeed * 2;
        });

        while (trail.length > 0 && trail[0].opacity <= 0) {
          trail.shift();
        }

        if (trail.length > 0) {
          drawTrail();
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInWindow = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isMouseInWindow = false;
    });

    document.addEventListener('mouseenter', () => {
      isMouseInWindow = true;
    });

    // Initialize
    resize();
    animate();

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!document.hidden && !animationId) {
        animate();
      }
    });
  }

  // ---------- Scroll Position Indicator ----------
  function initScrollIndicator() {
    if (prefersReducedMotion()) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.textContent = 'Y:0000';
    document.body.appendChild(indicator);
    elements.scrollIndicator = indicator;

    const updatePosition = throttle(() => {
      const scrollY = Math.round(window.scrollY);
      indicator.textContent = `Y:${String(scrollY).padStart(4, '0')}`;
    }, CONFIG.scroll.throttleMs);

    window.addEventListener('scroll', updatePosition, { passive: true });
    updatePosition();
  }

  // ---------- Initialize ----------
  function init() {
    loadProjects();
    initKeyboardNav();
    initCursorEffect();
    initScrollIndicator();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
