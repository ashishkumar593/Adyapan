// Main JavaScript - Adyapan AI Landing Page

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCounters();
  initFAQ();
  initTestimonialSlider();
  initSmoothScroll();
  initHeroAnimation();
  initExploreTools();
});

// 1. Theme Toggle Management
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleUI(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      updateThemeToggleUI(targetTheme);
    });
  });
}

function updateThemeToggleUI(theme) {
  const themeToggleIcons = document.querySelectorAll('.theme-toggle-btn i');
  themeToggleIcons.forEach(icon => {
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  });
}

// 2. Mobile Nav Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('open');
      
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('open')) {
        spans[0].style.transform = 'translateY(9px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu on clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(span => span.style.transform = 'none');
        hamburger.querySelectorAll('span')[1].style.opacity = '1';
      });
    });
  }
}

// 3. Stats Counter Animation (using IntersectionObserver)
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  if (counters.length === 0) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const speed = 100; // Lower is faster
    const increment = Math.ceil(target / speed);
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = count.toLocaleString() + suffix;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target.toLocaleString() + suffix;
      }
    };
    updateCount();
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

// 4. FAQ Accordion
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        faqItem.classList.add('active');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// 5. Testimonial Slider/Carousel
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-wrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.testimonial-dot');

  const goToSlide = (index) => {
    currentIndex = index;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 5000); // Change testimonial every 5 seconds
  };

  const resetAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
  };

  startAutoplay();
}

// 6. Smooth Scroll for links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for sticky header
          behavior: 'smooth'
        });
      }
    });
  });
}

// 7. Interactive Background Animation for Hero Section
function initHeroAnimation() {
  const hero = document.getElementById('home');
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  
  if (!hero || !glow1 || !glow2) return;
  
  hero.addEventListener('mousemove', (e) => {
    const { width, height, left, top } = hero.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    // Convert coordinates to percentages relative to center (-50% to 50%)
    const xPct = (mouseX / width - 0.5) * 100;
    const yPct = (mouseY / height - 0.5) * 100;
    
    // Set custom properties for spotlight gradient tracking
    hero.style.setProperty('--mouse-x', `${(mouseX / width) * 100}%`);
    hero.style.setProperty('--mouse-y', `${(mouseY / height) * 100}%`);
    
    // 3D Parallax: offset background blobs slightly opposite to cursor
    glow1.style.transform = `translate(${xPct * -0.3}px, ${yPct * -0.3}px)`;
    glow2.style.transform = `translate(${xPct * 0.2}px, ${yPct * 0.2}px)`;
  });
  
  // Smoothly reset backgrounds on mouse leave
  hero.addEventListener('mouseleave', () => {
    glow1.style.transform = 'translate(0, 0)';
    glow2.style.transform = 'translate(0, 0)';
    hero.style.setProperty('--mouse-x', '50%');
    hero.style.setProperty('--mouse-y', '50%');
  });
}

// 8. Explore Tools Authentication Check
function initExploreTools() {
  const exploreLinks = document.querySelectorAll('.feature-link, a[href="/dashboard"]');
  exploreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        e.preventDefault();
        window.location.href = '/login';
      }
    });
  });
}
