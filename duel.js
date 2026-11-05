import { playSound, stopCharge, registerSoundToggle } from './sounds.js?v=page-turn-2';
const works = document.querySelector('#works, main.works');
if (works) {
  const words = {
    en: {
      kicker: 'A CHALLENGE AT COURT', title: 'The Rabbit Knights',
      intro: 'Two tiny knights. Attack the opening or parry the blade. Care for a duel?',
      open: 'Challenge me', close: 'Close the game', start: 'Begin the duel', again: 'Duel again',
      rules: 'Attack while Sir Hops raises his sword, or defend at the golden flash. First to 3 points wins · 30 seconds.',
      you: 'You', rival: 'Sir Hops', parry: 'DEFEND', attack: 'ATTACK', space: 'Space', resume: 'Resume duel',
      idle: 'Salute your opponent. Ready when you are.',
      waiting: 'His guard is up. Wait for an opening…', warning: 'An opening! J to attack — or wait to defend.', strike: 'GOLD! Space to defend!',
      hit: 'Clang! A perfect parry. Your counterattack scores.',
      attackHit: 'A clean thrust! You seized the opening and scored.',
      blocked: 'His guard stopped your attack. Sir Hops counters and scores.',
      exposed: 'You attacked into his strike! Sir Hops scores.',
      early: 'Too soon! Sir Hops slipped past your guard.',
      late: 'A little late! Sir Hops takes the point.',
      win: 'Victory! Sir Hops bows to the new champion.',
      lose: 'Sir Hops wins this round. A rematch?',
      draw: 'An honourable draw. Both knights salute.',
      paused: 'The duel is paused. Resume when you are ready.',
    },
    zh: {
      kicker: '庭院比武', title: '盔甲兔子击剑',
      intro: '两只小骑士，抓住破绽进攻，看准时机防御。来比试一下？',
      open: '来决斗吧', close: '关闭小游戏', start: '开始决斗', again: '再来一局',
      rules: '对手举剑时可以抢攻，金光亮起时要防御。先得 3 分获胜，每局最多 30 秒。',
      you: '你', rival: '蹦蹦骑士', parry: '防御', attack: '进攻', space: '空格', resume: '继续决斗',
      idle: '先向对手行礼。准备好了就开始。',
      waiting: '对手正在防守，等待破绽……', warning: '出现破绽！按 J 抢攻，或等金光防御。', strike: '金光亮了！按空格防御！',
      hit: '锵！格挡成功，自动反击得一分。',
      attackHit: '突刺命中！你抓住破绽，主动进攻得一分。',
      blocked: '对手挡住了你的进攻，反击得一分。',
      exposed: '撞上对手的攻击了！这时应该防御，对手得分。',
      early: '出手太早啦！蹦蹦骑士趁机得分。',
      late: '稍微晚了一点！蹦蹦骑士得分。',
      win: '你赢了！蹦蹦骑士向新冠军鞠躬。',
      lose: '这局蹦蹦骑士赢了，再比一次？',
      draw: '势均力敌！两位骑士互相致意。',
      paused: '决斗已暂停，准备好后可以继续。',
    }
  };
  const text = key => words[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  function rabbit(id) {
    return `<svg viewBox="0 0 200 240" class="rabbit-drawing" aria-hidden="true">
      <defs><linearGradient id="${id}-steel" x2="1" y2="1"><stop stop-color="#f0ece1"/><stop offset=".45" stop-color="#87969d"/><stop offset=".55" stop-color="#d8dedb"/><stop offset="1" stop-color="#586770"/></linearGradient></defs>
      <ellipse cx="95" cy="222" rx="58" ry="9" fill="#392817" opacity=".17"/>
      <g class="rabbit-body">
        <path d="M63 123Q29 158 43 204L86 194 114 133Z" fill="var(--rabbit-cloth)" stroke="#493824" stroke-width="3"/>
        <ellipse cx="60" cy="170" rx="18" ry="19" fill="#e6d9bc" stroke="#5b4832" stroke-width="3"/>
        <path d="M71 190 65 216Q88 228 97 215L101 187M111 188 112 218Q137 225 143 215L134 186" fill="url(#${id}-steel)" stroke="#3c4445" stroke-width="3"/>
        <ellipse cx="100" cy="157" rx="43" ry="48" fill="url(#${id}-steel)" stroke="#3c4445" stroke-width="3"/>
        <path d="M88 123V193M64 166Q99 177 137 166M69 180Q101 190 134 179" fill="none" stroke="#4b5759" stroke-width="3"/>
        <path d="M96 132 112 132 112 150 104 157 96 150Z" fill="var(--rabbit-cloth)" stroke="#e5c17b" stroke-width="2"/>
        <g class="rabbit-head">
          <ellipse cx="75" cy="51" rx="13" ry="40" transform="rotate(-16 75 51)" fill="#ede2ca" stroke="#574535" stroke-width="3"/>
          <ellipse cx="113" cy="46" rx="12" ry="40" transform="rotate(9 113 46)" fill="#ede2ca" stroke="#574535" stroke-width="3"/>
          <path d="m68 26 11 47M116 19l-5 47" stroke="#cda598" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="101" cy="91" rx="39" ry="36" fill="#ede2ca" stroke="#574535" stroke-width="3"/>
          <path d="M62 86Q60 48 96 54 132 50 139 85L120 91 76 94Z" fill="url(#${id}-steel)" stroke="#3c4445" stroke-width="3"/>
          <path d="M98 55V84M65 83Q102 74 137 83" fill="none" stroke="#425155" stroke-width="3"/>
          <path d="M77 93h13m27-3h10" stroke="#303735" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="121" cy="109" rx="22" ry="14" fill="#f6ebd5"/>
          <path d="m134 103 7 4-7 4Z" fill="#9c6c5e"/><path d="m126 115-9 3" stroke="#755547" stroke-width="2"/>
          <path d="M99 119v8m6-7v7" stroke="#fff9e9" stroke-width="5"/>
        </g>
        <ellipse cx="66" cy="145" rx="16" ry="20" fill="url(#${id}-steel)" stroke="#3c4445" stroke-width="3"/>
        <g class="rabbit-blade">
          <path d="m124 146 55-77 10-7-3 14-54 76Z" fill="#e9f0e9" stroke="#4b585b" stroke-width="2"/>
          <path d="m130 141 49-68" stroke="white" stroke-width="2"/>
          <path d="m115 136 28 19" stroke="#5c3e20" stroke-width="6" stroke-linecap="round"/>
          <path d="m118 158 14-20" stroke="#9c7439" stroke-width="7" stroke-linecap="round"/>
          <circle cx="122" cy="151" r="10" fill="url(#${id}-steel)" stroke="#3c4445" stroke-width="3"/>
        </g>
      </g>
    </svg>`;
  }

  const invite = document.createElement('section');
  invite.id = 'duel';
  invite.className = 'duel-invite';
  invite.setAttribute('aria-labelledby', 'duel-invite-title');
  invite.innerHTML = `<div class="duel-seal">${rabbit('invite')}</div><div class="duel-invite-copy"><p class="duel-eyebrow" data-duel-text="kicker"></p><h2 id="duel-invite-title" data-duel-text="title"></h2><p data-duel-text="intro"></p></div><button class="duel-open duel-button" data-duel-text="open"></button>`;
  works.after(invite);
  const dialog = document.createElement('dialog');
  dialog.className = 'duel-dialog';
  dialog.setAttribute('aria-labelledby', 'duel-title');
  dialog.setAttribute('aria-describedby', 'duel-rules');
  dialog.innerHTML = `<button class="duel-close" type="button">×</button><button class="duel-sound-toggle" type="button"></button>
    <p class="duel-eyebrow" data-duel-text="kicker"></p><h2 id="duel-title" data-duel-text="title"></h2>
    <p id="duel-rules" data-duel-text="rules"></p>
    <div class="duel-key-hints"><span><kbd>J</kbd> <span data-duel-text="attack"></span></span><span><kbd data-duel-text="space"></kbd> <span data-duel-text="parry"></span></span></div>
    <div class="duel-scoreboard"><span><span data-duel-text="you"></span> <strong class="duel-your-score">0</strong></span><span class="duel-clock">30 s</span><span><span data-duel-text="rival"></span> <strong class="duel-rival-score">0</strong></span></div>
    <div class="duel-arena" data-phase="idle">
      <span class="duel-banner duel-banner-left" aria-hidden="true">♜</span><span class="duel-banner duel-banner-right" aria-hidden="true">♜</span>
      <span class="duel-signal" aria-hidden="true">✦</span><span class="duel-clash" aria-hidden="true">✧</span>
      <div class="duel-knight duel-you">${rabbit('player')}</div><div class="duel-knight duel-rival">${rabbit('rival')}</div>
    </div>
    <p class="duel-message" role="status" aria-live="polite"></p>
    <div class="duel-controls"><button type="button" class="duel-start duel-button"></button><button type="button" class="duel-attack duel-button" data-duel-text="attack" aria-keyshortcuts="j" hidden></button><button type="button" class="duel-parry duel-button" data-duel-text="parry" aria-keyshortcuts="Space" hidden></button><button type="button" class="duel-resume duel-button" data-duel-text="resume" hidden></button></div>`;
  document.body.append(dialog);
  registerSoundToggle(dialog.querySelector('.duel-sound-toggle'));
  const arena = dialog.querySelector('.duel-arena');
  const startButton = dialog.querySelector('.duel-start');
  const parryButton = dialog.querySelector('.duel-parry');
  const attackButton = dialog.querySelector('.duel-attack');
  const resumeButton = dialog.querySelector('.duel-resume');
  const closeButton = dialog.querySelector('.duel-close');
  let phase = 'idle';
  let message = 'idle';
  let yourScore = 0;
  let rivalScore = 0;
  let frame = 0;
  let deadline = 0;
  let matchEnds = 0;
  let pausedAt = 0;
  let running = false;
  let remainingSeconds = 30;

  function render() {
    [invite, dialog].forEach(root => root.querySelectorAll('[data-duel-text]').forEach(node => {
      node.textContent = text(node.dataset.duelText);
    }));
    closeButton.setAttribute('aria-label', text('close'));
    dialog.querySelector('.duel-message').textContent = text(pausedAt ? 'paused' : message);
    dialog.querySelector('.duel-your-score').textContent = yourScore;
    dialog.querySelector('.duel-rival-score').textContent = rivalScore;
    dialog.querySelector('.duel-clock').textContent = remainingSeconds + ' s';
    startButton.textContent = text(phase === 'ended' ? 'again' : 'start');
    startButton.hidden = running;
    parryButton.hidden = !running || Boolean(pausedAt);
    parryButton.setAttribute('aria-disabled', String(phase === 'result'));
    attackButton.hidden = parryButton.hidden;
    attackButton.setAttribute('aria-disabled', String(phase === 'result'));
    resumeButton.hidden = !pausedAt;
    arena.dataset.phase = pausedAt ? 'paused' : phase;
    arena.dataset.outcome = message;
  }
  function finish() {
    stopCharge();
    running = false;
    phase = 'ended';
    message = yourScore === rivalScore ? 'draw' : yourScore > rivalScore ? 'win' : 'lose';
    playSound(message === 'win' ? 'victory' : 'paper');
    cancelAnimationFrame(frame);
    render();
    startButton.focus({ preventScroll: true });
  }
  function nextAttack(now) {
    phase = 'waiting';
    message = 'waiting';
    deadline = now + 900 + Math.random() * 1000;
    render();
  }
  function scorePoint(outcome, now) {
    stopCharge();
    playSound(outcome === 'hit' || outcome === 'attackHit' ? 'success' : 'miss');
    if (outcome === 'hit' || outcome === 'attackHit') yourScore++;
    else rivalScore++;
    phase = 'result';
    message = outcome;
    deadline = now + 1000;
    render();
  }
  function tick(now) {
    if (!running || pausedAt) return;
    const seconds = Math.max(0, Math.ceil((matchEnds - now) / 1000));
    if (seconds !== remainingSeconds) {
      remainingSeconds = seconds;
      dialog.querySelector('.duel-clock').textContent = seconds + ' s';
    }
    if (now >= matchEnds) { finish(); return; }
    if (now >= deadline) {
      if (phase === 'waiting') {
        phase = 'warning';
        message = 'warning';
        deadline = now + 650;
        playSound('charge');
        render();
      } else if (phase === 'warning') {
        stopCharge();
        playSound('swing');
        phase = 'strike';
        message = 'strike';
        deadline = now + 650;
        render();
      } else if (phase === 'strike') {
        scorePoint('late', now);
      } else if (phase === 'result') {
        if (yourScore >= 3 || rivalScore >= 3) { finish(); return; }
        nextAttack(now);
      }
    }
    frame = requestAnimationFrame(tick);
  }
  function parry() {
    if (!running || pausedAt || phase === 'result') return;
    const now = performance.now();
    if (now >= matchEnds) { finish(); return; }
    playSound('guard');
    if (phase === 'strike' && now < deadline) scorePoint('hit', now);
    else scorePoint(phase === 'strike' ? 'late' : 'early', now);
  }
  function attack() {
    if (!running || pausedAt || phase === 'result') return;
    const now = performance.now();
    if (now >= matchEnds) { finish(); return; }
    playSound('swing');
    if (phase === 'warning' && now < deadline) scorePoint('attackHit', now);
    else scorePoint(phase === 'waiting' ? 'blocked' : 'exposed', now);
  }
  function start() {
    stopCharge();
    playSound('guard');
    cancelAnimationFrame(frame);
    yourScore = 0;
    rivalScore = 0;
    pausedAt = 0;
    remainingSeconds = 30;
    running = true;
    const now = performance.now();
    matchEnds = now + 30000;
    nextAttack(now);
    parryButton.focus({ preventScroll: true });
    frame = requestAnimationFrame(tick);
  }
  invite.querySelector('button').addEventListener('click', () => {
    phase = 'idle';
    message = 'idle';
    yourScore = 0;
    rivalScore = 0;
    remainingSeconds = 30;
    render();
    dialog.showModal();
    startButton.focus();
  });
  startButton.addEventListener('click', start);
  parryButton.addEventListener('click', parry);
  attackButton.addEventListener('click', attack);
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.target.closest('[data-sfx-toggle]')) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    if (!['Space', 'KeyJ'].includes(event.code) || event.target === closeButton || event.target === startButton || event.target === resumeButton) return;
    event.preventDefault();
    if (event.repeat) return;
    if (event.code === 'KeyJ') attack();
    else parry();
  });
  dialog.addEventListener('close', () => {
    stopCharge();
    cancelAnimationFrame(frame);
    running = false;
    pausedAt = 0;
    invite.querySelector('button').focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !pausedAt) {
      pausedAt = performance.now();
      stopCharge();
      cancelAnimationFrame(frame);
      render();
    }
  });
  resumeButton.addEventListener('click', () => {
    if (!pausedAt) return;
    const elapsed = performance.now() - pausedAt;
    deadline += elapsed;
    matchEnds += elapsed;
    pausedAt = 0;
    render();
    parryButton.focus();
    if (phase === 'warning') playSound('charge');
    frame = requestAnimationFrame(tick);
  });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  render();
}
