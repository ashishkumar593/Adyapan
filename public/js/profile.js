// Profile Page JS - Adyapan AI

document.addEventListener('DOMContentLoaded', () => {
  initProfileTheme();
  initSidebarToggle();
  hydrateProfileFromServer();
  initResumeUpload();
});

// 1. Dashboard theme sync
function initProfileTheme() {
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
  // Icon visibility is handled by CSS [data-theme] selectors on .icon-sun / .icon-moon SVGs
}

// 2. Hydrate data from Express Server
function hydrateProfileFromServer() {
  const email = localStorage.getItem('userEmail') || 'john.doe@university.edu';
  
  fetch(`/api/profile/details?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        // Fallback to local storage values if not found on server
        initFormTracking();
        return;
      }
      
      // Hydrate forms
      document.getElementById('name').value = data.name || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('phone').value = data.phone || '';
      document.getElementById('college').value = data.college || '';
      document.getElementById('branch').value = data.branch || '';
      
      if (data.profile) {
        document.getElementById('skills').value = data.profile.skills || '';
        document.getElementById('career-goal').value = data.profile.careerGoal || 'Software Engineer';
        document.getElementById('linkedin').value = data.profile.linkedin || '';
        document.getElementById('github').value = data.profile.github || '';

        // Hydrate resume list
        if (data.profile.resume) {
          const fileList = document.getElementById('file-list');
          fileList.innerHTML = `
            <div class="file-item animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                <span>${data.profile.resume.filename} (${(data.profile.resume.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <div class="file-remove" id="remove-resume"><i class="fas fa-trash"></i></div>
            </div>
          `;
          setupRemoveResumeListener();
        }
      }

      document.getElementById('profile-card-name').innerText = data.name || 'John Doe';
      document.getElementById('profile-card-email').innerText = data.email || 'john.doe@university.edu';

      // Start form changes tracker
      initFormTracking();
    })
    .catch(err => {
      console.error('Error fetching profile details:', err);
      initFormTracking();
    });
}

// 3. Profile Completion Progress Calculator
function initFormTracking() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  const trackableFields = [
    'name', 'email', 'phone', 'college', 'branch', 
    'skills', 'career-goal', 'linkedin', 'github'
  ];

  const progressFill = document.getElementById('profile-progress-fill');
  const progressText = document.getElementById('profile-progress-text');
  const progressMuted = document.getElementById('profile-progress-muted');

  const calculateCompletion = () => {
    let completedCount = 0;
    
    trackableFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && field.value.trim() !== '') {
        completedCount++;
      }
    });

    const hasResume = document.querySelector('.file-item') !== null;
    if (hasResume) {
      completedCount++;
    }

    const totalPoints = trackableFields.length + 1;
    const completionPercentage = Math.round((completedCount / totalPoints) * 100);

    if (progressFill) progressFill.style.width = `${completionPercentage}%`;
    if (progressText) progressText.innerText = `${completionPercentage}% Completed`;
    if (progressMuted) progressMuted.innerText = `${100 - completionPercentage}% to go`;
  };

  // Add event listeners to input fields
  trackableFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', calculateCompletion);
      field.addEventListener('change', calculateCompletion);
    }
  });

  // Save profile to Node.js Express server
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const payload = {
      email: email,
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      college: document.getElementById('college').value,
      branch: document.getElementById('branch').value,
      careerGoal: document.getElementById('career-goal').value,
      skills: document.getElementById('skills').value,
      linkedin: document.getElementById('linkedin').value,
      github: document.getElementById('github').value
    };

    fetch('/api/profile/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToastNotification(`Error: ${data.error} ❌`);
        return;
      }
      localStorage.setItem('userName', payload.name); // update header
      showToastNotification("Profile settings saved successfully! 💾");
      calculateCompletion();
    })
    .catch(err => {
      console.error(err);
      showToastNotification("Failed to save profile on server. ❌");
    });
  });

  // Calculate initially
  calculateCompletion();
}

// 4. Resume File Drag and Drop Upload Zone
function initResumeUpload() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('resume-file-input');
  const fileList = document.getElementById('file-list');

  if (!uploadZone || !fileInput || !fileList) return;

  uploadZone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => uploadZone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('dragover'), false);
  });

  uploadZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  fileInput.addEventListener('change', function() {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];

    const allowedExtensions = /(\.pdf|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      showToastNotification("Invalid file type. Only PDF and DOCX files are allowed! ❌");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToastNotification("File size exceeds 5MB limit! ❌");
      return;
    }

    // Upload to server using fetch
    const email = localStorage.getItem('userEmail') || 'john.doe@university.edu';
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('email', email);

    showToastNotification("Uploading resume file... ⏳");

    fetch('/api/profile/upload-resume', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToastNotification(`Upload failed: ${data.error} ❌`);
        return;
      }

      fileList.innerHTML = `
        <div class="file-item animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="file-info">
            <i class="fas fa-file-pdf"></i>
            <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          <div class="file-remove" id="remove-resume"><i class="fas fa-trash"></i></div>
        </div>
      `;

      setupRemoveResumeListener();
      
      // Update form completion and trigger change
      const nameField = document.getElementById('name');
      if (nameField) {
        nameField.dispatchEvent(new Event('change'));
      }

      showToastNotification(`Resume uploaded successfully! ATS Score: ${data.resumeScore} 📄`);
    })
    .catch(err => {
      console.error(err);
      showToastNotification("Network error. Upload failed. ❌");
    });
  }
}

function setupRemoveResumeListener() {
  const removeBtn = document.getElementById('remove-resume');
  if (!removeBtn) return;

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const email = localStorage.getItem('userEmail') || 'john.doe@university.edu';
    
    fetch('/api/profile/remove-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToastNotification(`Error: ${data.error} ❌`);
        return;
      }

      document.getElementById('file-list').innerHTML = '';
      document.getElementById('resume-file-input').value = '';

      // Trigger recalculate progress
      const nameField = document.getElementById('name');
      if (nameField) {
        nameField.dispatchEvent(new Event('change'));
      }

      showToastNotification("Resume removed from server. 🗑️");
    })
    .catch(err => {
      console.error(err);
      showToastNotification("Failed to delete resume. ❌");
    });
  });
}

// Simple Toast Notification
function showToastNotification(message) {
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

// Collapsible Sidebar
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
      if (!sidebar.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
        sidebar.classList.remove('active');
      }
    }
  });

  // Prevent background scroll when hovering over the sidebar on desktop
  if (sidebar) {
    sidebar.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        document.body.style.overflow = 'hidden';
      }
    });
    sidebar.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        document.body.style.overflow = '';
      }
    });
  }
}
