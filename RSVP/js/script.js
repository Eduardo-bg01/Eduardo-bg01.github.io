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

// ========== NAVBAR HIDE ON SCROLL (desktop) ==========
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (window.innerWidth >= 768) {
      nav.classList.toggle('nav-hidden', y > lastY && y > 120);
    }
    lastY = y;
  }, { passive: true });
})();

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

// ========== ENVELOPE: reveal + navigate ==========
const envelope = document.querySelector('.invitation-pass.rsvp-link');
if (envelope) {
  envelope.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.add('open');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { window.location.href = this.href; }, reduced ? 0 : 700);
  });
}

// ========== POLAROID CAROUSEL (solo retrato) ==========
(function () {
  const carousel = document.getElementById('polaroid-carousel');
  if (!carousel) return;
  const items = Array.from(carousel.querySelectorAll('.polaroid'));
  const mq = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
  let idx = 0;

  function render() {
    items.forEach((el, i) => {
      let off = (i - idx) % items.length;
      if (off > 1) off -= items.length;
      if (off < -1) off += items.length;
      el.dataset.pos = off === -1 ? '-1' : off === 0 ? '0' : off === 1 ? '1' : 'away';
    });
  }

  function apply() {
    if (mq.matches) render();
    else items.forEach(el => delete el.dataset.pos);
  }

  mq.addEventListener('change', apply);
  apply();

  carousel.addEventListener('click', () => {
    if (!mq.matches) return;
    idx = (idx + 1) % items.length;
    render();
  });
})();

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
