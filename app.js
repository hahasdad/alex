'use strict';
(async()=>{
const singlePageSite=document.body.classList.contains('single-page-site');
if(singlePageSite){
 const sections=[['about','about.html'],['works','works.html'],['help','help.html']];
 const loaded=await Promise.all(sections.map(async([id,url])=>{
  try{
   const response=await fetch(url);if(!response.ok)throw new Error(`${response.status} ${url}`);
   const source=new DOMParser().parseFromString(await response.text(),'text/html');
   const sourceMain=source.querySelector('main');if(!sourceMain)throw new Error(`Missing main in ${url}`);
   sourceMain.querySelectorAll('img').forEach(image=>{image.loading='lazy';image.decoding='async';});
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
 const routes={'index.html':'#home','about.html':'#about','works.html':'#works','help.html':'#help'};
 document.querySelectorAll('a[href]').forEach(link=>{const route=routes[link.getAttribute('href')];if(route)link.setAttribute('href',route);});
}
const mainNav=document.querySelector('nav[aria-label="Main navigation"]');
let scrollNav,scrollToggle,languageMenu;
if(mainNav){
 scrollNav=document.createElement('div');scrollNav.className='scroll-nav';
 mainNav.parentNode.insertBefore(scrollNav,mainNav);scrollNav.appendChild(mainNav);
 scrollToggle=document.createElement('button');scrollToggle.type='button';scrollToggle.className='scroll-nav-toggle';scrollToggle.setAttribute('aria-expanded','true');scrollNav.appendChild(scrollToggle);
 scrollToggle.addEventListener('click',()=>{const collapsed=scrollNav.classList.toggle('is-collapsed');scrollToggle.setAttribute('aria-expanded',String(!collapsed));if(collapsed&&languageMenu)languageMenu.hidden=true;applyLanguage(currentLanguage);});
}
if(singlePageSite&&mainNav){
 const links=[...mainNav.querySelectorAll('a[href^="#"]')];
 const setCurrent=id=>links.forEach(link=>link.toggleAttribute('aria-current',link.getAttribute('href')===`#${id}`));
 const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)setCurrent(visible.target.id);},{rootMargin:'-25% 0px -55% 0px',threshold:[0,.15,.35]});
 document.querySelectorAll('#home,#about,#works,#help').forEach(section=>observer.observe(section));
}
const translationEntries=[
 ['nav a[href="#home"],nav a[href="index.html"]','首页'],['nav a[href="#about"],nav a[href="about.html"]','关于我'],['nav a[href="#works"],nav a[href="works.html"]','作品'],['nav a[href="#help"],nav a[href="help.html"]','帮助'],
 ['.home .layer-17','自封的最伟大国王'],['.home .layer-18','向下探索 ↓'],['.home-help-link','我能帮你什么？'],
 ['.about .layer-127','关于泓博·郝'],['.about .layer-128','第一章'],['.about .layer-131','我是泓博·郝，一名热爱电影制作、电脑和中世纪历史的学生。'],['.about .layer-132','我喜欢把想法变成现实。我创办了电影社，导演并剪辑过短片，从零组装了自己的第一台电脑，也带领团队研究过中世纪攻城战。'],['.about .layer-133','我喜欢学习新事物、接受挑战，也喜欢把大家聚在一起，创造有意义的作品。'],
 ['.works .layer-151','电影制作与电影社'],['.works .layer-152','组装我的第一台电脑'],['.works .layer-153','中世纪攻城战'],['.works .layer-154','我创办了电影社，并带领团队完成一部短片，担任导演、制片和剪辑。'],['.works .layer-155','从研究配件到组装整机，我从零开始完成了自己的第一台电脑。'],['.works .layer-156','我带领团队研究中世纪攻城武器、制作投石器模型并展示研究成果。'],
 ['.film .layer-173','一部电影的诞生'],['.film .layer-180','一个校园项目如何变成电影社'],['.film .layer-184','I · 开始'],['.film .layer-185','II · 幕后制作'],['.film .layer-186','III · 延续'],['.film .layer-187','一切始于一个校园电影项目。我召集同学一起制作短片，并在过程中创办了电影社。'],['.film .layer-190','我承担了导演、制片、剪辑和选角等多个角色，带领团队从前期策划走到最终剪辑。'],['.film .layer-191','我们完成了短片，但故事并没有结束。电影社在最初项目结束后继续发展。'],
 ['.help-page .help-kicker','第二章'],['.help-page .help-hero h1','我能帮你什么？'],['.help-card:nth-child(1) .help-eyebrow','和我一起拍短片'],['.help-card:nth-child(1) h2','开始你的短片'],['.help-card:nth-child(1) summary','查看活动详情'],['.help-card:nth-child(2) .help-eyebrow','和我一起探索历史'],['.help-card:nth-child(2) h2','走进中世纪世界'],['.help-card:nth-child(2) summary','查看活动详情'],['.help-footer a','进一步了解泓博·郝'],['.note','暂无更多项目资料。'],['#video-dialog h2','电影播放器'],['#video-dialog .upload-policy strong','仅限站长管理']
];
const originalMarkup=new WeakMap();
let currentLanguage=localStorage.getItem('site-language')==='zh'?'zh':'en';
const applyLanguage=language=>{
 currentLanguage=language;document.documentElement.lang=language==='zh'?'zh-CN':'en';document.body.classList.toggle('lang-zh',language==='zh');document.body.classList.toggle('lang-en',language==='en');
 translationEntries.forEach(([selector,chinese])=>document.querySelectorAll(selector).forEach(element=>{if(!originalMarkup.has(element))originalMarkup.set(element,element.innerHTML);element.innerHTML=language==='zh'?chinese:originalMarkup.get(element);}));
 if(scrollToggle){const collapsed=scrollNav.classList.contains('is-collapsed');scrollToggle.textContent=language==='zh'?(collapsed?'展开导航 ▼':'收起导航 ▲'):(collapsed?'OPEN MENU ▼':'ROLL UP ▲');scrollToggle.setAttribute('aria-label',language==='zh'?(collapsed?'展开导航':'收起导航'):(collapsed?'Open navigation':'Roll up navigation'));}
 if(languageMenu){languageMenu.querySelectorAll('[data-language]').forEach(button=>button.classList.toggle('is-active',button.dataset.language===language));}
 const settingsButton=document.querySelector('.language-settings-button');if(settingsButton)settingsButton.setAttribute('aria-label',language==='zh'?'语言设置':'Language settings');
};
if(scrollNav){
 const settingsButton=document.createElement('button');settingsButton.type='button';settingsButton.className='language-settings-button';settingsButton.innerHTML='<span aria-hidden="true">⚙</span>';settingsButton.setAttribute('aria-haspopup','true');settingsButton.setAttribute('aria-expanded','false');scrollNav.appendChild(settingsButton);
 languageMenu=document.createElement('div');languageMenu.className='language-menu';languageMenu.hidden=true;languageMenu.innerHTML='<strong>语言 / Language</strong><button type="button" data-language="zh">中文</button><button type="button" data-language="en">English</button>';scrollNav.appendChild(languageMenu);
 settingsButton.addEventListener('click',()=>{languageMenu.hidden=!languageMenu.hidden;settingsButton.setAttribute('aria-expanded',String(!languageMenu.hidden));});
 languageMenu.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{localStorage.setItem('site-language',button.dataset.language);applyLanguage(button.dataset.language);languageMenu.hidden=true;settingsButton.setAttribute('aria-expanded','false');}));
 document.addEventListener('click',event=>{if(!scrollNav.contains(event.target)){languageMenu.hidden=true;settingsButton.setAttribute('aria-expanded','false');}});
}
applyLanguage(currentLanguage);
const projectInfo={pc:{en:['Building My First PC','From researching components to assembling the machine, I built my first computer from scratch.'],zh:['组装我的第一台电脑','从研究配件到组装整机，我从零开始完成了自己的第一台电脑。']},siege:{en:['Medieval Siege Warfare','I led a team to research medieval siege weapons, build a catapult model, and present our findings.'],zh:['中世纪攻城战','我带领团队研究中世纪攻城武器、制作投石器模型并展示研究成果。']}};
const projectDialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const [title,description]=projectInfo[button.dataset.project][currentLanguage];projectDialog.querySelector('h2').textContent=title;projectDialog.querySelector('p').textContent=description;projectDialog.showModal();}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});});
const videoDialog=document.querySelector('#video-dialog');
if(videoDialog){
 const videoTrigger=document.querySelector('.video-trigger');
 if(videoTrigger)videoTrigger.addEventListener('click',()=>videoDialog.showModal());
}

await import('./candle.js?v=sfx-1');
await import('./sounds.js?v=sfx-1');
await import('./duel.js?v=sfx-1');
if (singlePageSite) {
 const { initFilmView } = await import('./film-view.js?v=film-1');
 initFilmView(() => applyLanguage(currentLanguage));
}
})();
