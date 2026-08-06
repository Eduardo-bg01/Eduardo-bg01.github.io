// ========== DOM REFS ==========
const inviteName = document.getElementById('invite-name');
const inviteCount = document.getElementById('invite-count');
const invitePeople = document.getElementById('invite-people');

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

// ========== REWRITE RSVP LINKS ==========
function rewriteRsvpLinks(guest) {
  document.querySelectorAll('.rsvp-link').forEach(a => {
    a.href = `rsvp.html?id=${guest.id}`;
  });
}

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

// ========== COUNTDOWN TIMER ==========
(function () {
  // ponytail: fixed offset -07:00 (ceremonia 18:15 en Mexicali, oct 2026 = PDT)
  const target = new Date('2026-10-23T18:15:00-07:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  if (!daysEl) return;

  function updateCountdown() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    daysEl.textContent = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ========== INIT ==========
(async function init() {
  try {
    await loadGuests();
  } catch (e) {
    console.error('Failed to load guests.json:', e);
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const guestId = params.get('id');
  if (guestId) {
    const match = findGuestById(guestId);
    if (match) {
      updateInvitation(match);
      rewriteRsvpLinks(match);
      return;
    }
  }

  const guestName = params.get('name');
  if (guestName) {
    const match = findGuestByName(guestName);
    if (match) {
      updateInvitation(match);
      rewriteRsvpLinks(match);
    }
  }
})();
