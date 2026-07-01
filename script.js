const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('site-theme');
if (savedTheme === 'dark') { root.setAttribute('data-theme', 'dark'); themeToggle.textContent = '◑'; }

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('site-theme', 'light');
    themeToggle.textContent = '◐';
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('site-theme', 'dark');
    themeToggle.textContent = '◑';
  }
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const header = document.getElementById('siteHeader');
const sections = document.querySelectorAll('section');
const navAnchors = document.querySelectorAll('.nav-links a');
const dotLinks = document.querySelectorAll('.dot-nav a');
const scrollBar = document.getElementById('scrollBar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  backToTop.classList.toggle('show', window.scrollY > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = docHeight > 0 ? `${(window.scrollY / docHeight) * 100}%` : '0%';

  let activeId = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 160;
    if (window.scrollY >= top) activeId = sec.id;
  });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
  dotLinks.forEach(d => d.classList.toggle('active', d.dataset.id === activeId));
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

const statNums = document.querySelectorAll('.stat .num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick); else el.textContent = target;
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statNums.forEach(el => statObserver.observe(el));

const roles = ['AI & ML enthusiast', 'Web developer', 'Open-source contributor', 'Lifelong debugger'];
const twEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    twEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor">&nbsp;</span>';
    if (charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    charIndex--;
    twEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor">&nbsp;</span>';
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectGrid .card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? 'flex' : 'none';
    });
  });
});

document.querySelectorAll('.card.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
