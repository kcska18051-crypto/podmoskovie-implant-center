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
