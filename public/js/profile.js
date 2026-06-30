// ================================================================
//  PROFILE PAGE JAVASCRIPT — Adyapan AI
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  initEditToggle();
  initEditForm();
  initResumeUpload();
});

// ── 1. Load all profile data from API ──────────────────────────────
function loadProfileData() {
  const email = localStorage.getItem('userEmail');
  if (!email) { showFallbackData(); return; }

  fetch(`/api/profile/details?email=${encodeURIComponent(email)}`)
    .then(r => r.json())
    .then(data => {
      if (data.error) { showFallbackData(); return; }
      renderProfile(data);
    })
    .catch(() => showFallbackData());
}

function showFallbackData() {
  const name = localStorage.getItem('userName') || 'Student';
  document.getElementById('profile-display-name').textContent = name;
  // Set initials
  setAvatarInitials(name);
  updateCompletion(20);
}

// ── 2. Render profile data into the page ───────────────────────────
function renderProfile(data) {
  const p = data.profile || {};

  // Hero
  setText('profile-display-name', data.name || '—');
  setText('profile-display-college', data.college || '—');
  setText('profile-display-branch',  data.branch  || '—');
  setText('profile-display-year', formatYear(data.year));
  setAvatarInitials(data.name || 'S');

  // View card fields
  setText('view-name',        data.name     || '—');
  setText('view-email',       data.email    || '—');
  setText('view-phone',       data.phone    || '—');
  setText('view-college',     data.college  || '—');
  setText('view-branch',      data.branch   || '—');
  setText('view-year',        formatYear(data.year));
  setText('view-career-goal', p.careerGoal  || '—');
  setText('view-linkedin',    p.linkedin    || '—');
  setText('view-github',      p.github      || '—');
  setText('view-skills',      p.skills      || '—');

  // Pre-fill edit form
  setVal('edit-name',        data.name     || '');
  setVal('edit-phone',       data.phone    || '');
  setVal('edit-college',     data.college  || '');
  setVal('edit-branch',      data.branch   || '');
  setVal('edit-career-goal', p.careerGoal  || '');
  setVal('edit-linkedin',    p.linkedin    || '');
  setVal('edit-github',      p.github      || '');
  setVal('edit-skills',      p.skills      || '');

  // Stats row
  const s = data.stats || {};
  setText('pstat-resume',     (s.resumeScore       || 0) + '/100');
  setText('pstat-interviews', s.interviewsCompleted || 0);
  setText('pstat-career',     (s.careerProgress     || 0) + '%');
  setText('pstat-notes',      s.notesGenerated      || 0);

  // Skills chips
  renderSkills(p.skills || '');

  // Social links
  renderSocialLink('social-linkedin', 'linkedin-url-text', p.linkedin);
  renderSocialLink('social-github',   'github-url-text',   p.github);

  // Resume
  renderResume(data.email, p.resume, s.resumeScore);

  // Activities
  renderActivities(data.activities || []);

  // Profile completion
  const pct = calcCompletion(data);
  updateCompletion(pct);

  // Store name in localStorage in case it changed
  localStorage.setItem('userName', data.name);
}

// ── 3. Avatar initials ─────────────────────────────────────────────
function setAvatarInitials(name) {
  const circle = document.getElementById('profile-avatar-circle');
  if (!circle) return;
  const parts = name.trim().split(' ');
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  circle.innerHTML = `<span style="font-family:var(--font-title);font-size:1.4rem;font-weight:700;">${initials}</span>`;
}

// ── 4. Profile completion ring ────────────────────────────────────
function calcCompletion(data) {
  const p = data.profile || {};
  const fields = [data.name, data.phone, data.college, data.branch, data.year,
    p.careerGoal, p.skills, p.linkedin, p.github,
    p.resume ? 'yes' : ''];
  const filled = fields.filter(f => f && f.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function updateCompletion(pct) {
  const pctEl  = document.getElementById('profile-completion-pct');
  const barEl  = document.getElementById('profile-completion-bar');
  const ringEl = document.getElementById('avatar-ring-fill');
  const bannerEl = document.getElementById('profile-completion-bar');

  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';

  // SVG ring: circumference = 2π × 54 ≈ 339.3
  if (ringEl) {
    const offset = 339.3 * (1 - pct / 100);
    setTimeout(() => { ringEl.style.strokeDashoffset = offset; }, 200);
  }
}

// ── 5. Skills chips ───────────────────────────────────────────────
function renderSkills(skillsStr) {
  const container = document.getElementById('skills-chips');
  if (!container) return;
  const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
  if (!skills.length) {
    container.innerHTML = '<span class="skill-chip-empty">No skills added yet. Edit your profile to add skills.</span>';
    return;
  }
  container.innerHTML = skills.map(s => `<span class="skill-chip">${s}</span>`).join('');
}

// ── 6. Social links ───────────────────────────────────────────────
function renderSocialLink(linkId, textId, url) {
  const link = document.getElementById(linkId);
  const text = document.getElementById(textId);
  if (!link || !text) return;
  if (url && url.startsWith('http')) {
    link.href = url;
    text.textContent = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    link.style.opacity = '1';
  } else {
    link.href = '#';
    text.textContent = 'Not added';
    link.style.opacity = '0.5';
    link.addEventListener('click', e => e.preventDefault());
  }
}

// ── 7. Resume card ────────────────────────────────────────────────
function renderResume(email, resume, atsScore) {
  const emptyEl    = document.getElementById('resume-empty-state');
  const uploadedEl = document.getElementById('resume-uploaded-state');
  const uploadForm = document.getElementById('resume-upload-form');

  if (resume && resume.filename) {
    if (emptyEl)    emptyEl.style.display    = 'none';
    if (uploadedEl) uploadedEl.style.display = 'block';
    setText('resume-filename', resume.filename);
    setText('resume-filemeta', formatBytes(resume.size));
    setText('ats-score-val',   atsScore ? atsScore + '/100' : '—');
    setText('resume-upload-btn-text', 'Replace Resume');

    // Download button
    const dlBtn = document.getElementById('resume-download-btn');
    if (dlBtn) dlBtn.href = `/uploads/${resume.filenameOnDisk}`;

    // Remove button
    const rmBtn = document.getElementById('resume-remove-btn');
    if (rmBtn) {
      rmBtn.onclick = () => removeResume(email);
    }
  } else {
    if (emptyEl)    emptyEl.style.display    = 'flex';
    if (uploadedEl) uploadedEl.style.display = 'none';
  }
}

function removeResume(email) {
  if (!confirm('Remove your resume? Your ATS score will be reset.')) return;
  fetch('/api/profile/remove-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(r => r.json())
    .then(d => { if (!d.error) loadProfileData(); });
}

// ── 8. Activities feed ─────────────────────────────────────────────
function renderActivities(activities) {
  const list = document.getElementById('profile-activity-list');
  if (!list) return;
  if (!activities.length) {
    list.innerHTML = '<div class="activity-item"><div class="activity-dot"></div><div class="activity-details"><p>No recent activity</p></div></div>';
    return;
  }
  const colors = ['var(--primary)', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
  list.innerHTML = activities.slice(0, 8).map((a, i) => {
    const c = colors[i % colors.length];
    return `<div class="activity-item">
      <div class="activity-dot" style="background:${c};box-shadow:0 0 5px ${c};"></div>
      <div class="activity-details">
        <p>${a.title}</p>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`;
  }).join('');
}

// ── 9. Edit toggle ─────────────────────────────────────────────────
function initEditToggle() {
  const toggleBtn  = document.getElementById('profile-edit-toggle');
  const viewCard   = document.getElementById('profile-view-card');
  const editCard   = document.getElementById('profile-edit-card');
  const cancelBtn  = document.getElementById('profile-cancel-btn');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const editing = editCard.style.display !== 'none';
    if (editing) {
      showView(); 
    } else {
      showEdit();
    }
  });

  if (cancelBtn) cancelBtn.addEventListener('click', showView);

  function showEdit() {
    viewCard.style.display = 'none';
    editCard.style.display = 'block';
    toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
    toggleBtn.style.background = 'rgba(239,68,68,0.15)';
    toggleBtn.style.color = '#ef4444';
    toggleBtn.style.border = '1px solid rgba(239,68,68,0.25)';
  }

  function showView() {
    viewCard.style.display = 'block';
    editCard.style.display = 'none';
    toggleBtn.innerHTML = '<i class="fas fa-pen"></i> Edit Profile';
    toggleBtn.style.background = 'var(--primary)';
    toggleBtn.style.color = '#000';
    toggleBtn.style.border = 'none';
  }
}

// ── 10. Save form ─────────────────────────────────────────────────
function initEditForm() {
  const form   = document.getElementById('profile-form');
  const msgEl  = document.getElementById('profile-save-msg');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    const payload = {
      email,
      name:        document.getElementById('edit-name').value.trim(),
      phone:       document.getElementById('edit-phone').value.trim(),
      college:     document.getElementById('edit-college').value.trim(),
      branch:      document.getElementById('edit-branch').value.trim(),
      careerGoal:  document.getElementById('edit-career-goal').value.trim(),
      linkedin:    document.getElementById('edit-linkedin').value.trim(),
      github:      document.getElementById('edit-github').value.trim(),
      skills:      document.getElementById('edit-skills').value.trim(),
    };

    showMsg(msgEl, 'Saving...', 'loading');

    fetch('/api/profile/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) { showMsg(msgEl, d.error, 'error'); return; }
        showMsg(msgEl, 'Profile saved successfully!', 'success');
        localStorage.setItem('userName', payload.name);
        setTimeout(() => loadProfileData(), 600);
      })
      .catch(() => showMsg(msgEl, 'Failed to save. Check your connection.', 'error'));
  });
}

// ── 11. Resume upload ─────────────────────────────────────────────
function initResumeUpload() {
  const input  = document.getElementById('resume-file-input');
  const label  = document.querySelector('.resume-upload-label');
  const msgEl  = document.getElementById('resume-upload-msg');
  if (!input) return;

  // Click label → trigger file input
  label.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file  = input.files[0];
    const email = localStorage.getItem('userEmail');
    if (!file || !email) return;

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      showMsg(msgEl, `File too large. Max size is ${maxMB}MB.`, 'error'); return;
    }

    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      showMsg(msgEl, 'Only PDF and DOCX files are accepted.', 'error'); return;
    }

    showMsg(msgEl, 'Uploading...', 'loading');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('email',  email);

    fetch('/api/profile/upload-resume', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(d => {
        if (d.error) { showMsg(msgEl, d.error, 'error'); return; }
        showMsg(msgEl, `Uploaded! ATS Score: ${d.resumeScore}/100`, 'success');
        setTimeout(() => loadProfileData(), 500);
      })
      .catch(() => showMsg(msgEl, 'Upload failed. Try again.', 'error'));

    input.value = ''; // reset so same file can be re-selected
  });
}

// ── Helpers ───────────────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function formatYear(y) {
  if (!y) return '—';
  const map = { '1':'1st Year','2':'2nd Year','3':'3rd Year','4':'4th Year','Graduated':'Graduated' };
  return map[y] || y;
}

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function showMsg(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className   = `profile-save-message ${type}`;
  el.style.display = 'block';
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 3500);
  }
}
