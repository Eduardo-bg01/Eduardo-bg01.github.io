// ponytail: intro shows once per tab-session (internal nav/reload skips it, fresh open shows it)
(function () {
  const intro = document.getElementById('intro-screen');
  const seal = intro && intro.querySelector('.wax-seal');
  if (!intro || !seal) return;

  const SEEN_KEY = 'wedding_intro_seen';
  if (sessionStorage.getItem(SEEN_KEY)) {
    intro.classList.add('is-done');
    return;
  }

  document.body.classList.add('no-scroll');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opening = false;

  function finish() {
    document.body.classList.remove('no-scroll');
    intro.classList.add('is-done');
  }

  seal.addEventListener('click', function () {
    if (opening) return;
    opening = true;
    sessionStorage.setItem(SEEN_KEY, '1');
    intro.classList.add('is-opening');

    if (reducedMotion) {
      setTimeout(function () { intro.classList.add('is-fading'); finish(); }, 300);
      return;
    }

    // flap + bottom open (~1.9s), hold the photo, then fade out
    setTimeout(function () { intro.classList.add('is-fading'); }, 2200);
    setTimeout(finish, 2900);
  });
})();
