let context;
let master;
let noiseBuffer;
let enabled = localStorage.getItem('site-sound-effects') !== 'off';
const toggles = new Set();
const voices = new Set();
let chargeGain;
let lastPaper = 0;

function prepareAudio() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = enabled ? 0.55 : 0;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.knee.value = 12;
    limiter.ratio.value = 6;
    master.connect(limiter).connect(context.destination);
    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noiseBuffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
}
function track(source, nodes) {
  voices.add(source);
  source.addEventListener('ended', () => {
    voices.delete(source);
    source.disconnect();
    nodes.forEach(node => node.disconnect());
  }, { once: true });
}
function tone(frequency, duration, volume, delay = 0, endFrequency = frequency, output = master) {
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope).connect(output);
  track(oscillator, [envelope]);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}
function rustle(duration, frequency, volume, delay = 0, paper = false, output = master) {
  const start = context.currentTime + delay;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  source.buffer = noiseBuffer;
  filter.type = 'bandpass';
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(frequency, start);
  filter.frequency.exponentialRampToValueAtTime(frequency * 0.55, start + duration);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + 0.015);
  if (paper) {
    envelope.gain.linearRampToValueAtTime(volume * 0.2, start + duration * 0.32);
    envelope.gain.linearRampToValueAtTime(volume * 0.85, start + duration * 0.55);
  }
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(envelope).connect(output);
  track(source, [filter, envelope]);
  source.start(start);
  source.stop(start + duration + 0.02);
}
function turnPage() {
  const start = context.currentTime;
  const page = context.createBufferSource();
  const softness = context.createBiquadFilter();
  const body = context.createBiquadFilter();
  const envelope = context.createGain();
  page.buffer = noiseBuffer;
  softness.type = 'lowpass';
  softness.frequency.value = 1900;
  body.type = 'highpass';
  body.frequency.value = 180;
  // A page lifts, sweeps through the air, then settles against the book.
  softness.frequency.setValueAtTime(650, start);
  softness.frequency.exponentialRampToValueAtTime(1900, start + 0.14);
  softness.frequency.exponentialRampToValueAtTime(450, start + 0.4);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(0.05, start + 0.035);
  envelope.gain.linearRampToValueAtTime(0.28, start + 0.13);
  envelope.gain.linearRampToValueAtTime(0.1, start + 0.23);
  envelope.gain.linearRampToValueAtTime(0.16, start + 0.29);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.44);
  page.connect(softness).connect(body).connect(envelope).connect(master);
  track(page, [softness, body, envelope]);
  page.start(start, Math.random() * 0.4);
  page.stop(start + 0.46);
  rustle(0.045, 1000, 0.1, 0.025);
  tone(190, 0.09, 0.05, 0.31, 95);
}
export function stopCharge() {
  if (!chargeGain) return;
  const previous = chargeGain;
  previous.gain.cancelScheduledValues(context.currentTime);
  previous.gain.setTargetAtTime(0, context.currentTime, 0.015);
  chargeGain = null;
  setTimeout(() => previous.disconnect(), 800);
}
export function playSound(name) {
  if (!enabled || document.hidden) return;
  try {
    prepareAudio();
    switch (name) {
      case 'paper':
        if (performance.now() - lastPaper < 130) return;
        lastPaper = performance.now();
        turnPage();
        break;
      case 'ignite':
        rustle(0.48, 1150, 0.24);
        rustle(0.08, 3400, 0.18, 0.06);
        rustle(0.07, 2900, 0.12, 0.18);
        break;
      case 'extinguish':
        rustle(0.35, 650, 0.19);
        break;
      case 'charge':
        stopCharge();
        chargeGain = context.createGain();
        chargeGain.connect(master);
        {
          const now = context.currentTime;
          const risingTone = context.createOscillator();
          const envelope = context.createGain();
          risingTone.frequency.setValueAtTime(180, now);
          risingTone.frequency.exponentialRampToValueAtTime(540, now + 0.6);
          envelope.gain.setValueAtTime(0.001, now);
          envelope.gain.linearRampToValueAtTime(0.16, now + 0.48);
          envelope.gain.linearRampToValueAtTime(0, now + 0.64);
          risingTone.connect(envelope).connect(chargeGain);
          track(risingTone, [envelope]);
          risingTone.start(now);
          risingTone.stop(now + 0.66);
        }
        rustle(0.6, 900, 0.12, 0, false, chargeGain);
        break;
      case 'swing':
        rustle(0.2, 1900, 0.27);
        tone(210, 0.15, 0.06, 0, 100);
        break;
      case 'guard':
        tone(1450, 0.32, 0.18);
        tone(2317, 0.22, 0.07);
        tone(3371, 0.16, 0.035);
        break;
      case 'success':
        tone(660, 0.23, 0.13, 0.1);
        tone(880, 0.35, 0.14, 0.23);
        tone(1320, 0.3, 0.07, 0.23);
        break;
      case 'miss':
        tone(180, 0.18, 0.1, 0, 115);
        break;
      case 'victory':
        [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.45, 0.14, index * 0.13));
        break;
    }
  } catch (error) {
    // Audio is optional: a failed audio device never blocks the interaction.
    console.warn('Sound effects unavailable', error);
  }
}
function updateToggles() {
  const zh = document.documentElement.lang.startsWith('zh');
  toggles.forEach(button => {
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', zh ? (enabled ? '关闭音效' : '开启音效') : (enabled ? 'Mute sound effects' : 'Enable sound effects'));
    button.title = button.getAttribute('aria-label');
    button.textContent = (zh ? '音效' : 'SFX') + (enabled ? ' ♪' : ' ×');
  });
}
export function registerSoundToggle(button) {
  button.dataset.sfxToggle = '';
  toggles.add(button);
  button.addEventListener('click', () => {
    enabled = !enabled;
    localStorage.setItem('site-sound-effects', enabled ? 'on' : 'off');
    if (master) master.gain.setTargetAtTime(enabled ? 0.55 : 0, context.currentTime, 0.015);
    if (!enabled) quiet();
    updateToggles();
    if (enabled) playSound('paper');
  });
  updateToggles();
}
const player = document.querySelector('.music-player');
if (player) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sound-effects-toggle';
  player.append(button);
  registerSoundToggle(button);
}
document.addEventListener('click', event => {
  const control = event.target.closest?.('a, button, summary, input, select');
  if (!control || control.matches('[data-sfx-toggle], .duel-attack, .duel-parry, .duel-start, .duel-resume, .candle-button, input[type="range"]')) return;
  playSound('paper');
});
document.addEventListener('site-sound', event => playSound(event.detail));
document.addEventListener('close', () => playSound('paper'), true);
new MutationObserver(updateToggles).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
function quiet() {
  stopCharge();
  voices.forEach(voice => { try { voice.stop(); } catch {} });
}
document.addEventListener('visibilitychange', () => { if (document.hidden) quiet(); });
window.addEventListener('pagehide', quiet);
