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
