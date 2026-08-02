let currentGuest = null;

// ========== DOM REFS ==========
const rsvpNotFound = document.getElementById('rsvp-not-found');
const rsvpFound = document.getElementById('rsvp-found');
const rsvpGuestName = document.getElementById('rsvp-guest-name');
const rsvpPartyInfo = document.getElementById('rsvp-party-info');
const rsvpButtons = document.getElementById('rsvp-buttons');
const rsvpResponse = document.getElementById('rsvp-response');
const rsvpResponseText = document.getElementById('rsvp-response-text');
const rsvpPartySelect = document.getElementById('rsvp-party-select');
const rsvpPartyCount = document.getElementById('rsvp-party-count');

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
      currentGuest = match;
      updateRsvp(match);
      return;
    }
  }

  const guestName = params.get('name');
  if (guestName) {
    const match = findGuestByName(guestName);
    if (match) {
      currentGuest = match;
      updateRsvp(match);
    }
  }
})();
