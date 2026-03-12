// theme.js - Handles Light/Dark Mode toggling

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Check for saved user preference, else check OS preference
  const savedTheme = localStorage.getItem('theme');
  const osPreference = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initialTheme = savedTheme || osPreference;

  document.documentElement.setAttribute('data-theme', initialTheme);
  updateButtonIcon(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let currentTheme = document.documentElement.getAttribute('data-theme');
      let targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      updateButtonIcon(targetTheme);
    });
  }

  function updateButtonIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  }

  // Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const nNav = document.querySelector('.n-nav');
  if (mobileMenuBtn && nNav) {
    mobileMenuBtn.addEventListener('click', () => {
      nNav.classList.toggle('nav-open');
    });
  }

  // Avatar Upload / Preview Logic
  const avatarUpload = document.getElementById('avatar-upload');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarPlaceholder = document.getElementById('avatar-placeholder');
  
  if (avatarUpload && avatarPreview && avatarPlaceholder) {
    const savedAvatar = sessionStorage.getItem('localUserAvatar');
    if (savedAvatar) {
      avatarPreview.src = savedAvatar;
      avatarPreview.style.display = 'block';
      avatarPlaceholder.style.display = 'none';
    }

    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const res = evt.target.result;
          avatarPreview.src = res;
          avatarPreview.style.display = 'block';
          avatarPlaceholder.style.display = 'none';
          try {
            sessionStorage.setItem('localUserAvatar', res);
          } catch(err) {
            console.warn('File too large for sessionStorage');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Project Media Upload Logic
  const mediaInputs = document.querySelectorAll('.pe-media-input');
  mediaInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const targetId = input.getAttribute('data-target');
      const targetGrid = document.getElementById(targetId);
      if (!targetGrid) return;
      
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const fileData = evt.target.result;
          const col = document.createElement('div');
          
          // Use 'gallery-item' for main gallery and 'pe-media-item' for project gallery
          if (targetGrid.classList.contains('gallery-grid')) {
            col.className = 'gallery-item';
          } else {
            col.className = 'pe-media-item';
          }
          
          if (file.type.startsWith('video/')) {
            const vid = document.createElement('video');
            vid.src = fileData;
            vid.controls = true;
            vid.autoplay = true;
            vid.muted = true;
            vid.loop = true;
            col.appendChild(vid);
          } else {
            const img = document.createElement('img');
            img.src = fileData;
            col.appendChild(img);
          }
          
          // Insert before the dropzone
          const dropzone = targetGrid.querySelector('.pe-media-dropzone');
          if (dropzone) {
            targetGrid.insertBefore(col, dropzone);
          } else {
            targetGrid.appendChild(col);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Reset input to allow uploading same file again
      input.value = '';
    });
  });

});
