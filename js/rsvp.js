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
  }).catch(function () {}); // ponytail: fire-and-forget
}

// ========== REWRITE BACK LINK ==========
function rewriteRsvpLinks(guest) {
  document.querySelectorAll('.rsvp-link, #rsvp-back-link').forEach(a => {
    a.href = `index.html?id=${guest.id}`;
  });
}

// ========== DUPLICATE PREVENTION ==========
function hasResponded(guestId) {
  return localStorage.getItem('rsvp_' + guestId) !== null;
}

function markResponded(guestId, response) {
  localStorage.setItem('rsvp_' + guestId, response);
}

// ========== SHOW ALREADY RESPONDED ==========
function showAlreadyResponded(guest, response) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpButtons.style.display = 'none';
  rsvpPartySelect.style.display = 'none';
  rsvpResponse.style.display = 'block';
  rsvpGuestName.textContent = guest.name;
  var p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + p;
  if (response === 'SÍ, ASISTIRÉ') {
    rsvpResponseText.textContent = '¡Qué emoción! ' + guest.name + ', ya confirmaste tu asistencia.';
  } else {
    rsvpResponseText.textContent = guest.name + ', ya registraste tu respuesta.';
  }
}

// ========== UPDATE RSVP ==========
function updateRsvp(guest) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpResponse.style.display = 'none';
  rsvpButtons.style.display = 'flex';
  rsvpGuestName.textContent = guest.name;
  var p = guest.party === 1 ? 'persona' : 'personas';
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + p;
  if (guest.party > 1) {
    rsvpPartySelect.style.display = 'block';
    rsvpPartyCount.innerHTML = '';
    for (var i = guest.party; i >= 1; i--) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + ' ' + (i === 1 ? 'persona' : 'personas');
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
  var count = rsvpPartyCount.value ? parseInt(rsvpPartyCount.value) : currentGuest.party;
  markResponded(currentGuest.id, 'SÍ, ASISTIRÉ');
  sendRsvpEmail(currentGuest, 'SÍ, ASISTIRÉ', count);
  rsvpPartySelect.style.display = 'none';
  rsvpButtons.style.display = 'none';
  rsvpResponse.style.display = 'block';
  var msg = count === 1 ? 'persona' : 'personas';
  rsvpResponseText.textContent = '¡Qué emoción! ' + currentGuest.name + ', confirmamos ' + count + ' ' + msg + '.';
});

document.querySelector('.rsvp-no')?.addEventListener('click', function () {
  if (!currentGuest) return;
  markResponded(currentGuest.id, 'NO PODRÉ');
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
      if (hasResponded(match.id)) {
        showAlreadyResponded(match, localStorage.getItem('rsvp_' + match.id));
      } else {
        updateRsvp(match);
      }
      return;
    }
  }


})();
