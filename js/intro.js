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

  let opening = false;

  function finish() {
    intro.classList.add('is-done');
  }

  seal.addEventListener('click', function () {
    if (opening) return;
    opening = true;
    sessionStorage.setItem(SEEN_KEY, '1');
    intro.classList.add('is-opening');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTimeout(function () { intro.classList.add('is-fading'); finish(); }, 300);
      return;
    }

    setTimeout(function () { intro.classList.add('is-fading'); }, 1800);
    setTimeout(finish, 2500);
  });
})();
