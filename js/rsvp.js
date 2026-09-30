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
const rsvpDeadline = document.getElementById('rsvp-deadline');

// ========== HELPERS ==========
// deadline oct 1 2026 Mexicali (PDT, UTC-7)
const DEADLINE = new Date('2026-10-01T00:00:00-07:00');

function isPastDeadline() {
  return Date.now() >= DEADLINE.getTime();
}

function plural(n) {
  return n === 1 ? 'persona' : 'personas';
}

function setGuestHeader(guest) {
  rsvpGuestName.textContent = guest.name;
  rsvpPartyInfo.textContent = 'Invitación para ' + guest.party + ' ' + plural(guest.party);
}

// ========== EMAIL: FormSubmit primary, Web3Forms fallback ==========
// ponytail: two providers, first success wins. Add a third by appending to the array.
const RSVP_ACCESS_KEY = '7b37018e-e65b-48bd-bd79-9865114a72bd'; // free at https://web3forms.com

function rsvpCommon(body, guest, response, count) {
  body.set('Invitado', guest.name);
  body.set('Respuesta', response);
  body.set('Asistentes', count);
  body.set('Mensaje', guest.name + ' ' + (response === 'SÍ, ASISTIRÉ' ? 'confirmó' : 'declinó') + ' asistencia para ' + count + ' persona(s).');
}

function formsubmitBody(guest, response, count) {
  var b = new URLSearchParams();
  b.set('_subject', 'RSVP: ' + guest.name + ' - ' + response);
  b.set('_url', 'https://natalia-y-eduardo.com.mx/rsvp.html');
  b.set('_honey', 'no-fill');
  b.set('_captcha', 'false');
  b.set('_template', 'table');
  rsvpCommon(b, guest, response, count);
  return b;
}

function web3formsBody(guest, response, count) {
  var b = new URLSearchParams();
  b.set('access_key', RSVP_ACCESS_KEY);
  b.set('subject', 'RSVP: ' + guest.name + ' - ' + response);
  rsvpCommon(b, guest, response, count);
  return b;
}

const RSVP_PROVIDERS = [
  { name: 'formsubmit', endpoint: 'https://formsubmit.co/ajax/pgmbeltraneduardo@gmail.com', build: formsubmitBody },
  { name: 'web3forms',  endpoint: 'https://api.web3forms.com/submit',                       build: web3formsBody }
];

// ponytail: never swallow this. formsubmit.co started returning 500 for every
// guest and an empty .catch() hid it for weeks. Read text not json because
// formsubmit answers errors with HTML, which would make res.json() reject.
function postForm(endpoint, body) {
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: body.toString()
  })
    .then(function (res) {
      return res.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (e) { /* HTML error page */ }
        // ponytail: some services reply 200 with a failure body, so trust the JSON too
        return { ok: res.ok && (!json || json.success !== false), status: res.status, json: json };
      });
    })
    .catch(function (err) { return { ok: false, status: 0, error: String(err) }; });
}

// ponytail: global chain, no retries beyond the provider list.
function sendRsvpEmail(guest, response, count) {
  return RSVP_PROVIDERS.reduce(function (chain, p) {
    return chain.then(function (prev) {
      if (prev && prev.ok) return prev; // first success wins, never send twice
      return postForm(p.endpoint, p.build(guest, response, count)).then(function (r) {
        r.provider = p.name;
        if (!r.ok) console.warn('[RSVP] ' + p.name + ' falló, probando el siguiente', r);
        return r;
      });
    });
  }, Promise.resolve(null)).then(function (r) {
    console.log(r && r.ok ? '[RSVP] email enviada via ' + r.provider : '[RSVP] email FALLÓ en todos los proveedores', r);
    return r;
  });
}

// self-check: open rsvp.html, run testRsvpEmail() in the console, read the log.
// Never leaves a fake RSVP behind because it bypasses localStorage.
window.testRsvpEmail = function () {
  return sendRsvpEmail({ name: '[PRUEBA] Sin nombre' }, 'SÍ, ASISTIRÉ', 1);
};

// ========== LOCALSTORAGE ==========
function markResponded(guestId, response, count) {
  localStorage.setItem('rsvp_' + guestId, response);
  if (count != null) localStorage.setItem('rsvp_count_' + guestId, String(count));
}

// ========== SHOW LOCKED STATE (already responded OR closed) ==========
function showLocked(guest, response, count) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpButtons.style.display = 'none';
  rsvpPartySelect.style.display = 'none';
  rsvpDeadline.style.display = 'none';
  setGuestHeader(guest);
  if (response === null) {
    rsvpClosed.style.display = 'block';
    return;
  }
  rsvpResponse.style.display = 'block';
  var msg = count + ' ' + plural(count);
  rsvpResponseText.textContent = response === 'SÍ, ASISTIRÉ'
    ? '¡Qué emoción! ' + guest.name + ', confirmamos ' + msg + '.'
    : guest.name + ', lamentamos que no puedas acompañarnos.';
}

// ========== UPDATE RSVP (live form) ==========
function updateRsvp(guest) {
  rsvpNotFound.style.display = 'none';
  rsvpFound.style.display = 'block';
  rsvpResponse.style.display = 'none';
  rsvpError.style.display = 'none';
  rsvpButtons.style.display = 'flex';
  setGuestHeader(guest);
  if (guest.party > 1) {
    rsvpPartySelect.style.display = 'block';
    rsvpPartyCount.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona';
    placeholder.disabled = true;
    placeholder.selected = true;
    rsvpPartyCount.appendChild(placeholder);
    var max = Math.min(guest.party, 5);
    for (var i = 1; i <= max; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + ' ' + plural(i);
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
  rsvpResponseText.textContent = '¡Qué emoción! ' + currentGuest.name + ', confirmamos ' + count + ' ' + plural(count) + '.';
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
  const match = await getGuestFromUrl();
  if (!match) return;
  currentGuest = match;
  rewriteRsvpLinks(match, 'index');

  // Check JSON confirm first (source of truth after manual update)
  if (match.confirm !== null) {
    var count = match.party_confirmed || match.party;
    showLocked(match, match.confirm === 'yes' ? 'SÍ, ASISTIRÉ' : 'NO PODRÉ', count);
    return;
  }

  // Then check localStorage (device-level lock before JSON update)
  if (localStorage.getItem('rsvp_' + match.id) !== null) {
    var stored = localStorage.getItem('rsvp_' + match.id);
    var storedCount = localStorage.getItem('rsvp_count_' + match.id) || match.party;
    showLocked(match, stored, parseInt(storedCount));
    return;
  }

  // Deadline gate
  if (isPastDeadline()) {
    showLocked(match, null);
    return;
  }

  updateRsvp(match);
})();
