class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.burstParticles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    // Performance configurations based on device screen
    this.isMobile = window.innerWidth <= 768;
    this.maxParticles = this.isMobile ? 300 : 900;
    this.burstInterval = this.isMobile ? 12 : 5;
    this.burstFrameCount = 0;
    
    // Antigravity themed colors (Amber/Yellow matching student dashboard accent)
    this.colors = [
      'rgba(245, 158, 11, 0.45)',  // Amber primary
      'rgba(244, 147, 54, 0.45)',  // Warm orange
      'rgba(251, 191, 36, 0.45)',  // Yellow glow
      'rgba(255, 255, 255, 0.35)', // Soft white
      'rgba(217, 119, 6, 0.45)'    // Dark amber
    ];

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.particles = [];
    
    // Generate background floating particles
    for (let i = 0; i < this.maxParticles; i++) {
      const radius = Math.random() * 2 + 0.5;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.particles.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: radius,
        alpha: Math.random() * 0.5 + 0.1,
        color: 'rgba(255, 255, 255, 0.25)',
        baseColor: 'rgba(255, 255, 255, 0.25)',
        hoverColor: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  bindEvents() {
    const parent = this.canvas.parentElement;

    parent.addEventListener('mousemove', (e) => {
      const rect = parent.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    parent.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.init();
    });
  }

  createBurstParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.6 + 0.2;
    
    // Originates from the center of the hero section
    const startX = this.canvas.width / 2;
    const startY = this.canvas.height / 2;
    
    this.burstParticles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 2.5 + 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: 1,
      life: 1.0,
      decay: Math.random() * 0.005 + 0.003
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Background Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Slow drift
      p.originX += p.vx;
      p.originY += p.vy;

      // Wrap around bounds
      if (p.originX < 0) p.originX = this.canvas.width;
      if (p.originX > this.canvas.width) p.originX = 0;
      if (p.originY < 0) p.originY = this.canvas.height;
      if (p.originY > this.canvas.height) p.originY = 0;

      // Interaction with cursor
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          // Attract towards cursor
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          
          if (dist > 40) {
            // Attraction
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          } else {
            // Repel if too close
            p.x -= (dx / dist) * force * 4;
            p.y -= (dy / dist) * force * 4;
          }
          p.color = p.hoverColor;
        } else {
          // Smooth return to base path
          p.x += (p.originX - p.x) * 0.05;
          p.y += (p.originY - p.y) * 0.05;
          p.color = p.baseColor;
        }
      } else {
        // Smooth return to base path
        p.x += (p.originX - p.x) * 0.05;
        p.y += (p.originY - p.y) * 0.05;
        p.color = p.baseColor;
      }

      // Draw particle with scroll parallax offset
      const scrollY = window.scrollY || window.pageYOffset;
      const displayY = p.y - (scrollY * 0.15);

      this.ctx.beginPath();
      this.ctx.arc(p.x, displayY, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    }

    // 2. Render & Update Central Burst Particles
    this.burstFrameCount++;
    if (this.burstFrameCount >= this.burstInterval) {
      this.burstFrameCount = 0;
      this.createBurstParticle();
    }

    const scrollY = window.scrollY || window.pageYOffset;
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.life -= bp.decay;

      if (bp.life <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      // Draw burst particle with scroll offset
      const displayY = bp.y - (scrollY * 0.15);

      this.ctx.beginPath();
      this.ctx.arc(bp.x, displayY, bp.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = bp.color;
      this.ctx.globalAlpha = bp.life * 0.4; // Keep opacity subtle
      this.ctx.fill();
    }

    // 3. Render & Update Cursor Trail Particles
    if (window.trailParticles && window.trailParticles.length > 0) {
      for (let i = window.trailParticles.length - 1; i >= 0; i--) {
        const tp = window.trailParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.life -= tp.decay;

        if (tp.life <= 0) {
          window.trailParticles.splice(i, 1);
          continue;
        }

        const displayY = tp.y - (scrollY * 0.15);

        this.ctx.beginPath();
        this.ctx.arc(tp.x, displayY, tp.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = tp.color;
        this.ctx.globalAlpha = tp.life * 0.7;
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1.0;
    requestAnimationFrame(() => this.animate());
  }
}

// Export initialization function
window.initParticleBackground = function(canvasId) {
  new ParticleSystem(canvasId);
};
