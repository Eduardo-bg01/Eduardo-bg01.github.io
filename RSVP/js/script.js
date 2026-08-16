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

// ========== ENVELOPE: drag (touch) + tap (navigate) ==========
const envelope = document.querySelector('.invitation-pass.rsvp-link');
if (envelope) {
  const card = envelope.querySelector('.env-card');
  const ENV_OUT = -100;

  function navigate() {
    envelope.classList.add('open');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { window.location.href = envelope.href; }, reduced ? 0 : 700);
  }

  // true drags set dataset.dragged to suppress the click that follows
  envelope.addEventListener('click', function (e) {
    e.preventDefault();
    if (envelope.dataset.dragged) { delete envelope.dataset.dragged; return; }
    navigate();
  });

  // ponytail: touchmove preventDefault (passive:false) is the real scroll-blocker; touch-action:none in CSS is a second layer.
  function basePct() {
    const m = getComputedStyle(card).transform;
    if (m === 'none') return 0;
    const y = parseFloat(m.split(',')[5]) || 0;
    return card.offsetHeight ? (y / card.offsetHeight) * 100 : 0;
  }
  // resting position (what CSS gives without .open), used as the "in" snap target
  function restPct() {
    const wasOpen = envelope.classList.contains('open');
    if (wasOpen) envelope.classList.remove('open');
    const v = basePct();
    if (wasOpen) envelope.classList.add('open');
    return v;
  }

  let y0 = null, from = 0, home = 0, curPct = 0, dragging = false;
  envelope.addEventListener('touchstart', e => {
    delete envelope.dataset.dragged;
    y0 = e.touches[0].clientY;
    from = curPct = basePct();
    home = restPct();
    dragging = false;
  }, { passive: true });
  envelope.addEventListener('touchmove', e => {
    if (y0 === null) return;
    const dy = e.touches[0].clientY - y0;
    if (!dragging && Math.abs(dy) < 10) return;
    dragging = true;
    e.preventDefault();
    card.style.transition = 'none';
    curPct = Math.max(ENV_OUT, Math.min(-15, from + (dy / card.offsetHeight) * 100));
    card.style.transform = `translateY(${curPct}%)`;
  }, { passive: false });
  envelope.addEventListener('touchend', () => {
    if (y0 === null) return;
    y0 = null;
    if (!dragging) return;
    dragging = false;
    envelope.dataset.dragged = '1';
    const out = curPct <= -70;
    card.style.transition = '';
    card.style.transform = `translateY(${out ? ENV_OUT : home}%)`;
    envelope.classList.toggle('open', out);
    setTimeout(() => { card.style.transform = ''; }, 450);
  });
  envelope.addEventListener('touchcancel', () => {
    y0 = null;
    dragging = false;
    card.style.transition = '';
    card.style.transform = '';
  });
}

// ========== POLAROID CAROUSEL (solo retrato) ==========
(function () {
  const carousel = document.getElementById('polaroid-carousel');
  if (!carousel) return;
  const items = Array.from(carousel.querySelectorAll('.polaroid'));
  const mq = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
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

  // swipe flips photos, tap/click advances (portrait only)
  // ponytail: touchmove preventDefault (passive:false) claims horizontal drags so the page can't slide; click covers taps + desktop.
  let tx = null, ty = null, didSwipe = false;
  carousel.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    didSwipe = false;
  }, { passive: true });
  carousel.addEventListener('touchmove', e => {
    if (tx === null) return;
    const dx = e.touches[0].clientX - tx;
    const dy = e.touches[0].clientY - ty;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }, { passive: false });
  carousel.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    tx = ty = null;
    if (!mq.matches) return;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      didSwipe = true;
      idx = (idx + (dx > 0 ? -1 : 1) + items.length) % items.length;
      render();
    }
  }, { passive: true });
  carousel.addEventListener('click', () => {
    if (didSwipe) { didSwipe = false; return; }
    if (mq.matches) {
      idx = (idx + 1) % items.length;
      render();
    }
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

  function updateCountdown() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    daysEl.textContent = String(days).padStart(2, '0');
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
