// shared guest data + fade-in (loaded before script.js / rsvp.js)
let GUESTS = [];

async function loadGuests() {
  const res = await fetch('assets/guests.json');
  GUESTS = await res.json();
}

function findGuestByName(name) {
  const q = name.trim().toLowerCase();
  return GUESTS.find(g => g.name.toLowerCase() === q) || null;
}

function findGuestById(id) {
  return GUESTS.find(g => g.id === parseInt(id)) || null;
}

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-section').forEach(s => {
  s.classList.add('animate-in');
  fadeObserver.observe(s);
});
