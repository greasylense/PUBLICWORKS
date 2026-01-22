import { useRef, useEffect, useCallback } from 'react';
import { useRarity } from '../context/RarityContext';
import { TOTAL_POPULATION } from '../data/questions';
import type { Particle } from '../types';

const PARTICLE_COUNT = 10000;
const COLORS = {
  white: 'rgba(255, 255, 255,',
  cyan: 'rgba(0, 242, 255,',
  purple: 'rgba(168, 85, 247,',
};

interface ParticleCanvasProps {
  isZooming?: boolean;
}

export default function ParticleCanvas({ isZooming = false }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastPoolRef = useRef<number>(TOTAL_POPULATION);
  const centerXRef = useRef<number>(0);
  const centerYRef = useRef<number>(0);
  const zoomRef = useRef<number>(1);

  const { state } = useRarity();

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    centerXRef.current = width / 2;
    centerYRef.current = height / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute particles in a circular pattern
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(width, height) * 0.4;
      const x = centerXRef.current + Math.cos(angle) * radius;
      const y = centerYRef.current + Math.sin(angle) * radius;

      // Random color selection
      const colorRand = Math.random();
      let color: string;
      if (colorRand < 0.7) {
        color = COLORS.white;
      } else if (colorRand < 0.9) {
        color = COLORS.cyan;
      } else {
        color = COLORS.purple;
      }

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        color,
        isDying: false,
        deathProgress: 0,
      });
    }

    particlesRef.current = particles;
  }, []);

  // Kill particles based on pool change
  const killParticles = useCallback((_oldPool: number, newPool: number) => {
    const particles = particlesRef.current;
    const aliveParticles = particles.filter((p) => !p.isDying);

    // Calculate how many particles should remain
    const targetAlive = Math.max(
      1,
      Math.round((newPool / TOTAL_POPULATION) * PARTICLE_COUNT)
    );
    const toKill = aliveParticles.length - targetAlive;

    if (toKill <= 0) return;

    // Randomly select particles to kill
    const shuffled = [...aliveParticles].sort(() => Math.random() - 0.5);
    const particlesToKill = shuffled.slice(0, toKill);

    particlesToKill.forEach((particle) => {
      particle.isDying = true;
      particle.targetX = centerXRef.current;
      particle.targetY = centerYRef.current;
    });
  }, []);

  // Animation loop
  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const zoom = zoomRef.current;

      // Apply zoom transform for final animation
      if (zoom > 1) {
        ctx.save();
        ctx.translate(centerXRef.current, centerYRef.current);
        ctx.scale(zoom, zoom);
        ctx.translate(-centerXRef.current, -centerYRef.current);
      }

      particles.forEach((particle) => {
        if (particle.isDying) {
          // Implode towards center
          particle.deathProgress += 0.02;

          if (particle.targetX !== undefined && particle.targetY !== undefined) {
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            particle.x += dx * 0.08;
            particle.y += dy * 0.08;
          }

          particle.alpha = Math.max(0, 1 - particle.deathProgress);

          if (particle.deathProgress >= 1) {
            particle.alpha = 0;
          }
        } else {
          // Normal drift movement
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Soft boundary reflection
          const margin = 50;
          if (particle.x < margin || particle.x > width - margin) {
            particle.vx *= -0.8;
            particle.x = Math.max(margin, Math.min(width - margin, particle.x));
          }
          if (particle.y < margin || particle.y > height - margin) {
            particle.vy *= -0.8;
            particle.y = Math.max(margin, Math.min(height - margin, particle.y));
          }

          // Slight random drift
          particle.vx += (Math.random() - 0.5) * 0.02;
          particle.vy += (Math.random() - 0.5) * 0.02;

          // Damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Subtle alpha pulsing
          particle.alpha += (Math.random() - 0.5) * 0.02;
          particle.alpha = Math.max(0.2, Math.min(1, particle.alpha));
        }

        // Draw particle
        if (particle.alpha > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * (zoom > 1 ? zoom * 0.5 : 1), 0, Math.PI * 2);
          ctx.fillStyle = `${particle.color}${particle.alpha})`;
          ctx.fill();

          // Glow effect for brighter particles
          if (particle.alpha > 0.6 && !particle.isDying) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              particle.size * 3
            );
            gradient.addColorStop(0, `${particle.color}${particle.alpha * 0.3})`);
            gradient.addColorStop(1, `${particle.color}0)`);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }
      });

      if (zoom > 1) {
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
    },
    []
  );

  // Handle pool changes
  useEffect(() => {
    if (state.currentPool !== lastPoolRef.current) {
      killParticles(lastPoolRef.current, state.currentPool);
      lastPoolRef.current = state.currentPool;
    }
  }, [state.currentPool, killParticles]);

  // Handle zoom animation
  useEffect(() => {
    if (isZooming) {
      const startTime = Date.now();
      const duration = 3000;

      const zoomAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Exponential easing for dramatic zoom
        const eased = 1 - Math.pow(1 - progress, 4);
        zoomRef.current = 1 + eased * 999; // Zoom up to 1000x

        if (progress < 1) {
          requestAnimationFrame(zoomAnimation);
        }
      };

      zoomAnimation();
    } else {
      zoomRef.current = 1;
    }
  }, [isZooming]);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animate(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#050505' }}
    />
  );
}
