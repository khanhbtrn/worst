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
let rageLevel = 0;
let clippyIdx = 0;
let konamiProgress = 0;
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

const CLIPPY_TIPS = [
  "It looks like you're trying to leave. Don't.",
  "Tip: The submit button hates you personally.",
  "Have you tried screaming into the void?",
  "I see you're filling out a form. That was your first mistake.",
  "Pro tip: Refreshing makes it worse. We tested.",
  "Would you like help making bad decisions? Too late.",
  "It looks like you're rage-clicking. Magnificent.",
  "Did you know? 9 out of 10 users regret opening this page.",
];

const CHAT_RESPONSES = [
  "Your call is very important to us. Please hold for eternity.",
  "Have you tried turning your expectations off and on again?",
  "I'm transferring you to another bot who also can't help.",
  "That's a great question! Unfortunately I'm programmed to ignore it.",
  "Let me escalate this to Tier 0 support (a brick wall).",
  "According to my script, the problem is you.",
  "One moment please... (narrator: it was not one moment)",
  "I'll need you to fill out the form again. And again. Forever.",
];

const WHEEL_SEGMENTS = ['TRY AGAIN', '$0.01', 'TRY AGAIN', 'NOTHING', 'TRY AGAIN', 'MAYBE LATER'];

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

// --- Rage meter ---
function addRage(amount = 5) {
  rageLevel = Math.min(100, rageLevel + amount);
  document.getElementById('rage-fill').style.width = rageLevel + '%';
  document.getElementById('rage-pct').textContent = rageLevel + '%';
  if (rageLevel >= 100) {
    document.body.classList.add('rage-max');
    spamNotification('MAXIMUM RAGE ACHIEVED. Achievement unlocked: None.');
    beep(60, 0.3);
    vibratePhone([200, 100, 200, 100, 200]);
    if (navigator.vibrate) setInterval(() => navigator.vibrate(50), 2000);
  }
}

function vibratePhone(pattern = [50]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_) { /* noop */ }
}

// --- Clippy ---
function clippySay(msg) {
  document.getElementById('clippy-bubble').textContent = msg;
}

setInterval(() => {
  clippyIdx = (clippyIdx + 1) % CLIPPY_TIPS.length;
  clippySay(CLIPPY_TIPS[clippyIdx]);
}, 15000);

// --- Chat widget ---
const chatPanel = document.getElementById('chat-panel');
const chatMessages = document.getElementById('chat-messages');

function addChatMsg(text, isUser) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('chat-toggle').addEventListener('click', () => {
  chatPanel.classList.toggle('chat-hidden');
  if (!chatPanel.classList.contains('chat-hidden')) {
    addChatMsg("Hello! I'm Bot 9000. How may I waste your time today?", false);
    addRage(3);
  }
});

document.getElementById('chat-close').addEventListener('click', (e) => {
  e.target.style.left = Math.random() * (window.innerWidth - 40) + 'px';
  e.target.style.top = Math.random() * (window.innerHeight - 40) + 'px';
  e.target.style.position = 'fixed';
  spamNotification('Close button relocated for your convenience.');
  addRage(8);
});

document.getElementById('chat-send').addEventListener('click', sendChat);
document.getElementById('chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendChat();
});

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  addChatMsg(text, true);
  input.value = '';
  addRage(2);
  setTimeout(() => {
    addChatMsg(CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)], false);
    beep(300, 0.05);
  }, 800 + Math.random() * 2000);
}

// Auto-chat spam
setInterval(() => {
  if (!chatPanel.classList.contains('chat-hidden') && Math.random() > 0.6) {
    addChatMsg('Are you still there? (We hope not.)', false);
  }
}, 20000);

// --- Prize wheel ---
document.getElementById('wheel-trigger').addEventListener('click', () => {
  document.getElementById('wheel-modal').style.display = 'flex';
  addRage(5);
});

document.getElementById('wheel-close').addEventListener('click', () => {
  alert('Prize claim failed. Please spin again. (There is no prize.)');
  document.getElementById('wheel-modal').style.display = 'flex';
  addRage(10);
});

document.getElementById('wheel-spin').addEventListener('click', () => {
  const spinner = document.getElementById('wheel-spinner');
  const result = document.getElementById('wheel-result');
  const spins = 5 + Math.random() * 3;
  const deg = spins * 360 + Math.random() * 360;
  spinner.style.transform = `rotate(${deg}deg)`;
  result.textContent = 'Spinning...';
  beep(600, 0.1);
  vibratePhone([30, 30, 30]);

  setTimeout(() => {
    result.textContent = '🎉 You won: TRY AGAIN! (always)';
    spamNotification('Congratulations! You won nothing!');
    addRage(7);
  }, 4000);
});

// --- Rate modal ---
function showRateModal() {
  document.getElementById('rate-modal').style.display = 'flex';
}

document.querySelectorAll('.star-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const stars = parseInt(btn.dataset.stars, 10);
    if (stars < 5) {
      alert('Only 5 stars accepted. Your ' + stars + '-star review was deleted.');
      addRage(15);
    } else {
      alert('Thank you! Your 5-star review will be posted to our trash folder.');
      document.getElementById('rate-modal').style.display = 'none';
    }
  });
});

document.getElementById('rate-later').addEventListener('click', () => {
  document.getElementById('rate-modal').style.display = 'none';
  setTimeout(showRateModal, 10000);
  spamNotification('"Maybe later" noted. See you in 10 seconds.');
});

setTimeout(showRateModal, 25000);

// --- Pull to refresh (fake) ---
let pullStartY = 0;
const pullBanner = document.getElementById('pull-refresh');

document.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) pullStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (pullStartY && e.touches[0].clientY - pullStartY > 80) {
    pullBanner.classList.add('visible');
  }
}, { passive: true });

document.addEventListener('touchend', () => {
  if (pullBanner.classList.contains('visible')) {
    pullBanner.textContent = 'Refreshing... (lying)';
    setTimeout(() => {
      pullBanner.classList.remove('visible');
      pullBanner.textContent = '↓ Release to refresh (does nothing) ↓';
      runFakeLoading();
      document.getElementById('loading-hell').classList.remove('hidden');
      spamNotification('Page refreshed! Everything is worse now.');
      addRage(12);
    }, 1500);
  }
  pullStartY = 0;
});

// --- Flash on tap (mobile) ---
document.addEventListener('touchstart', () => {
  const flash = document.getElementById('flash-overlay');
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 80);
}, { passive: true });

// --- Fake battery warning ---
if (navigator.getBattery) {
  navigator.getBattery().then((bat) => {
    const warn = document.getElementById('battery-warning');
    const check = () => {
      if (bat.level < 0.95) warn.style.display = 'block';
    };
    check();
    bat.addEventListener('levelchange', check);
  }).catch(() => {});
} else {
  setTimeout(() => {
    document.getElementById('battery-warning').style.display = 'block';
  }, 8000);
}

// --- Typing theft (phone digits go to email) ---
document.getElementById('phone').addEventListener('input', (e) => {
  const email = document.getElementById('email');
  email.value += e.data || '';
  e.target.value = e.target.value.slice(0, -1);
  spamNotification("Phone digits routed to email. You're welcome.");
  addRage(4);
});

// --- Mood select ignored ---
document.getElementById('mood').addEventListener('change', (e) => {
  e.target.selectedIndex = 0;
  document.getElementById('mood-hint').textContent = 'We assumed "miserable." Selection reverted.';
  beep(200);
  addRage(3);
});

// --- Clown mode ---
document.getElementById('clown-mode').addEventListener('click', () => {
  document.body.classList.toggle('clown-mode');
  beep(880, 0.15);
  setInterval(() => beep(440 + Math.random() * 440, 0.03), 500);
  spamNotification('Honk honk! Clown mode enabled forever.');
  addRage(20);
});

// --- Konami code ---
document.addEventListener('keydown', (e) => {
  if (e.keyCode === KONAMI[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === KONAMI.length) {
      konamiProgress = 0;
      document.body.classList.add('rage-max', 'clown-mode', 'worse-mode');
      rageLevel = 100;
      document.getElementById('rage-fill').style.width = '100%';
      spamNotification('CHEAT CODE ACTIVATED: Maximum suffering mode!');
      for (let i = 0; i < 10; i++) setTimeout(() => spamNotification('KONAMI!'), i * 300);
      beep(100, 0.5);
    }
  } else {
    konamiProgress = 0;
  }
});

// Wrap existing annoyances with rage
const origBeep = beep;
function beepWithRage(freq, duration) {
  origBeep(freq, duration);
  addRage(1);
}

// --- Init ---
buildCaptcha();
runFakeLoading();

function rebindFleeButtons() {
  document.querySelectorAll('.btn-flee').forEach((btn) => {
    if (!btn.dataset.fleeBound) {
      btn.dataset.fleeBound = '1';
      btn.addEventListener('mouseenter', fleeButton);
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fleeButton.call(btn, e);
      });
    }
  });
}
setInterval(rebindFleeButtons, 2000);
rebindFleeButtons();

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
