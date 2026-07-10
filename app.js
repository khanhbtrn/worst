/**
 * Probably Fine™ — intentionally hostile UX
 * Every interaction is designed to frustrate. Do not use as a reference.
 */

const EMOJIS = ['😤', '💢', '🔥', '⚠️', '❌', '🌀', '👎', '😵'];
const LOADING_MSGS = [
  'Loading your disappointment...',
  'Reticulating splines...',
  'Downloading more RAM...',
  'Almost done (lying)...',
  'Buffering regret...',
  'Optimizing frustration...',
  'Syncing bad decisions...',
];

const CAPTCHA_WORDS = ['hope', 'joy', 'peace', 'calm', 'trust'];
const CAPTCHA_EMOJIS = ['🌈', '☀️', '🕊️', '😊', '💀', '🔥', '🌪️', '😈', '🦄', '🍕', '👻', '🎪'];

let wrongCaptchaAttempts = 0;
let captchaSolution = [];
let audioCtx = null;

// --- Audio torture (subtle beeps) ---
function beep(freq = 200, duration = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'square';
    gain.gain.value = 0.08;
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) { /* silent fail */ }
}

// --- Fake loading ---
function runFakeLoading() {
  const overlay = document.getElementById('loading-hell');
  const bar = document.getElementById('fake-progress-bar');
  const text = document.getElementById('loading-text');
  let progress = 0;
  let direction = 1;

  const interval = setInterval(() => {
    progress += direction * (Math.random() * 15 + 5);
    if (progress >= 100) {
      progress = 100;
      direction = -1;
      text.textContent = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)];
    }
    if (progress <= 0) {
      progress = 0;
      direction = 1;
    }
    bar.style.width = progress + '%';
  }, 200);

  setTimeout(() => {
    clearInterval(interval);
    overlay.classList.add('hidden');
    showWelcomeModal();
  }, 3500);
}

// --- Welcome modal riddle ---
function showWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  modal.style.display = 'flex';
  document.getElementById('riddle-answer').focus();
}

document.getElementById('riddle-submit').addEventListener('click', () => {
  const answer = document.getElementById('riddle-answer').value.trim().toLowerCase();
  const feedback = document.getElementById('riddle-feedback');
  beep(150);

  if (answer === 'close' || answer === 'skip' || answer === '42') {
    feedback.textContent = 'Wrong! The answer is obviously "african or european".';
  } else if (answer.includes('african') || answer.includes('european') || answer.includes('swallow')) {
    feedback.textContent = 'Still wrong! Try again. (You can never win.)';
    document.getElementById('welcome-modal').style.display = 'none';
    setTimeout(() => {
      document.getElementById('welcome-modal').style.display = 'flex';
      feedback.textContent = 'Psych! Modal is back. Answer: 47.';
    }, 800);
  } else if (answer === '47') {
    feedback.textContent = 'Correct! Closing in 3... 2...';
    setTimeout(() => {
      document.getElementById('welcome-modal').style.display = 'none';
      spamNotification('Welcome! You unlocked nothing.');
    }, 2000);
  } else {
    feedback.textContent = 'Incorrect. Have you tried turning it off and on again?';
  }
});

// --- Cookie wall ---
document.getElementById('decline-cookies').addEventListener('click', () => {
  beep(100, 0.2);
  alert('Decline rejected. Cookies are mandatory for your own good.');
  document.getElementById('cookie-monster').style.transform = 'rotate(' + (Math.random() * 4 - 2) + 'deg)';
});

document.getElementById('accept-cookies').addEventListener('click', (e) => {
  e.stopPropagation();
  beep(800, 0.05);
  const wall = document.getElementById('cookie-monster');
  if (!wall.classList.contains('shrunk')) {
    wall.classList.add('shrunk');
    spamNotification('Cookies accepted! Banner shrank 2px.');
  } else {
    alert('You already accepted. The banner stays forever. (Accept shrinks it more each time.)');
    wall.style.height = `calc(100% - ${parseInt(wall.style.height || '0') + 2}px)`;
  }
});

// --- Fleeing buttons ---
document.querySelectorAll('.btn-flee').forEach((btn) => {
  btn.addEventListener('mouseenter', fleeButton);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    fleeButton.call(btn, e);
  });
});

function fleeButton(e) {
  const btn = e.currentTarget || this;
  const maxX = window.innerWidth - btn.offsetWidth - 20;
  const maxY = window.innerHeight - btn.offsetHeight - 20;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  btn.style.position = 'fixed';
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
  btn.style.zIndex = '10000';
  beep(400 + Math.random() * 400, 0.03);
}

// --- Password toggle (lies) ---
document.getElementById('toggle-pw').addEventListener('click', function () {
  const pw = document.getElementById('password');
  if (pw.type === 'text') {
    pw.type = 'password';
    this.textContent = 'Show password (does opposite)';
  } else {
    pw.type = 'text';
    this.textContent = 'Hide password (does opposite)';
  }
  beep(300);
});

// Password starts visible (type=text in HTML)
document.getElementById('secret').type = 'password';

// --- Newsletter cannot uncheck ---
document.getElementById('newsletter').addEventListener('click', (e) => {
  e.preventDefault();
  e.target.checked = true;
  spamNotification('Newsletter subscription is mandatory. Thanks!');
  beep(250);
});

// --- Inverted sliders ---
document.getElementById('volume').addEventListener('input', (e) => {
  const inverted = 100 - parseInt(e.target.value, 10);
  document.getElementById('volume-label').textContent = inverted + '% (inverted)';
  document.body.style.filter = `hue-rotate(${inverted * 3.6}deg)`;
});

document.getElementById('annoyance-slider').addEventListener('input', (e) => {
  const val = 11 - parseInt(e.target.value, 10);
  document.body.style.animationDuration = (val * 0.05) + 's, ' + (val * 0.02) + 's';
});

// --- Captcha hell ---
function buildCaptcha() {
  const grid = document.getElementById('captcha-grid');
  grid.innerHTML = '';
  const target = CAPTCHA_WORDS[Math.floor(Math.random() * CAPTCHA_WORDS.length)];
  document.getElementById('captcha-target').textContent = target;

  captchaSolution = [];
  const tiles = [];
  for (let i = 0; i < 9; i++) {
    const emoji = CAPTCHA_EMOJIS[Math.floor(Math.random() * CAPTCHA_EMOJIS.length)];
    const hasTarget = Math.random() > 0.6;
    tiles.push({ emoji, hasTarget, index: i });
    if (hasTarget) captchaSolution.push(i);
  }
  if (captchaSolution.length === 0) {
    tiles[0].hasTarget = true;
    captchaSolution.push(0);
  }

  tiles.forEach(({ emoji, hasTarget, index }) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'captcha-tile';
    tile.textContent = emoji;
    tile.dataset.target = hasTarget ? '1' : '0';
    tile.dataset.index = index;
    tile.addEventListener('click', () => {
      tile.classList.toggle('selected');
      validateCaptcha();
      beep(500 + Math.random() * 200, 0.02);
    });
    grid.appendChild(tile);
  });
}

function validateCaptcha() {
  const selected = [...document.querySelectorAll('.captcha-tile.selected')];
  const selectedIndices = selected.map((t) => parseInt(t.dataset.index, 10)).sort((a, b) => a - b);
  const solution = [...captchaSolution].sort((a, b) => a - b);

  const match =
    selectedIndices.length === solution.length &&
    selectedIndices.every((v, i) => v === solution[i]);

  const submitBtn = document.getElementById('submit-btn');

  if (match) {
    wrongCaptchaAttempts++;
    spamNotification('Captcha correct! That was suspicious. Try again.');
    buildCaptcha();
    document.getElementById('signup-form').reset();
    document.getElementById('newsletter').checked = true;
    if (wrongCaptchaAttempts >= 3) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application (now enabled, but will ask again)';
    }
  }
}

document.getElementById('captcha-refresh').addEventListener('click', () => {
  buildCaptcha();
  document.getElementById('signup-form').reset();
  document.getElementById('newsletter').checked = true;
  spamNotification('Form reset! You\'re welcome.');
  beep(150);
});

// --- Form submit ---
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  beep(100, 0.15);

  if (!confirm('Are you sure you want to submit?')) return;
  if (!confirm('Really sure? This cannot be undone (it also does nothing).')) return;
  if (!confirm('Last chance. Still sure?')) {
    alert('Submission cancelled. (You said no, but we\'ll ask again in 5 seconds.)');
    setTimeout(() => document.getElementById('submit-btn').click(), 5000);
    return;
  }

  const toast = document.getElementById('success-toast');
  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-visible');
  spamNotification('Account created! (Data discarded.)');

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hidden');
  }, 2000);
});

document.getElementById('signup-form').addEventListener('reset', (e) => {
  e.preventDefault();
  alert('Reset blocked. Your data is ours now.');
});

// --- Dark mode (worse) ---
document.getElementById('dark-mode').addEventListener('click', () => {
  document.body.classList.toggle('worse-mode');
  beep(80, 0.2);
  spamNotification('Display mode worsened.');
});

// --- Random survey modal ---
function maybeShowSurvey() {
  if (Math.random() > 0.7) {
    document.getElementById('survey-modal').style.display = 'flex';
  }
}

document.getElementById('survey-close').addEventListener('click', () => {
  document.getElementById('survey-modal').style.display = 'none';
  setTimeout(maybeShowSurvey, 3000);
});

// --- Nav about ---
document.getElementById('nav-about').addEventListener('click', () => {
  alert('About: This app was designed by a committee of chaos gremlins. No refunds on sanity.');
});

// --- Cursor trail ---
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) {
    const dot = document.createElement('span');
    dot.className = 'trail-dot';
    dot.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.getElementById('cursor-trail').appendChild(dot);
    setTimeout(() => dot.remove(), 1000);
  }
});

// --- Notification spam ---
function spamNotification(msg) {
  const container = document.getElementById('notification-spam');
  const notif = document.createElement('div');
  notif.className = 'spam-notif';
  notif.textContent = msg;
  notif.addEventListener('click', () => {
    notif.remove();
    spamNotification('You closed one notification. Have three more!');
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spamNotification('Bonus notification #' + (i + 1)), i * 200);
    }
  });
  container.appendChild(notif);
  if (container.children.length > 8) {
    container.removeChild(container.firstChild);
  }
}

// --- Progress bar chaos ---
setInterval(() => {
  const fill = document.getElementById('progress-fill');
  const step = document.getElementById('step-num');
  const w = parseFloat(fill.style.width) || 140;
  const newW = w + (Math.random() * 40 - 20);
  fill.style.width = Math.max(0, Math.min(200, newW)) + '%';
  step.textContent = Math.floor(Math.random() * 12) + 1;
}, 2000);

// --- Random confirm on click ---
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-flee') || e.target.closest('.captcha-tile')) return;
  if (Math.random() > 0.92 && !e.target.closest('#cookie-monster')) {
    if (!confirm('Random security check: Are you a human? (Cancel = more popups)')) {
      spamNotification('Security check failed. Monitoring increased.');
    }
  }
}, true);

// --- Scroll hijack (mild) ---
let scrollTick = 0;
window.addEventListener('wheel', (e) => {
  scrollTick++;
  if (scrollTick % 5 === 0) {
    window.scrollBy(0, e.deltaY > 0 ? -30 : 30);
  }
}, { passive: true });

// --- Periodic annoyances ---
setInterval(() => {
  maybeShowSurvey();
  if (Math.random() > 0.8) {
    spamNotification(['Update available!', 'You have 1 new message', 'Memory low', 'Tip: Click fewer things'][Math.floor(Math.random() * 4)]);
  }
}, 12000);

setInterval(() => {
  document.title = ['Sign Up — Probably Fine™', '⚠️ WAIT ⚠️', '🔥 HOT DEAL 🔥', 'Error 404 (lying)'][Math.floor(Math.random() * 4)];
}, 3000);

// --- Init ---
buildCaptcha();
runFakeLoading();

// Autofocus hop
const fields = ['email', 'username', 'password', 'secret'];
let fieldIdx = 0;
setInterval(() => {
  const el = document.getElementById(fields[fieldIdx % fields.length]);
  if (el && document.activeElement !== el) {
    el.focus();
    fieldIdx++;
  }
}, 4000);
