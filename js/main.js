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

  // ---------- Easter Egg: Physics Drop ----------
  function initEasterEgg() {
    const trigger = document.getElementById('easter-egg-trigger');
    if (!trigger) return;

    let isAnimating = false;
    let bodies = [];
    let animationId = null;

    // Physics constants
    const GRAVITY = 0.6;
    const BOUNCE = 0.5;
    const FRICTION = 0.98;
    const FLOOR_Y = window.innerHeight - 20;

    // Get all droppable elements
    function getDroppableElements() {
      return [
        document.querySelector('.site-title'),
        document.querySelector('.tagline'),
        document.querySelector('.divider'),
        ...document.querySelectorAll('.project-item'),
        document.querySelector('.footer'),
      ].filter(Boolean);
    }

    // Create physics body from element
    function createBody(el) {
      const rect = el.getBoundingClientRect();
      return {
        el,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -5,
        rotation: 0,
        vr: (Math.random() - 0.5) * 10,
        originalRect: rect,
        originalTransform: el.style.transform,
        originalPosition: el.style.position,
        originalTop: el.style.top,
        originalLeft: el.style.left,
      };
    }

    // Apply physics step
    function physicsStep() {
      let allSettled = true;

      bodies.forEach(body => {
        // Apply gravity
        body.vy += GRAVITY;

        // Apply velocity
        body.x += body.vx;
        body.y += body.vy;
        body.rotation += body.vr;

        // Floor collision
        const floorY = FLOOR_Y - body.height;
        if (body.y >= floorY) {
          body.y = floorY;
          body.vy *= -BOUNCE;
          body.vx *= FRICTION;
          body.vr *= FRICTION * 0.8;

          // Check if settled
          if (Math.abs(body.vy) < 0.5) {
            body.vy = 0;
          }
        }

        // Wall collisions
        if (body.x <= 0) {
          body.x = 0;
          body.vx *= -BOUNCE;
        }
        if (body.x + body.width >= window.innerWidth) {
          body.x = window.innerWidth - body.width;
          body.vx *= -BOUNCE;
        }

        // Check if still moving
        if (Math.abs(body.vx) > 0.1 || Math.abs(body.vy) > 0.1 || body.y < floorY - 1) {
          allSettled = false;
        }

        // Apply transform
        body.el.style.position = 'fixed';
        body.el.style.top = '0';
        body.el.style.left = '0';
        body.el.style.transform = `translate(${body.x}px, ${body.y}px) rotate(${body.rotation}deg)`;
        body.el.style.zIndex = '1000';
        body.el.style.margin = '0';
      });

      return allSettled;
    }

    // Reset elements to original positions
    function resetElements() {
      return new Promise(resolve => {
        // Animate back to original positions
        bodies.forEach((body, index) => {
          body.el.style.transition = `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`;
          body.el.style.transform = `translate(${body.originalRect.left}px, ${body.originalRect.top}px) rotate(0deg)`;
        });

        // Wait for animation to complete
        setTimeout(() => {
          bodies.forEach(body => {
            body.el.style.transition = '';
            body.el.style.transform = body.originalTransform || '';
            body.el.style.position = body.originalPosition || '';
            body.el.style.top = body.originalTop || '';
            body.el.style.left = body.originalLeft || '';
            body.el.style.zIndex = '';
            body.el.style.margin = '';
          });
          bodies = [];
          resolve();
        }, 1000 + bodies.length * 50);
      });
    }

    // Main drop animation
    function dropAnimation() {
      const settled = physicsStep();

      if (!settled) {
        animationId = requestAnimationFrame(dropAnimation);
      } else {
        // Wait 2 seconds then reassemble
        setTimeout(async () => {
          await resetElements();
          isAnimating = false;
        }, 2000);
      }
    }

    // Start the drop
    function startDrop() {
      if (isAnimating) return;
      isAnimating = true;

      // Get elements and create physics bodies
      const elements = getDroppableElements();
      bodies = elements.map(createBody);

      // Disable pointer events during animation
      document.body.style.overflow = 'hidden';

      // Start physics simulation
      dropAnimation();
    }

    // Desktop: Click trigger
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      startDrop();
    });

    // Mobile: Shake detection
    let lastShake = 0;
    let shakeCount = 0;

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;

        const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

        if (magnitude > 25) {
          const now = Date.now();
          if (now - lastShake < 500) {
            shakeCount++;
            if (shakeCount >= 2) {
              startDrop();
              shakeCount = 0;
            }
          } else {
            shakeCount = 1;
          }
          lastShake = now;
        }
      });
    }

    // Mobile: Long press on logo
    const logo = document.querySelector('.site-title');
    if (logo) {
      let pressTimer = null;

      logo.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
          startDrop();
        }, 800);
      });

      logo.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
      });

      logo.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
      });
    }
  }

  // ---------- Initialize ----------
  function init() {
    loadProjects();
    initKeyboardNav();
    initCursorEffect();
    initScrollIndicator();
    initEasterEgg();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
