// Dashboard JavaScript - Adyapan AI

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTheme();
  initSidebarToggle();
  fetchDashboardDataFromServer();
  initComingSoonBadges();
});

// 1. Dashboard Theme Management
function initDashboardTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  const themeToggle = document.querySelector('.theme-toggle-btn');
  if (themeToggle) {
    updateToggleIcon(themeToggle, currentTheme);
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', activeTheme);
      localStorage.setItem('theme', activeTheme);
      updateToggleIcon(themeToggle, activeTheme);
    });
  }
}

function updateToggleIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// 2. Collapsible Sidebar
function initSidebarToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarClose = document.querySelector('.sidebar-close');
  const layout = document.querySelector('.dashboard-layout');

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

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
}

// 3. Hydrate Dashboard Stats & Recent Activity from API
function fetchDashboardDataFromServer() {
  const email = localStorage.getItem('userEmail') || 'john.doe@university.edu';

  fetch(`/api/profile/details?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        // Fallback to offline simulations if API fails or user not registered on server
        simulateStatUpdates({ notesGenerated: 12, resumeScore: 78, interviewsCompleted: 3, careerProgress: 85 });
        return;
      }

      // 1. Update Welcome Message
      const welcomeHeader = document.getElementById('welcome-name');
      if (welcomeHeader) {
        welcomeHeader.innerText = `Welcome back, ${data.name}! 👋`;
      }

      // 2. Animate stats using database values
      simulateStatUpdates({
        notesGenerated: data.stats.notesGenerated || 0,
        resumeScore: data.stats.resumeScore || 0,
        interviewsCompleted: data.stats.interviewsCompleted || 0,
        careerProgress: data.stats.careerProgress || 0
      });

      // 3. Update Activity List
      if (data.activities && data.activities.length > 0) {
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
          activityList.innerHTML = data.activities.map((act, index) => {
            const colors = ['var(--primary)', 'var(--secondary)', 'var(--cyan)'];
            const color = colors[index % colors.length];
            return `
              <div class="activity-item animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div class="activity-dot" style="background: ${color}; box-shadow: 0 0 8px ${color};"></div>
                <div class="activity-details">
                  <p>${act.title}</p>
                  <div class="activity-time">${act.time}</div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    })
    .catch(err => {
      console.error('Error fetching dashboard stats:', err);
      // Fallback
      simulateStatUpdates({ notesGenerated: 12, resumeScore: 78, interviewsCompleted: 3, careerProgress: 85 });
    });
}

function simulateStatUpdates(stats) {
  const resumeScoreVal = document.getElementById('resume-score-val');
  if (resumeScoreVal) {
    let currentScore = 0;
    const targetScore = stats.resumeScore;
    const interval = setInterval(() => {
      if (currentScore < targetScore) {
        currentScore++;
        resumeScoreVal.innerText = currentScore + '%';
      } else {
        resumeScoreVal.innerText = targetScore + '%';
        clearInterval(interval);
      }
    }, 15);
  }

  const notesVal = document.getElementById('notes-generated-val');
  if (notesVal) {
    let currentNotes = 0;
    const targetNotes = stats.notesGenerated;
    if (targetNotes === 0) {
      notesVal.innerText = '0';
    } else {
      const interval = setInterval(() => {
        if (currentNotes < targetNotes) {
          currentNotes++;
          notesVal.innerText = currentNotes;
        } else {
          notesVal.innerText = targetNotes;
          clearInterval(interval);
        }
      }, 50);
    }
  }
}

// 4. Click Actions & Tool Card Alerts
function initComingSoonBadges() {
  const soonTools = document.querySelectorAll('.tool-item');
  soonTools.forEach(tool => {
    if (tool.querySelector('.badge-soon')) {
      tool.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification(`${tool.querySelector('h3').innerText} will be available in the upcoming release! 🚀`);
      });
    }
  });
}

// Simple Toast Notification
function showNotification(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerText = message;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    zIndex: '1000',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: '600',
    opacity: '0',
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease'
  });

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Dismiss Toast
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
