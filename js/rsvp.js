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
const rsvpError = document.getElementById('rsvp-error');
const rsvpClosed = document.getElementById('rsvp-closed');

// ========== DEADLINE ==========
// ponytail: deadline Oct 10 2026 Mexicali (PDT, UTC-7)
const DEADLINE = new Date('2026-10-11T00:00:00-07:00');

function isPastDeadline() {
  return Date.now() >= DEADLINE.getTime();
}

// ========== EMAIL via FormSubmit.co ==========
function sendRsvpEmail(guest, response, count) {
  const body = new URLSearchParams();
  body.set('_subject', 'RSVP: ' + guest.name + ' - ' + response);
  body.set('_cc', 'ntrevino@uabc.edu.mx,ebeltran8@uabc.edu.mx');
  body.set('_captcha', 'false');
  body.set('_template', 'table');
  body.set('Invitado', guest.name);
  body.set('Respuesta', response);
  body.set('Asistentes', count);
  body.set('Mensaje', guest.name + ' ' + (response === 'SÍ, ASISTIRÉ' ? 'confirmó' : 'declinó') + ' asistencia para ' + count + ' persona(s).');

  fetch('https://formsubmit.co/ajax/pgmbeltraneduardo@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  }).catch(function () {});
}

// ========== REWRITE BACK LINK ==========
function rewriteRsvpLinks(guest) {
  document.querySelectorAll('.rsvp-link, #rsvp-back-link').forEach(a => {
    a.href = `index.html?id=${guest.id}`;
  });
}

// ========== LOCALSTORAGE HELPERS ==========
function getStoredResponse(guestId) {
  return localStorage.getItem('rsvp_' + guestId);
}

function getStoredCount(guestId) {
  return localStorage.getItem('rsvp_count_' + guestId);
}

function hasResponded(guestId) {
  return getStoredResponse(guestId) !== null;
}

function markResponded(guestId, response, count) {
  localStorage.setItem('rsvp_' + guestId, response);
  if (count != null) localStorage.setItem('rsvp_count_' + guestId, String(count));
}

// ========== SHOW ALREADY RESPONDED ==========
function showAlreadyResponded(guest, response, count) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpButtons.style.display = 'none';
  rsvpPartySelect.style.display = 'none';
  rsvpResponse.style.display = 'block';
  rsvpGuestName.textContent = guest.name;
  var p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + p;
  var msg = count + ' ' + (count === 1 ? 'persona' : 'personas');
  if (response === 'SÍ, ASISTIRÉ') {
    rsvpResponseText.textContent = '¡Qué emoción! ' + guest.name + ', confirmamos ' + msg + '.';
  } else {
    rsvpResponseText.textContent = guest.name + ', lamentamos que no puedas acompañarnos.';
  }
}

// ========== SHOW CLOSED ==========
function showClosed(guest) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpButtons.style.display = 'none';
  rsvpPartySelect.style.display = 'none';
  rsvpGuestName.textContent = guest.name;
  var p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + p;
  rsvpClosed.style.display = 'block';
}

// ========== UPDATE RSVP ==========
function updateRsvp(guest) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpResponse.style.display = 'none';
  rsvpError.style.display = 'none';
  rsvpButtons.style.display = 'flex';
  rsvpGuestName.textContent = guest.name;
  var p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + p;
  if (guest.party > 1) {
    rsvpPartySelect.style.display = 'block';
    rsvpPartyCount.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona';
    placeholder.disabled = true;
    placeholder.selected = true;
    rsvpPartyCount.appendChild(placeholder);
    var max = Math.min(guest.party, 4);
    for (var i = 1; i <= max; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + ' ' + (i === 1 ? 'persona' : 'personas');
      rsvpPartyCount.appendChild(opt);
    }
  } else {
    rsvpPartySelect.style.display = 'none';
  }
}

// ========== RSVP CONFIRM / DECLINE ==========
document.querySelector('.rsvp-yes')?.addEventListener('click', function () {
  if (!currentGuest) return;
  if (currentGuest.party > 1 && rsvpPartyCount.value === '') {
    rsvpError.style.display = 'block';
    return;
  }
  rsvpError.style.display = 'none';
  var count = currentGuest.party > 1 ? parseInt(rsvpPartyCount.value) : 1;
  markResponded(currentGuest.id, 'SÍ, ASISTIRÉ', count);
  sendRsvpEmail(currentGuest, 'SÍ, ASISTIRÉ', count);
  rsvpPartySelect.style.display = 'none';
  rsvpButtons.style.display = 'none';
  rsvpResponse.style.display = 'block';
  var msg = count === 1 ? 'persona' : 'personas';
  rsvpResponseText.textContent = '¡Qué emoción! ' + currentGuest.name + ', confirmamos ' + count + ' ' + msg + '.';
});

document.querySelector('.rsvp-no')?.addEventListener('click', function () {
  if (!currentGuest) return;
  markResponded(currentGuest.id, 'NO PODRÉ', currentGuest.party);
  sendRsvpEmail(currentGuest, 'NO PODRÉ', currentGuest.party);
  rsvpPartySelect.style.display = 'none';
  rsvpButtons.style.display = 'none';
  rsvpResponse.style.display = 'block';
  rsvpResponseText.textContent = currentGuest.name + ', lamentamos que no puedas acompañarnos.';
});

// ========== INIT ==========
(async function init() {
  try {
    await loadGuests();
  } catch (e) {
    console.error('Failed to load guests.json:', e);
    return;
  }

  var params = new URLSearchParams(window.location.search);

  var guestId = params.get('id');
  if (guestId) {
    var match = findGuestById(guestId);
    if (match) {
      currentGuest = match;
      rewriteRsvpLinks(match);

      // Check JSON confirm first (source of truth after manual update)
      if (match.confirm !== null) {
        var count = match.party_confirmed || match.party;
        showAlreadyResponded(match, match.confirm === 'yes' ? 'SÍ, ASISTIRÉ' : 'NO PODRÉ', count);
        return;
      }

      // Then check localStorage (device-level lock before JSON update)
      if (hasResponded(match.id)) {
        var stored = getStoredResponse(match.id);
        var storedCount = getStoredCount(match.id) || match.party;
        showAlreadyResponded(match, stored, parseInt(storedCount));
        return;
      }

      // Deadline gate
      if (isPastDeadline()) {
        showClosed(match);
        return;
      }

      updateRsvp(match);
      return;
    }
  }


})();
