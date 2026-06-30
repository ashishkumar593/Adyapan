// Mentor Dashboard JS - Adyapan AI

let mentorEmail = localStorage.getItem('userEmail') || 'mentor@adyapan.ai';
let mentorName = localStorage.getItem('userName') || 'Mentor Expert';
let activeRoomId = null;
let activeStudentName = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initSubmenuAccordions();
  initSectionNav();
  initFilterChips();
  loadMentorData();
  initScheduleModal();
  initSettingsForm();
  initChatSystem();
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
  const layout = document.getElementById('mentor-layout');
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

// Expandable Submenus (Accordion)
function initSubmenuAccordions() {
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const parentItem = toggle.closest('.has-submenu');
      const isOpen = parentItem.classList.contains('open');
      
      // Close other open submenus first (Accordion style)
      document.querySelectorAll('.has-submenu').forEach(item => {
        item.classList.remove('open');
      });
      
      // Toggle current submenu
      if (!isOpen) {
        parentItem.classList.add('open');
        
        // Auto-expand the sidebar layout if collapsed to ensure usability
        const layout = document.querySelector('.dashboard-layout');
        if (layout && layout.classList.contains('collapsed')) {
          layout.classList.remove('collapsed');
        }
      }
    });
  });

  // Re-bind the click actions for items dynamically loaded under submenus
  document.querySelectorAll('.sidebar-submenu a.coming-soon-trigger').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showNotification(`${item.innerText.trim()} will be available in the upcoming release!`);
    });
  });
}

// Custom Notification Toast
function showNotification(msg) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification glass';
  toast.style.cssText = `
    background: rgba(15, 15, 25, 0.75);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: var(--text-primary);
    padding: 0.85rem 1.25rem;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 600;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease forwards;
  `;
  toast.innerHTML = `<i class="fas fa-info-circle" style="color: #f59e0b;"></i> <span>${msg}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// SPA Section Navigation
function initSectionNav() {
  // Bind top-level items with data-section
  document.querySelectorAll('.sidebar-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');
      mentorNav(sectionId);
      document.querySelector('.sidebar')?.classList.remove('active');
    });
  });

  // Bind submenu links with data-section
  document.querySelectorAll('.sidebar-submenu a[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sectionId = item.getAttribute('data-section');
      mentorNav(sectionId);
      document.querySelector('.sidebar')?.classList.remove('active');
    });
  });
}

function mentorNav(sectionId) {
  document.querySelectorAll('.mentor-section').forEach(s => s.classList.remove('active-section'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active-section');

  // Deactivate all sidebar items & submenu items
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.sidebar-submenu a').forEach(i => i.classList.remove('active-submenu-item'));

  // Highlight top-level active section
  const activeItem = document.querySelector(`.sidebar-item[data-section="${sectionId}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }

  // Highlight submenu active item & open its parent submenu
  const activeSubmenuLink = document.querySelector(`.sidebar-submenu a[data-section="${sectionId}"]`);
  if (activeSubmenuLink) {
    activeSubmenuLink.classList.add('active-submenu-item');
    const parentSubmenu = activeSubmenuLink.closest('.has-submenu');
    if (parentSubmenu) {
      parentSubmenu.classList.add('open');
      parentSubmenu.classList.add('active'); // active highlight on parent wrapper
    }
  }

  document.querySelector('.main-content')?.scrollTo(0, 0);
  
  if (sectionId === 'messages') {
    loadChatRooms();
  }
  if (sectionId === 'profile') {
    loadMentorProfile();
  }
}

// Filter Chips
function initFilterChips() {
  document.querySelectorAll('.filter-chips').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filterStudentsTable(chip.innerText);
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

// Load Mentor Data
function loadMentorData() {
  fetch(`/api/mentor/dashboard-data?email=${encodeURIComponent(mentorEmail)}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load mentor stats');
      return res.json();
    })
    .then(data => {
      // Update local storage name if present
      localStorage.setItem('userName', data.mentor.name);
      mentorName = data.mentor.name;

      // Update Nav profile fields
      const dropName = document.querySelector('.dropdown-user-name');
      const dropEmail = document.querySelector('.dropdown-user-email');
      if (dropName) dropName.innerText = data.mentor.name;
      if (dropEmail) dropEmail.innerText = data.mentor.email;

      // Update welcome message
      const welcomeH1 = document.querySelector('.user-welcome h1');
      if (welcomeH1) welcomeH1.innerText = `Welcome back, ${data.mentor.name}!`;

      // Update overview metrics
      updateOverviewStats(data.stats);

      // Render students table
      renderStudentsTable(data.students);

      // Render feedback and reviews
      renderReviews(data.reviews, data.stats.avgRating);
    })
    .catch(err => console.error(err));
}

function updateOverviewStats(stats) {
  // Overview 6 stat cards
  const totalAssigned = document.getElementById('stat-total-assigned');
  const activeStudents = document.getElementById('stat-active-students');
  const needAttention = document.getElementById('stat-need-attention');
  const aiEscalations = document.getElementById('stat-ai-escalations');
  const upcomingInterviews = document.getElementById('stat-upcoming-interviews');
  const placementReady = document.getElementById('stat-placement-ready');

  if (totalAssigned) totalAssigned.innerText = stats.activeStudents || 0;
  if (activeStudents) activeStudents.innerText = stats.activeStudents || 0;
  if (needAttention) needAttention.innerText = stats.needAttention || 2;
  if (aiEscalations) aiEscalations.innerText = stats.aiEscalations || 3;
  if (upcomingInterviews) upcomingInterviews.innerText = stats.sessionsThisWeek || 0;
  if (placementReady) placementReady.innerText = stats.placementReady || 1;

  // Update Performance tab stats
  const hoursVal = document.querySelector('#performance .widget-card:nth-child(1) .widget-value');
  const completedVal = document.querySelector('#performance .widget-card:nth-child(2) .widget-value');
  const retentionVal = document.querySelector('#performance .widget-card:nth-child(3) .widget-value');
  const rankVal = document.querySelector('#performance .widget-card:nth-child(4) .widget-value');

  if (hoursVal) hoursVal.innerText = `${stats.totalTeachingHours}h`;
  if (completedVal) completedVal.innerText = stats.sessionsCompleted;
  if (retentionVal) retentionVal.innerText = `${stats.studentRetention}%`;
  if (rankVal) rankVal.innerText = stats.rank;
}

function renderUpcomingSessions(sessions) {
  const container = document.querySelector('#overview .panel-card:first-child');
  if (!container) return;

  const title = '<h2 class="panel-title">Upcoming Sessions</h2>';
  const headerActions = `<div class="dashboard-actions" style="margin-top: -2.5rem; float: right;">
    <button class="admin-action-btn mentor-btn modal-trigger"><i class="fas fa-calendar-plus"></i> Schedule</button>
  </div><div style="clear: both;"></div>`;

  if (sessions.length === 0) {
    container.innerHTML = `${title}
      <div class="empty-state" style="padding:2.5rem 0;">
        <i class="fas fa-calendar-xmark"></i>
        <p>No upcoming sessions — schedule one!</p>
        <button class="admin-action-btn mentor-btn modal-trigger" style="margin-top:1rem;"><i class="fas fa-calendar-plus"></i> Schedule</button>
      </div>`;
  } else {
    let listHTML = `<div class="sessions-list-view" style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1rem;">`;
    sessions.forEach(s => {
      const dateObj = new Date(s.dateTime);
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);

      listHTML += `
        <div class="session-row glass" style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 1rem; border-radius:10px; border:1px solid var(--border-color);">
          <div style="display:flex; align-items:center; gap:0.8rem;">
            <div style="width:36px; height:36px; border-radius:50%; background:rgba(245,158,11,0.1); color:#f59e0b; display:flex; align-items:center; justify-content:center;"><i class="fas fa-video"></i></div>
            <div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">${s.topic}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Student: ${s.studentName}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.8rem; font-weight:600; color:#f59e0b;">${formattedDate}</div>
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:capitalize;">Status: ${s.status}</div>
          </div>
        </div>`;
    });
    listHTML += `</div>`;
    container.innerHTML = `${title}${headerActions}${listHTML}`;
  }

  // Bind trigger to newly rendered buttons
  container.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('schedule-modal').classList.add('active');
    });
  });
}

let allStudents = [];
function renderStudentsTable(students) {
  allStudents = students;
  const tbody = document.querySelector('.admin-table tbody');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state"><i class="fas fa-user-slash"></i>
            <p>No students assigned yet</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  renderTableRows(students);
}

function renderTableRows(students) {
  const tbody = document.querySelector('.admin-table tbody');
  if (!tbody) return;

  let rows = '';
  students.forEach((s, index) => {
    const statusClass = s.status === 'Active' ? 'badge-completed' : 'badge-pending';
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${s.studentName}</strong></td>
        <td>${s.goal}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="progress-bar-linear" style="width:70px; height:6px;"><div class="progress-fill-linear" style="width:${s.progress}%; background:#f59e0b;"></div></div>
            <span style="font-size:0.75rem; font-weight:700;">${s.progress}%</span>
          </div>
        </td>
        <td>${s.lastSession}</td>
        <td><span class="role-badge ${statusClass}" style="font-size:0.7rem; padding:0.15rem 0.45rem;">${s.status}</span></td>
        <td>
          <button class="admin-action-btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="mentorNav('messages')"><i class="fas fa-comments"></i> Chat</button>
        </td>
      </tr>`;
  });
  tbody.innerHTML = rows;
}

function filterStudentsTable(filter) {
  if (filter === 'All') {
    renderTableRows(allStudents);
  } else {
    const filtered = allStudents.filter(s => s.status.toLowerCase() === filter.toLowerCase());
    renderTableRows(filtered);
  }
}

function renderReviews(reviews, avgRating) {
  const bigRating = document.querySelector('.big-rating');
  const reviewCountLabel = document.querySelector('.rating-summary div:last-child');
  const listContainer = document.querySelector('#feedback .panel-card:last-child');

  if (bigRating) bigRating.innerText = avgRating.toFixed(1);
  if (reviewCountLabel) reviewCountLabel.innerText = `Based on ${reviews.length} reviews`;

  // Update stars
  const starsContainer = document.querySelector('.stars-row');
  if (starsContainer) {
    let stars = '';
    const roundedRating = Math.round(avgRating);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars += '<i class="fas fa-star"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    starsContainer.innerHTML = stars;
  }

  // Update breakdown bars
  const totalReviews = reviews.length;
  for (let rating = 1; rating <= 5; rating++) {
    const count = reviews.filter(r => r.rating === rating).length;
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    const fill = document.querySelector(`.rating-bar-row:nth-child(${6 - rating}) .bar-fill`);
    const countLabel = document.querySelector(`.rating-bar-row:nth-child(${6 - rating}) span:last-child`);
    if (fill) fill.style.width = `${percent}%`;
    if (countLabel) countLabel.innerText = count;
  }

  // Render recent reviews comments list
  if (!listContainer) return;
  const title = '<h2 class="panel-title">Recent Reviews</h2>';
  if (reviews.length === 0) {
    listContainer.innerHTML = `${title}
      <div class="empty-state" style="padding:3rem 0;"><i class="fas fa-comment-slash"></i>
        <p>No reviews yet</p>
      </div>`;
  } else {
    let reviewsHTML = `<div class="reviews-feed" style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem; max-height: 380px; overflow-y: auto; padding-right:5px;">`;
    reviews.forEach(r => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= r.rating ? '<i class="fas fa-star" style="color:#f59e0b; font-size:0.75rem;"></i>' : '<i class="far fa-star" style="color:#f59e0b; font-size:0.75rem;"></i>';
      }
      reviewsHTML += `
        <div class="review-item glass" style="padding:0.95rem 1.15rem; border-radius:12px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">${r.studentName}</div>
            <div style="font-size:0.7rem; color:var(--text-muted);">${r.date}</div>
          </div>
          <div style="display:flex; gap:3px;">${stars}</div>
          <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; margin:0.25rem 0 0;">"${r.comment}"</p>
        </div>`;
    });
    reviewsHTML += `</div>`;
    listContainer.innerHTML = `${title}${reviewsHTML}`;
  }
}

function populateSettings(mentor) {
  const nameInput = document.getElementById('settings-name');
  const expertiseInput = document.getElementById('settings-expertise');
  const bioInput = document.getElementById('settings-bio');
  const rateInput = document.getElementById('settings-rate');

  if (nameInput) nameInput.value = mentor.name;
  if (expertiseInput) expertiseInput.value = mentor.profile.skills || '';
  if (bioInput) bioInput.value = mentor.profile.bio || '';
  if (rateInput) rateInput.value = mentor.profile.sessionRate || '1000';
}

// Modal handling
function initScheduleModal() {
  const modal = document.getElementById('schedule-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const form = document.getElementById('schedule-form');

  // Overview main schedule trigger
  const mainTrigger = document.querySelector('.dashboard-actions button');
  if (mainTrigger) {
    mainTrigger.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close when clicking overlay backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentName = document.getElementById('schedule-student').value;
      const topic = document.getElementById('schedule-topic').value;
      const date = document.getElementById('schedule-date').value;
      const time = document.getElementById('schedule-time').value;

      fetch('/api/mentor/schedule-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mentorEmail,
          studentName,
          topic,
          dateTime: `${date}T${time}`
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to schedule session');
        return res.json();
      })
      .then(data => {
        modal.classList.remove('active');
        form.reset();
        loadMentorData(); // refresh overview sessions & stats
      })
      .catch(err => {
        console.error(err);
        alert('Could not schedule session. Make sure student name and fields are correct.');
      });
    });
  }
}

// Save Settings logic
function initSettingsForm() {
  const form = document.getElementById('mentor-settings-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('settings-name').value;
    const expertise = document.getElementById('settings-expertise').value;
    const bio = document.getElementById('settings-bio').value;
    const sessionRate = document.getElementById('settings-rate').value;

    fetch('/api/mentor/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: mentorEmail,
        name,
        expertise,
        bio,
        sessionRate
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    })
    .then(data => {
      alert('Profile settings saved successfully!');
      loadMentorData();
    })
    .catch(err => {
      console.error(err);
      alert('Could not save settings.');
    });
  });
}

// Chat system
function initChatSystem() {
  const searchInput = document.querySelector('.chat-search input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.chat-item').forEach(item => {
        const name = item.querySelector('.chat-item-name').innerText.toLowerCase();
        if (name.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

function loadChatRooms() {
  fetch(`/api/mentor/chat-rooms?email=${encodeURIComponent(mentorEmail)}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch rooms');
      return res.json();
    })
    .then(rooms => {
      const chatList = document.querySelector('.chat-list');
      if (!chatList) return;

      if (rooms.length === 0) {
        chatList.innerHTML = `
          <div class="empty-state" style="padding:2rem 0;"><i class="fas fa-inbox"></i>
            <p>No messages yet</p>
          </div>`;
        return;
      }

      let roomsHTML = '';
      rooms.forEach(r => {
        const timeLabel = r.lastMessageTime ? new Date(r.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const initials = r.studentName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const activeClass = activeRoomId === r.roomId ? 'active' : '';

        roomsHTML += `
          <div class="chat-item ${activeClass}" data-room="${r.roomId}" data-student="${r.studentName}">
            <div class="chat-item-avatar">${initials}</div>
            <div class="chat-item-details">
              <div class="chat-item-header">
                <span class="chat-item-name">${r.studentName}</span>
                <span class="chat-item-time">${timeLabel}</span>
              </div>
              <span class="chat-item-text">${r.lastMessageText}</span>
            </div>
          </div>`;
      });
      chatList.innerHTML = roomsHTML;

      // Bind click handlers to chat items
      document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
          document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          activeRoomId = item.getAttribute('data-room');
          activeStudentName = item.getAttribute('data-student');
          openChatRoom(activeRoomId, activeStudentName);
        });
      });
    })
    .catch(err => console.error(err));
}

function openChatRoom(roomId, studentName) {
  const chatMain = document.querySelector('.chat-main');
  if (!chatMain) return;

  chatMain.className = 'chat-main active-chat';
  chatMain.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-avatar">${studentName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}</div>
      <div class="chat-header-info">
        <h3>${studentName}</h3>
        <span>Online</span>
      </div>
    </div>
    <div class="chat-messages-container" id="chat-messages-scroll-area">
      <!-- loaded dynamically -->
    </div>
    <form class="chat-input-area" id="chat-send-form">
      <input type="text" id="chat-message-input" autocomplete="off" required placeholder="Type a message...">
      <button type="submit" class="chat-send-btn"><i class="fas fa-paper-plane"></i></button>
    </form>`;

  loadChatMessages(roomId);

  // Bind form submit
  const sendForm = document.getElementById('chat-send-form');
  if (sendForm) {
    sendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-message-input');
      const text = input.value.trim();
      if (!text) return;

      fetch('/api/mentor/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          studentName,
          sender: 'mentor',
          text
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
      })
      .then(data => {
        input.value = '';
        appendMessageBubble(data.messageData);
        loadChatRooms(); // update last message in sidebar
      })
      .catch(err => console.error(err));
    });
  }
}

function loadChatMessages(roomId) {
  fetch(`/api/mentor/chat-messages?roomId=${encodeURIComponent(roomId)}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load messages');
      return res.json();
    })
    .then(messages => {
      const container = document.getElementById('chat-messages-scroll-area');
      if (!container) return;

      if (messages.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem; font-size:0.75rem; color:var(--text-muted);">No messages yet. Start the conversation!</div>`;
        return;
      }

      let msgsHTML = '';
      messages.forEach(m => {
        const timeLabel = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sideClass = m.sender === 'mentor' ? 'sent' : 'received';
        msgsHTML += `
          <div class="message-row ${sideClass}">
            <div class="message-bubble">
              ${m.text}
              <span class="message-time">${timeLabel}</span>
            </div>
          </div>`;
      });
      container.innerHTML = msgsHTML;
      container.scrollTo(0, container.scrollHeight);
    })
    .catch(err => console.error(err));
}

function appendMessageBubble(m) {
  const container = document.getElementById('chat-messages-scroll-area');
  if (!container) return;

  // Clear "No messages" text
  if (container.querySelector('div')) {
    const isPlaceholderText = container.querySelector('div').style.textAlign === 'center';
    if (isPlaceholderText) container.innerHTML = '';
  }

  const timeLabel = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sideClass = m.sender === 'mentor' ? 'sent' : 'received';

  const div = document.createElement('div');
  div.className = `message-row ${sideClass}`;
  div.innerHTML = `
    <div class="message-bubble">
      ${m.text}
      <span class="message-time">${timeLabel}</span>
    </div>`;

  container.appendChild(div);
  container.scrollTo(0, container.scrollHeight);
}


// ── Mentor Profile Section ────────────────────────────────────────
function loadMentorProfile() {
  fetch(`/api/mentor/dashboard-data?email=${encodeURIComponent(mentorEmail)}`)
    .then(r => r.json())
    .then(data => {
      if (data.error) return;
      const m = data.mentor;
      const p = m.profile || {};
      const s = data.stats || {};

      // Hero banner
      setMpText('mp-display-name', m.name);
      setMpText('mp-display-email', m.email);
      setMpText('mp-display-expertise', p.skills ? p.skills.split(',')[0].trim() : 'Mentor');
      setMpText('mp-session-rate', p.sessionRate ? `₹${p.sessionRate}/hr` : '₹—/hr');
      setMpText('mp-rank-badge', s.rank || 'Expert');

      // Avatar initials
      const avatarEl = document.getElementById('mentor-avatar-circle');
      if (avatarEl) {
        const parts = (m.name || 'M').trim().split(' ');
        const initials = parts.length > 1
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : m.name.slice(0, 2).toUpperCase();
        avatarEl.innerHTML = `<span style="font-family:var(--font-title);font-size:1.6rem;font-weight:700;">${initials}</span>`;
      }

      // Stats
      setMpText('mp-stat-students', s.activeStudents || 0);
      setMpText('mp-stat-sessions', s.sessionsCompleted || 0);
      setMpText('mp-stat-rating', (s.avgRating || 0).toFixed(1));
      setMpText('mp-stat-hours', `${s.totalTeachingHours || 0}h`);

      // Personal info
      setMpText('mpv-name',  m.name  || '—');
      setMpText('mpv-email', m.email || '—');
      setMpText('mpv-rate',  p.sessionRate ? `₹${p.sessionRate}/hr` : '—');
      setMpText('mpv-rank',  s.rank  || '—');
      setMpText('mpv-bio',   p.bio   || 'No bio added yet.');

      // Expertise chips
      const chipsEl = document.getElementById('mp-expertise-chips');
      if (chipsEl) {
        const skills = (p.skills || '').split(',').map(s => s.trim()).filter(Boolean);
        if (skills.length) {
          chipsEl.innerHTML = skills.map(sk =>
            `<span style="padding:0.3rem 0.75rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:rgba(245,158,11,0.1);color:var(--primary);border:1px solid rgba(245,158,11,0.2);">${sk}</span>`
          ).join('');
        } else {
          chipsEl.innerHTML = '<span style="font-size:0.78rem;color:var(--text-muted);font-style:italic;">No expertise added yet. Go to Settings to add.</span>';
        }
      }

      // Students list
      const studentsEl = document.getElementById('mp-students-list');
      if (studentsEl) {
        const students = data.students || [];
        if (students.length) {
          studentsEl.innerHTML = students.map(st => `
            <div class="compact-widget-item">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:28px;height:28px;border-radius:50%;background:rgba(245,158,11,0.1);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;flex-shrink:0;">${st.studentName.slice(0,2).toUpperCase()}</div>
                <div>
                  <div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);">${st.studentName}</div>
                  <div style="font-size:0.68rem;color:var(--text-muted);">${st.goal}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:50px;height:5px;border-radius:3px;background:var(--border-color);overflow:hidden;"><div style="height:100%;width:${st.progress}%;background:var(--primary);border-radius:3px;"></div></div>
                <strong style="font-size:0.75rem;">${st.progress}%</strong>
              </div>
            </div>`).join('');
        } else {
          studentsEl.innerHTML = '<span style="font-size:0.78rem;color:var(--text-muted);">No students assigned yet.</span>';
        }
      }

      // Reviews list
      const reviewsEl = document.getElementById('mp-reviews-list');
      if (reviewsEl) {
        const reviews = (data.reviews || []).slice(0, 4);
        if (reviews.length) {
          reviewsEl.innerHTML = reviews.map(r => {
            const stars = Array.from({length:5}, (_,i) =>
              `<i class="${i < r.rating ? 'fas' : 'far'} fa-star" style="color:#f59e0b;font-size:0.7rem;"></i>`
            ).join('');
            return `
              <div style="padding:0.75rem;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid var(--border-color);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                  <span style="font-size:0.8rem;font-weight:700;color:var(--text-primary);">${r.studentName}</span>
                  <span style="font-size:0.65rem;color:var(--text-muted);">${r.date}</span>
                </div>
                <div style="display:flex;gap:2px;margin-bottom:0.3rem;">${stars}</div>
                <p style="font-size:0.76rem;color:var(--text-secondary);line-height:1.4;margin:0;">"${r.comment}"</p>
              </div>`;
          }).join('');
        } else {
          reviewsEl.innerHTML = '<span style="font-size:0.78rem;color:var(--text-muted);">No reviews yet.</span>';
        }
      }

      // Sessions list
      const sessionsEl = document.getElementById('mp-sessions-list');
      if (sessionsEl) {
        const sessions = (data.sessions || []).slice(0, 4);
        if (sessions.length) {
          sessionsEl.innerHTML = sessions.map(s => {
            const d = new Date(s.dateTime);
            const label = d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
            return `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.75rem;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid var(--border-color);">
                <div>
                  <div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);">${s.topic}</div>
                  <div style="font-size:0.7rem;color:var(--text-muted);">with ${s.studentName}</div>
                </div>
                <div style="font-size:0.75rem;font-weight:600;color:var(--primary);text-align:right;">${label}</div>
              </div>`;
          }).join('');
        } else {
          sessionsEl.innerHTML = '<span style="font-size:0.78rem;color:var(--text-muted);">No upcoming sessions.</span>';
        }
      }
    })
    .catch(err => console.error('Profile load error:', err));
}

function setMpText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
