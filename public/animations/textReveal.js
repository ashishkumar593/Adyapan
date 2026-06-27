class TextReveal {
  constructor(selector) {
    this.target = document.querySelector(selector);
    if (!this.target) return;
    this.prepareText();
    this.animate();
  }

  prepareText() {
    const nodes = Array.from(this.target.childNodes);
    this.target.innerHTML = ''; // Clear container

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        // Keep whitespace intact but extract words
        const parts = textContent.split(/(\s+)/);
        
        parts.forEach(part => {
          if (part.trim().length === 0) {
            // Append whitespace as a regular text node
            this.target.appendChild(document.createTextNode(part));
          } else {
            const wrapper = this.createWordWrapper(part);
            this.target.appendChild(wrapper);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone element (e.g. <span class="text-gradient">)
        const element = node.cloneNode(false); // shallow clone to keep attributes but clear kids
        const textContent = node.textContent;
        const parts = textContent.split(/(\s+)/);
        
        parts.forEach(part => {
          if (part.trim().length === 0) {
            element.appendChild(document.createTextNode(part));
          } else {
            const wrapper = this.createWordWrapper(part);
            element.appendChild(wrapper);
          }
        });
        
        this.target.appendChild(element);
      }
    });
  }

  createWordWrapper(word) {
    const wrapper = document.createElement('span');
    wrapper.className = 'reveal-word-wrapper';
    
    const inner = document.createElement('span');
    inner.className = 'reveal-word';
    inner.textContent = word;
    
    wrapper.appendChild(inner);
    return wrapper;
  }

  animate() {
    if (window.gsap) {
      window.gsap.to('.reveal-word', {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.15
      });
    } else {
      // Fallback: make text visible instantly if GSAP is blocked/missing
      document.querySelectorAll('.reveal-word').forEach(word => {
        word.style.transform = 'translateY(0%)';
        word.style.opacity = '1';
      });
    }
  }
}

// Export initialization function
window.initTextReveal = function(selector) {
  new TextReveal(selector);
};
