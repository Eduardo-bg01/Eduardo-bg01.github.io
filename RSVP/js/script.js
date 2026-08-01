let GUESTS = [];
let currentGuest = null;

// ========== DOM REFS ==========
const inviteName = document.getElementById('invite-name');
const inviteCount = document.getElementById('invite-count');
const invitePeople = document.getElementById('invite-people');
const inviteGreeting = document.getElementById('invite-greeting');

const rsvpNotFound = document.getElementById('rsvp-not-found');
const rsvpFound = document.getElementById('rsvp-found');
const rsvpGuestName = document.getElementById('rsvp-guest-name');
const rsvpPartyInfo = document.getElementById('rsvp-party-info');
const rsvpButtons = document.getElementById('rsvp-buttons');
const rsvpResponse = document.getElementById('rsvp-response');
const rsvpResponseText = document.getElementById('rsvp-response-text');
const rsvpPartySelect = document.getElementById('rsvp-party-select');
const rsvpPartyCount = document.getElementById('rsvp-party-count');

// ========== FIND GUEST ==========
function findGuestByName(name) {
  const q = name.trim().toLowerCase();
  let match = GUESTS.find(g => g.name.toLowerCase() === q);
  if (!match) match = GUESTS.find(g => g.name.toLowerCase().includes(q));
  return match || null;
}

function findGuestById(id) {
  return GUESTS.find(g => g.id === parseInt(id)) || null;
}

// ========== SELECT GUEST ==========
function selectGuest(id) {
  const guest = GUESTS.find(g => g.id === id);
  if (!guest) return;
  currentGuest = guest;
  updateInvitation(guest);
  updateRsvp(guest);
}

// ========== UPDATE INVITATION CARD ==========
function updateInvitation(guest) {
  inviteName.textContent = guest.name;
  inviteCount.textContent = guest.party;
  invitePeople.textContent = guest.party === 1 ? 'persona' : 'personas';
  const card = document.querySelector('.invitation-pass');
  card.style.animation = 'none';
  void card.offsetHeight;
  card.style.animation = 'slideUp 1.2s cubic-bezier(0.22, 0.97, 0.36, 1) forwards';
}

// ========== UPDATE RSVP ==========
function updateRsvp(guest) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpResponse.style.display = 'none';
  rsvpButtons.style.display = 'flex';
  rsvpGuestName.textContent = guest.name;
  const p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = `Invitación para ${guest.party} ${p}`;
  if (guest.party > 1) {
    rsvpPartySelect.style.display = 'block';
    rsvpPartyCount.innerHTML = '';
    for (let i = guest.party; i >= 1; i--) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i} ${i === 1 ? 'persona' : 'personas'}`;
      if (i === guest.party) opt.selected = true;
      rsvpPartyCount.appendChild(opt);
    }
  } else {
    rsvpPartySelect.style.display = 'none';
  }
}

// ========== RSVP CONFIRM / DECLINE ==========
document.querySelector('.rsvp-yes')?.addEventListener('click', function () {
  if (!currentGuest) return;
  const count = rsvpPartyCount.value ? parseInt(rsvpPartyCount.value) : currentGuest.party;
  rsvpPartySelect.style.display = 'none';
  rsvpButtons.style.display = 'none';
  rsvpResponse.style.display = 'block';
  const msg = count === 1 ? 'persona' : 'personas';
  rsvpResponseText.textContent = `¡Qué emoción! ${currentGuest.name}, confirmamos ${count} ${msg}.`;
  console.log('RSVP: CONFIRMED', { guest: currentGuest, attending: count });
});

document.querySelector('.rsvp-no')?.addEventListener('click', function () {
  if (!currentGuest) return;
  rsvpPartySelect.style.display = 'none';
  rsvpButtons.style.display = 'none';
  rsvpResponse.style.display = 'block';
  rsvpResponseText.textContent = `${currentGuest.name}, lamentamos que no puedas acompañarnos.`;
  console.log('RSVP: DECLINED', currentGuest);
});

// ========== DRAWER LOGIC ==========
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('side-drawer').classList.remove('-translate-x-full');
});
document.getElementById('close-drawer').addEventListener('click', () => {
  document.getElementById('side-drawer').classList.add('-translate-x-full');
});
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    document.getElementById('side-drawer').classList.add('-translate-x-full');
  }
});
document.querySelectorAll('#side-drawer a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('side-drawer').classList.add('-translate-x-full');
  });
});

// ========== INTERSECTION OBSERVER FOR FADE-IN ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-section').forEach(s => observer.observe(s));

// ========== COUNTDOWN TIMER ==========
(function () {
  // ponytail: fixed offset -07:00 (ceremonia 18:15 en Mexicali, oct 2026 = PDT)
  const target = new Date('2026-10-23T18:15:00-07:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  if (!daysEl) return;

  function pad(n, size) {
    return String(n).padStart(size, '0');
  }

  function updateCountdown() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    daysEl.textContent = pad(days, 3);
    hoursEl.textContent = pad(hours, 2);
    minutesEl.textContent = pad(minutes, 2);
    secondsEl.textContent = pad(seconds, 2);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ========== INIT ==========
(async function init() {
  try {
    const res = await fetch('assets/guests.json');
    GUESTS = await res.json();
  } catch (e) {
    console.error('Failed to load guests.json:', e);
    return;
  }

  // URL param auto-lookup
  const params = new URLSearchParams(window.location.search);

  const guestId = params.get('id');
  if (guestId) {
    const match = findGuestById(guestId);
    if (match) {
      selectGuest(match.id);
      return;
    }
  }

  const guestName = params.get('name');
  if (guestName) {
    const match = findGuestByName(guestName);
    if (match) {
      selectGuest(match.id);
    }
  }
})();
