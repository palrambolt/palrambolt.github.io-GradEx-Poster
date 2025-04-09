const mask = document.getElementById('mask');
const sections = document.querySelectorAll('.section');

let x = 0;
let y = 0;
let radius = 150;
let shapeIndex = 0;
const shapes = ['circle', 'cross', 'square'];
let clickTimeout = null;

function updateMask() {
  mask.style.setProperty('--x', `${x}px`);
  mask.style.setProperty('--y', `${y}px`);
  mask.style.setProperty('--radius', `${radius}px`);
  mask.setAttribute('data-shape', shapes[shapeIndex % shapes.length]);
}

// Move mask with cursor
window.addEventListener('mousemove', (e) => {
  x = e.clientX;
  y = e.clientY;
  updateMask();
});

// Scroll to resize flashlight
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  radius += e.deltaY * -0.2;
  radius = Math.max(50, Math.min(300, radius));
  updateMask();
}, { passive: false });

// Click to change shape
window.addEventListener('click', () => {
  if (clickTimeout) return;
  clickTimeout = setTimeout(() => {
    shapeIndex++;
    updateMask();
    clickTimeout = null;
  }, 250);
});

// Double-click to highlight closest section
window.addEventListener('dblclick', () => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }

  let closestSection = null;
  let minDist = Infinity;          

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - centerX, y - centerY);
    if (dist < minDist) {
      minDist = dist;
      closestSection = section;
    }
  });

  if (closestSection) {
    document.body.classList.add('revealing');
    closestSection.classList.add('reveal');

    setTimeout(() => {
      document.body.classList.remove('revealing');
      closestSection.classList.remove('reveal');
    }, 3000);
  }
});
