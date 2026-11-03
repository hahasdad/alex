'use strict';
const mainNav=document.querySelector('nav[aria-label="Main navigation"]');
if(mainNav){
 const scrollNav=document.createElement('div');scrollNav.className='scroll-nav';
 mainNav.parentNode.insertBefore(scrollNav,mainNav);scrollNav.appendChild(mainNav);
 const scrollToggle=document.createElement('button');scrollToggle.type='button';scrollToggle.className='scroll-nav-toggle';scrollToggle.textContent='ROLL UP ▲';scrollToggle.setAttribute('aria-expanded','true');scrollToggle.setAttribute('aria-label','Roll up navigation');scrollNav.appendChild(scrollToggle);
 scrollToggle.addEventListener('click',()=>{const collapsed=scrollNav.classList.toggle('is-collapsed');scrollToggle.textContent=collapsed?'MENU ▼':'ROLL UP ▲';scrollToggle.setAttribute('aria-expanded',String(!collapsed));scrollToggle.setAttribute('aria-label',collapsed?'Open navigation':'Roll up navigation');});
}
const projectInfo={pc:['Building My First PC','From researching components to assembling the machine, I built my first computer from scratch.'],siege:['Medieval Siege Warfare','I led a team to research medieval siege weapons, build a catapult model, and present our findings.']};
const projectDialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const [title,description]=projectInfo[button.dataset.project];projectDialog.querySelector('h2').textContent=title;projectDialog.querySelector('p').textContent=description;projectDialog.showModal();}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});});
const videoDialog=document.querySelector('#video-dialog');
if(videoDialog){
 const video=videoDialog.querySelector('video');let videoUrl;
 document.querySelector('.video-trigger').addEventListener('click',()=>videoDialog.showModal());
 videoDialog.addEventListener('close',()=>video.pause());
 document.querySelector('#video-file').addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;if(videoUrl)URL.revokeObjectURL(videoUrl);videoUrl=URL.createObjectURL(file);video.src=videoUrl;video.hidden=false;document.querySelector('#video-status').textContent=file.name;video.play().catch(()=>{});});
 video.addEventListener('error',()=>document.querySelector('#video-status').textContent='This video format could not be played. Please choose another video.');
 window.addEventListener('pagehide',()=>{if(videoUrl)URL.revokeObjectURL(videoUrl);});
}

const musicPlayer=document.createElement('section');
musicPlayer.className='music-player';
musicPlayer.setAttribute('aria-label','Background music player');
musicPlayer.innerHTML='<audio class="music-audio" src="assets/greensleeves.mp3" preload="auto" autoplay loop></audio><button class="music-toggle" type="button" aria-pressed="false" aria-label="Play Greensleeves"><span class="music-icon" aria-hidden="true">♪</span><span class="music-action">PLAY</span></button><span class="music-title">Greensleeves · 绿袖子</span><label class="music-volume-label"><span class="sr-only">Music volume</span><input class="music-volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="Music volume"></label>';
document.body.appendChild(musicPlayer);
const musicAudio=musicPlayer.querySelector('.music-audio');
const musicToggle=musicPlayer.querySelector('.music-toggle');
const musicAction=musicPlayer.querySelector('.music-action');
const musicVolume=musicPlayer.querySelector('.music-volume');
const savedVolumeValue=localStorage.getItem('bgm-volume');
const savedVolume=savedVolumeValue===null?NaN:Number(savedVolumeValue);
musicAudio.volume=Number.isFinite(savedVolume)&&savedVolume>=0&&savedVolume<=1?savedVolume:1;
musicVolume.value=String(musicAudio.volume);
const updateMusicButton=()=>{const playing=!musicAudio.paused;musicPlayer.classList.toggle('is-playing',playing);musicToggle.setAttribute('aria-pressed',String(playing));musicToggle.setAttribute('aria-label',playing?'Pause Greensleeves':'Play Greensleeves');musicAction.textContent=playing?'PAUSE':'PLAY';};
musicToggle.addEventListener('click',()=>{if(musicAudio.paused){musicAudio.play().catch(()=>{});}else{musicAudio.pause();}updateMusicButton();});
musicVolume.addEventListener('input',()=>{musicAudio.volume=Number(musicVolume.value);localStorage.setItem('bgm-volume',musicVolume.value);});
musicAudio.addEventListener('play',updateMusicButton);
musicAudio.addEventListener('pause',updateMusicButton);
const attemptMusicStart=()=>musicAudio.play().catch(updateMusicButton);
musicAudio.addEventListener('loadedmetadata',()=>{const savedTime=Number(sessionStorage.getItem('bgm-time'));if(Number.isFinite(savedTime)&&savedTime>0)musicAudio.currentTime=savedTime%musicAudio.duration;attemptMusicStart();});
const startMusicOnFirstInteraction=event=>{if(event.target.closest('.music-toggle'))return;if(musicAudio.paused)attemptMusicStart();};
document.addEventListener('pointerdown',startMusicOnFirstInteraction,{once:true,capture:true});
document.addEventListener('keydown',startMusicOnFirstInteraction,{once:true,capture:true});
attemptMusicStart();
window.addEventListener('pagehide',()=>{sessionStorage.setItem('bgm-time',String(musicAudio.currentTime||0));sessionStorage.setItem('bgm-playing',String(!musicAudio.paused));});
