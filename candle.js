const home = document.querySelector('#home');
const player = document.createElement('section');
player.className = 'music-player';
player.setAttribute('aria-label', 'Greensleeves');
player.innerHTML = `<audio class="music-audio" src="assets/greensleeves.mp3" preload="auto"></audio>
<button class="music-toggle" type="button" aria-pressed="false"><span class="music-icon" aria-hidden="true">♪</span><span class="music-action"></span></button>
<span class="music-title">Greensleeves · 绿袖子</span>
<label><span class="sr-only">Music volume</span><input class="music-volume" type="range" min="0" max="1" step="0.05" aria-label="Music volume"></label>`;
document.body.append(player);
let candle;
if (home) {
  candle = document.createElement('aside');
  candle.className = 'candle-scene';
  candle.innerHTML = `<button class="candle-button" type="button" aria-pressed="false">
    <span class="candle-art" aria-hidden="true"><span class="candle-glow"></span><span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-wax"></span><span class="candle-holder"></span></span>
    <span class="candle-label"></span></button>
    <div class="candle-story" hidden><p></p><div class="candle-paths"><a href="#works"></a><a href="#help"></a><a href="#help"></a></div></div>
    <span class="candle-status sr-only" role="status"></span>`;
  home.append(candle);
  document.body.classList.add('candle-ready');
}
const audio = player.querySelector('audio');
const toggle = player.querySelector('.music-toggle');
const volume = player.querySelector('.music-volume');
const candleButton = candle?.querySelector('button');
const storedVolume = localStorage.getItem('bgm-volume');
let targetVolume = storedVolume === null ? 1 : Number(storedVolume);
if (!Number.isFinite(targetVolume)) targetVolume = 1;
targetVolume = Math.max(0, Math.min(1, targetVolume));
volume.value = String(targetVolume);
const startOffset = 0.7;
const endTrim = 1.5;
let lit = false;
let musicWanted = false;
let everLit = false;
let revision = 0;
let pauseTimer;
let loopTimer;
let audioContext;
let gain;
let mediaSource;

function updateLabels() {
  const zh = document.documentElement.lang.startsWith('zh');
  const action = zh ? (lit ? '熄灭烛火' : '点亮烛火') : (lit ? 'Extinguish the flame' : 'Light the candle');
  toggle.setAttribute('aria-label', zh ? (musicWanted ? '暂停绿袖子' : '播放绿袖子') : (musicWanted ? 'Pause Greensleeves' : 'Play Greensleeves'));
  toggle.setAttribute('aria-pressed', String(musicWanted));
  player.querySelector('.music-action').textContent = zh ? (musicWanted ? '暂停' : '播放') : (musicWanted ? 'PAUSE' : 'PLAY');
  player.classList.toggle('is-playing', musicWanted);
  if (!candle) return;
  candleButton.setAttribute('aria-pressed', String(lit));
  candle.querySelector('.candle-label').textContent = action;
  candle.querySelector('.candle-story p').textContent = zh ? '每个故事，都始于有人愿意点亮第一束火光。' : 'Every story begins with someone willing to light the first flame.';
  const labels = zh ? ['探索我的作品', '和我一起拍电影', '走进中世纪世界'] : ['Explore my works', 'Make a film with me', 'Enter the medieval world'];
  candle.querySelectorAll('.candle-paths a').forEach((link, index) => { link.textContent = labels[index]; });
}
function paint() {
  document.body.classList.toggle('candle-room-lit', Boolean(home) && lit);
  home?.classList.toggle('candle-lit', lit);
  candle?.classList.toggle('is-lit', lit);
  if (candle && everLit) candle.querySelector('.candle-story').hidden = false;
  updateLabels();
}
function fadeTo(value, seconds) {
  if (!gain) { audio.volume = value; return; }
  const now = audioContext.currentTime;
  gain.gain.cancelAndHoldAtTime(now);
  gain.gain.linearRampToValueAtTime(value, now + seconds);
}
function positionAudio() {
  if (Number.isFinite(audio.duration) && (audio.currentTime < startOffset || audio.currentTime >= audio.duration - endTrim)) {
    audio.currentTime = startOffset;
  }
}
function scheduleLoop() {
  clearTimeout(loopTimer);
  if (!musicWanted || audio.paused || !Number.isFinite(audio.duration)) return;
  const remaining = audio.duration - endTrim - audio.currentTime;
  loopTimer = setTimeout(() => {
    if (!musicWanted) return;
    if (audio.currentTime >= audio.duration - endTrim - 0.03) audio.currentTime = startOffset;
    scheduleLoop();
  }, Math.max(30, remaining * 1000));
}
async function setMusicPlaying(playingWanted) {
  const operation = ++revision;
  clearTimeout(pauseTimer);
  clearTimeout(loopTimer);
  musicWanted = playingWanted;
  updateLabels();
  if (!musicWanted) {
    fadeTo(0, 0.5);
    pauseTimer = setTimeout(() => {
      if (revision === operation && !musicWanted) audio.pause();
    }, 520);
    return;
  }
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
      mediaSource = audioContext.createMediaElementSource(audio);
      gain = audioContext.createGain();
      gain.gain.value = 0;
      mediaSource.connect(gain).connect(audioContext.destination);
    }
    // Both calls happen inside the click gesture, including on mobile browsers.
    const resumed = audioContext.resume();
    positionAudio();
    const playing = audio.play();
    await Promise.all([resumed, playing]);
    if (revision !== operation) return;
    fadeTo(targetVolume, 0.12);
    scheduleLoop();
  } catch (error) {
    if (revision !== operation) return;
    musicWanted = false;
    audio.pause();
    updateLabels();
    if (candle) candle.querySelector('.candle-status').textContent = document.documentElement.lang.startsWith('zh') ? '音乐暂时无法播放，请再次点击重试。' : 'Music could not start. Please click to try again.';
    console.warn('Music playback failed', error);
  }
}
function changeFlame() {
  lit = !lit;
  everLit = everLit || lit;
  paint();
  if (lit) setMusicPlaying(true);
  document.dispatchEvent(new CustomEvent('site-sound', { detail: lit ? 'ignite' : 'extinguish' }));
}
audio.addEventListener('loadedmetadata', positionAudio);
audio.addEventListener('playing', scheduleLoop);
audio.addEventListener('seeked', scheduleLoop);
audio.addEventListener('timeupdate', () => {
  if (musicWanted && Number.isFinite(audio.duration) && audio.currentTime >= audio.duration - endTrim) {
    audio.currentTime = startOffset;
  }
});
audio.addEventListener('ended', () => {
  if (musicWanted) {
    audio.currentTime = startOffset;
    setMusicPlaying(true);
  }
});
volume.addEventListener('input', () => {
  targetVolume = Number(volume.value);
  localStorage.setItem('bgm-volume', volume.value);
  if (musicWanted) fadeTo(targetVolume, 0.05);
});
toggle.addEventListener('click', () => setMusicPlaying(!musicWanted));
candleButton?.addEventListener('click', changeFlame);
new MutationObserver(updateLabels).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
window.addEventListener('pagehide', () => {
  ++revision;
  lit = false;
  musicWanted = false;
  clearTimeout(pauseTimer);
  clearTimeout(loopTimer);
  audio.pause();
  paint();
});
updateLabels();
