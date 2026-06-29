// Admin Dashboard JS - Adyapan AI

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initSectionNav();
  initFilterChips();
});

// Theme Toggle
function initTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  const btn = document.querySelector('.theme-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
}

// Sidebar Toggle
function initSidebar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const layout = document.getElementById('admin-layout');
  const sidebarClose = document.querySelector('.sidebar-close');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && layout) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        sidebar.classList.add('active');
      } else {
        layout.classList.toggle('collapsed');
      }
    });
  }
  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.remove('active');
    });
  }
  document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
}

// SPA-style Section Navigation
function initSectionNav() {
  const items = document.querySelectorAll('.sidebar-item[data-section]');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');
      adminNav(sectionId);
      // close mobile sidebar
      document.querySelector('.sidebar')?.classList.remove('active');
    });
  });
}

function adminNav(sectionId) {
  // Sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active-section'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active-section');
  // Sidebar items
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  const activeItem = document.querySelector(`.sidebar-item[data-section="${sectionId}"]`);
  if (activeItem) activeItem.classList.add('active');
  // Scroll to top
  document.querySelector('.main-content')?.scrollTo(0, 0);
}

// Filter Chips
function initFilterChips() {
  document.querySelectorAll('.filter-chips').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });
}

// Profile Dropdown
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.user-profile-wrapper');
  const dropdown = document.querySelector('.profile-dropdown');
  if (wrapper && dropdown) {
    if (wrapper.contains(e.target)) {
      dropdown.classList.toggle('active');
    } else {
      dropdown.classList.remove('active');
    }
  }
});
