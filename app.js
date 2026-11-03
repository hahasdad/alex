'use strict';
(async()=>{
const singlePageSite=document.body.classList.contains('single-page-site');
if(singlePageSite){
 const sections=[['about','about.html'],['works','works.html'],['film','film.html'],['help','help.html']];
 const loaded=await Promise.all(sections.map(async([id,url])=>{
  try{
   const response=await fetch(url);if(!response.ok)throw new Error(`${response.status} ${url}`);
   const source=new DOMParser().parseFromString(await response.text(),'text/html');
   const sourceMain=source.querySelector('main');if(!sourceMain)throw new Error(`Missing main in ${url}`);
   const section=document.createElement('section');
   section.className=sourceMain.className;section.id=id;section.innerHTML=sourceMain.innerHTML;
   section.querySelectorAll('nav[aria-label="Main navigation"],.monogram').forEach(node=>node.remove());
   const dialogs=[...source.querySelectorAll('dialog')].filter(dialog=>dialog.id!=='project-dialog');
   return {section,dialogs};
  }catch(error){console.error('Could not load scroll section:',error);return null;}
 }));
 const insertionPoint=document.querySelector('#project-dialog');
 loaded.filter(Boolean).forEach(({section,dialogs})=>{
  document.body.insertBefore(section,insertionPoint);
  dialogs.forEach(dialog=>{if(!document.getElementById(dialog.id))document.body.insertBefore(dialog.cloneNode(true),insertionPoint);});
 });
 const routes={'index.html':'#home','about.html':'#about','works.html':'#works','film.html':'#film','help.html':'#help'};
 document.querySelectorAll('a[href]').forEach(link=>{const route=routes[link.getAttribute('href')];if(route)link.setAttribute('href',route);});
}
const mainNav=document.querySelector('nav[aria-label="Main navigation"]');
if(mainNav){
 const scrollNav=document.createElement('div');scrollNav.className='scroll-nav';
 mainNav.parentNode.insertBefore(scrollNav,mainNav);scrollNav.appendChild(mainNav);
 const scrollToggle=document.createElement('button');scrollToggle.type='button';scrollToggle.className='scroll-nav-toggle';scrollToggle.textContent='收起导航 ▲';scrollToggle.setAttribute('aria-expanded','true');scrollToggle.setAttribute('aria-label','收起导航');scrollNav.appendChild(scrollToggle);
 scrollToggle.addEventListener('click',()=>{const collapsed=scrollNav.classList.toggle('is-collapsed');scrollToggle.textContent=collapsed?'展开导航 ▼':'收起导航 ▲';scrollToggle.setAttribute('aria-expanded',String(!collapsed));scrollToggle.setAttribute('aria-label',collapsed?'展开导航':'收起导航');});
}
if(singlePageSite&&mainNav){
 const links=[...mainNav.querySelectorAll('a[href^="#"]')];
 const setCurrent=id=>links.forEach(link=>link.toggleAttribute('aria-current',link.getAttribute('href')===`#${id}`));
 const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)setCurrent(visible.target.id);},{rootMargin:'-25% 0px -55% 0px',threshold:[0,.15,.35]});
 document.querySelectorAll('#home,#about,#works,#film,#help').forEach(section=>observer.observe(section));
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
const musicEndTrim=0.5;
musicAudio.addEventListener('timeupdate',()=>{if(Number.isFinite(musicAudio.duration)&&musicAudio.currentTime>=musicAudio.duration-musicEndTrim){musicAudio.currentTime=0;if(!musicAudio.paused)musicAudio.play().catch(()=>{});}});
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
})();
