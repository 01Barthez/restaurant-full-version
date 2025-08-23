"use client";
import { themeColors } from "@/constants/global";
import React, { useEffect, useRef } from "react";

const FireCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCount = useRef(0);
  const maxParticles = 100; // Limite le nombre de particules pour les performances

  useEffect(() => {
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: { r: number; g: number; b: number };
      friction: number;
      gravity: number;
      update: () => void;
      draw: () => void;
    }> = [];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Fonction pour redimensionner le canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: { r: number; g: number; b: number };
      friction: number;
      gravity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = -Math.random() * 3 - 1;
        this.alpha = 1;
        this.size = Math.random() * 4 + 2;
        this.color = themeColors[Math.floor(Math.random() * themeColors.length)];
        this.friction = 0.95;
        this.gravity = 0.1;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
        this.size *= 0.99; // Réduit légèrement la taille au fil du temps
      }

      draw() {
        if (!ctx) return;
        
        // Crée un dégradé pour un effet plus réaliste
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${Math.max(0, this.color.g - 50)}, ${Math.max(0, this.color.b - 50)}, ${this.alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${Math.max(0, this.color.g - 100)}, 0, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 3);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // Réinitialise l'ombre
      }
    }

    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime > frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mise à jour et dessin des particules
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          
          // Supprime les particules invisibles
          if (particles[i].alpha <= 0 || particles[i].size <= 0.1) {
            particles.splice(i, 1);
            particleCount.current--;
          }
        }
        
        lastTime = timestamp - (deltaTime % frameInterval);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      // Crée plus de particules quand la souris se déplace plus vite
      const particlesToAdd = Math.min(3, Math.max(1, Math.floor(Math.random() * 3)));
      
      for (let i = 0; i < particlesToAdd && particleCount.current < maxParticles; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
        particleCount.current++;
      }
    };

    // Ajoute des particules même quand la souris ne bouge pas (effet de traînée)
    const onMouseStill = (e: MouseEvent) => {
      if (Math.random() > 0.7 && particleCount.current < maxParticles) {
        particles.push(new Particle(e.clientX, e.clientY));
        particleCount.current++;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", onMouseStill);

    // Nettoyage
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMouseStill);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{
        mixBlendMode: 'screen', // Améliore l'effet de lueur
      }}
    />
  );
};

export default FireCursor;
