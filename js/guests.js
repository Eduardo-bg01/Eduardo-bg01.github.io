// shared guest data + fade-in (loaded before script.js / rsvp.js)
let GUESTS = [];

async function loadGuests() {
  const res = await fetch('assets/guests.json');
  GUESTS = await res.json();
}

function findGuestById(id) {
  return GUESTS.find(g => g.id === parseInt(id)) || null;
}

// shared per-page: point custom links to the target page with the guest id
function rewriteRsvpLinks(guest, page) {
  document.querySelectorAll('.rsvp-link, #rsvp-back-link').forEach(a => {
    a.href = page + '.html?id=' + guest.id;
  });
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
