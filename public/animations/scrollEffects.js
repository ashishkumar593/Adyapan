class ScrollEffects {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // 1. Text fade, translate, scale & blur scroll animation
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // Fade & translate the hero content block on scroll
      window.gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom 20%',
          scrub: true
        },
        y: -80,
        opacity: 0.05,
        scale: 0.95,
        filter: 'blur(8px)',
        ease: 'none'
      });


      // 2. Feature Section Header reveal on scroll
      window.gsap.from('#features .section-header', {
        scrollTrigger: {
          trigger: '#features',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power3.out'
      });

      // 3. Feature Cards stagger reveal on scroll
      window.gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        scale: 0.94,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    } else {
      // IntersectionObserver fallback for scroll reveal
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      };

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.style.filter = 'blur(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Pre-style fallback elements and observe
      const header = document.querySelector('#features .section-header');
      if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(40px)';
        header.style.filter = 'blur(10px)';
        header.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(header);
      }

      document.querySelectorAll('.feature-card').forEach((card, idx) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) scale(0.94)';
        card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transitionDelay = `${idx * 0.1}s`;
        revealObserver.observe(card);
      });
      // Native scroll listener fallback if GSAP is unavailable
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
          const opacity = Math.max(0, 1 - scrolled / 400);
          const yOffset = -scrolled * 0.2;
          const blurVal = Math.min(10, scrolled * 0.02);
          
          heroContent.style.opacity = opacity;
          heroContent.style.transform = `translateY(${yOffset}px) scale(${1 - scrolled * 0.0001})`;
          heroContent.style.filter = `blur(${blurVal}px)`;
        }


      });
    }
  }
}

// Export initialization function
window.initScrollEffects = function() {
  new ScrollEffects();
};
