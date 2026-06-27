window.trailParticles = [];

class MouseTrail {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.isMobile = window.innerWidth <= 768;
    
    // Disable trail effect completely on mobile for performance
    if (this.isMobile) return;

    this.colors = [
      'rgba(245, 158, 11, 0.75)', // Amber/Yellow Glow
      'rgba(217, 119, 6, 0.75)',  // Darker Amber
      'rgba(252, 211, 77, 0.75)'  // Pale Yellow
    ];

    this.bindEvents();
  }

  bindEvents() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn multiple tiny trail particles per move
      for (let i = 0; i < 3; i++) {
        window.trailParticles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2.5 + 1.2,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    });
  }
}

// Export initialization function
window.initMouseTrail = function(containerId) {
  new MouseTrail(containerId);
};
