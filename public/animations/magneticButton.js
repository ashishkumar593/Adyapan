class MagneticButton {
  constructor(selector) {
    this.buttons = document.querySelectorAll(selector);
    this.isMobile = window.innerWidth <= 768;
    
    // Disable magnetic effect on mobile, but keep click ripples active
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      // Ensure the button has relative positioning and hidden overflow for ripples
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      
      // 1. Add background glow helper element
      const glow = document.createElement('span');
      glow.className = 'btn-magnetic-glow';
      btn.appendChild(glow);

      if (!this.isMobile) {
        // 2. Mouse Move Magnetic Offset
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const btnX = rect.left + rect.width / 2;
          const btnY = rect.top + rect.height / 2;
          
          // Distance from cursor to button center
          const dx = e.clientX - btnX;
          const dy = e.clientY - btnY;
          
          // Pull effect (stronger as you get closer to the center)
          const pullStrength = 0.35;
          const xShift = dx * pullStrength;
          const yShift = dy * pullStrength;

          btn.style.transform = `translate(${xShift}px, ${yShift}px) scale(1.04)`;
          btn.style.boxShadow = `0 10px 25px rgba(245, 158, 11, 0.25)`;
        });

        // 3. Mouse Leave Reset
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px) scale(1)';
          btn.style.boxShadow = '';
        });
      }

      // 4. Click Ripple Animation
      btn.addEventListener('mousedown', (e) => {
        const rect = btn.getBoundingClientRect();
        const rippleX = e.clientX - rect.left;
        const rippleY = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        
        // Size of the ripple element
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${rippleX - size / 2}px`;
        ripple.style.top = `${rippleY - size / 2}px`;

        btn.appendChild(ripple);

        // Remove element after animation duration
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}

// Export initialization function
window.initMagneticButtons = function(selector) {
  new MagneticButton(selector);
};
