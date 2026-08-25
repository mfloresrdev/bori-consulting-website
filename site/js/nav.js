(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  var current = location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(function (a) {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();
