document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('home');
  const dashboard = document.getElementById('dashboard');
  const navLinks = document.querySelectorAll('[data-nav]');

  function showSection(target) {
    home.classList.add('hidden');
    dashboard.classList.add('hidden');
    if (target === 'home') {
      home.classList.remove('hidden');
    } else if (target === 'dashboard') {
      dashboard.classList.remove('hidden');
    }
  }

  showSection('home');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      showSection(target);
    });
  });
});