const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
const dialog=document.querySelector('#demo-dialog');
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();dialog.showModal()}));
dialog.querySelector('button').addEventListener('click',()=>dialog.close());
const track=document.querySelector('.rev-track'),slides=[...document.querySelectorAll('.rev-slide')];let current=0;
function showReview(){track.style.transform=`translateX(${-current*100}%)`;document.querySelector('.rev-count b').textContent=current+1;slides.forEach((slide,i)=>{slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current))})}
document.querySelectorAll('[data-rev]').forEach(button=>button.addEventListener('click',()=>{current=(current+(button.dataset.rev==='next'?1:-1)+slides.length)%slides.length;showReview()}));
if(slides.length)showReview();

function setupPanels(buttonSelector,panelSelector,hover=false){
 const buttons=[...document.querySelectorAll(buttonSelector)],panels=[...document.querySelectorAll(panelSelector)];
 const activate=index=>{buttons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1});panels.forEach((p,i)=>p.hidden=i!==index)};
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>activate(index));
  if(hover)button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')activate(index)});
  button.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%buttons.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index-1+buttons.length)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;e.preventDefault();activate(next);buttons[next].focus()});
 });
}
setupPanels('.system-tab','.system-panel');
setupPanels('.cap-tab','.cap-panel');
setupPanels('.solution-tab','.solution-panel');
const caseGallery=document.querySelector('.cases');
if(caseGallery){
 const cases=[...caseGallery.querySelectorAll('.case')],prev=document.querySelector('[data-case="prev"]'),next=document.querySelector('[data-case="next"]'),count=document.querySelector('.case-count');
 let caseIndex=0;
 const updateCase=()=>{const step=cases[1]?cases[1].offsetLeft-cases[0].offsetLeft:caseGallery.clientWidth;caseIndex=Math.max(0,Math.min(cases.length-1,Math.round(caseGallery.scrollLeft/step)));count.textContent=`${caseIndex+1} / ${cases.length}`;prev.disabled=caseIndex===0;next.disabled=caseIndex===cases.length-1};
 const moveCase=direction=>{const index=Math.max(0,Math.min(cases.length-1,caseIndex+direction));caseGallery.scrollTo({left:cases[index].offsetLeft-cases[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};
 prev.addEventListener('click',()=>moveCase(-1));next.addEventListener('click',()=>moveCase(1));caseGallery.addEventListener('scroll',updateCase,{passive:true});window.addEventListener('resize',updateCase);
 caseGallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveCase(e.key==='ArrowRight'?1:-1)}});updateCase();
}

// Mobile explorers share the existing accessible tabs; arrows and swipes
// activate the same buttons, so desktop and mobile stay in sync.
function mobileExplorer(tabSelector,panelContainerSelector,label){
 const tabs=[...document.querySelectorAll(tabSelector)],host=document.querySelector(panelContainerSelector);
 if(!host||!tabs.length)return;
 const controls=document.createElement('div');controls.className='mobile-carousel-controls';
 const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('span');
 prev.type=next.type='button';prev.textContent='←';next.textContent='→';
 prev.setAttribute('aria-label',`Предыдущая карточка: ${label}`);next.setAttribute('aria-label',`Следующая карточка: ${label}`);
 status.className='carousel-status';status.setAttribute('aria-live','polite');
 controls.append(prev,status,next);host.before(controls);
 const selected=()=>Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 const update=()=>{const i=selected();status.replaceChildren(document.createTextNode(`${i+1} / ${tabs.length}`));const hint=document.createElement('small');hint.textContent='Листайте влево или вправо';status.append(hint);
 if(matchMedia('(max-width:800px)').matches){const list=tabs[i].parentElement;list.scrollTo({left:tabs[i].offsetLeft-list.offsetLeft-(list.clientWidth-tabs[i].offsetWidth)/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}};
 const move=delta=>tabs[(selected()+delta+tabs.length)%tabs.length].click();
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 tabs.forEach(t=>{t.addEventListener('click',update);t.addEventListener('keydown',()=>queueMicrotask(update));});
 let start=null;
 host.addEventListener('touchstart',e=>{const t=e.touches[0];start={x:t.clientX,y:t.clientY}},{passive:true});
 host.addEventListener('touchend',e=>{if(!start||!matchMedia('(max-width:800px)').matches)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1)},{passive:true});
 host.addEventListener('touchcancel',()=>{start=null},{passive:true});update();
}
mobileExplorer('.solution-tab','.solution-panels','восстановление зубов');
mobileExplorer('.cap-tab','.cap-panels','возможности центра');

const interiorTrack=document.querySelector('.interior-track');
if(interiorTrack){
 const moveInterior=direction=>{const slide=interiorTrack.querySelector('.interior-slide');const step=slide.getBoundingClientRect().width+parseFloat(getComputedStyle(interiorTrack).gap);const end=interiorTrack.scrollWidth-interiorTrack.clientWidth;let left=interiorTrack.scrollLeft+direction*step;if(direction>0&&interiorTrack.scrollLeft>=end-2)left=0;if(direction<0&&interiorTrack.scrollLeft<=2)left=end;interiorTrack.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};
 document.querySelector('.interior-arrow.prev').addEventListener('click',()=>moveInterior(-1));
 document.querySelector('.interior-arrow.next').addEventListener('click',()=>moveInterior(1));
 interiorTrack.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveInterior(e.key==='ArrowRight'?1:-1)}});
}
document.querySelectorAll('.video-launch').forEach(button=>button.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src=`https://vkvideo.ru/video_ext.php?oid=-202085834&id=${button.dataset.video}&hd=2&autoplay=0`;frame.title=button.getAttribute('aria-label');frame.allow='fullscreen; encrypted-media; picture-in-picture';frame.allowFullscreen=true;button.replaceWith(frame)}));
