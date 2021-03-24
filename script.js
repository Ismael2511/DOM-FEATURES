'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
document.documentElement

//querySelectorAll is iterable
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Creating Elements
const msgCookie = document.createElement('div');
msgCookie.classList.add('cookie-message');
//Selecting Elements
const header = document.querySelector('.header');
msgCookie.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; 
header.append(msgCookie);

document.querySelector('.btn--close-cookie').addEventListener('click', () =>{
  //Delete Elements
  msgCookie.remove();
});

//SMOOTH SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', (e) => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  
  //logging the current coords of the Target
  console.log(e.target.getBoundingClientRect());

  //OLD SCHOOL
  // window.scrollTo(s1coords.left + window.pageXOffset,
  //                 s1coords.top + window.pageYOffset);
//   window.scrollTo({
//     left:s1coords.left + window.pageXOffset,
//     top: s1coords.top + window.pageYOffset,
//     behavior:'smooth'
//   });
  //ES6
  section1.scrollIntoView({behavior: 'smooth'});
});

// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(this);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// })
//Event Delegation 

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click',function(e) {
  e.preventDefault();
  console.log(e.target)
  //Matching Strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

//TABBED COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// - Common Parent Element
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if(!clicked) return;

  //removing active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active Tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

/**Menu Fade Animation */
const nav = document.querySelector('.nav');

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/**STICKY NAVIGATION */
// let s1Coords = section1.getBoundingClientRect();
// console.log(s1Coords.top)
// window.addEventListener('scroll',function(){
//   if(window.scrollY > s1Coords.top) nav.classList.add('sticky')
//   else nav.classList.remove('sticky');
// });

//INTERSECTION OBSERVER API
const navHeight = nav.getBoundingClientRect().height 
const stickyNav = function(entries){
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px`
});

headerObserver.observe(header)

//REVEAL SECTION
const allSections = document.querySelectorAll('.section');

const revealObserver = function(entries,observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
};
const sectionObserver = new IntersectionObserver(revealObserver,{
  root:null,
  threshold:0.15
});
allSections.forEach(section =>{
  sectionObserver.observe(section)
  // section.classList.add('section--hidden')
});

//LAZY IMAGES

const imgTarget = document.querySelectorAll('img[data-src]');
const loadImg = function(entries,observer){
  const [entry] = entries;

  //Guard 
  if(!entry.isIntersecting) return;

  //Replacing src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img')
  })
}

const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold:0,
  rootMargin:`-200px`
});

imgTarget.forEach(img => imgObserver.observe(img));

//SLIDER

(() =>{

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions

  const createDots = function(){
    slides.forEach((_,i) => {
      dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  const activateDots = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove("dots__dot--active"));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }
  const goToSlide = function(slide){
    slides.forEach((s,index) => s.style.transform = `translateX(${100 * (index - slide)}%)`);
  }

  const nextSlide = function(){
    if(curSlide === maxSlide - 1){
      curSlide = 0;
    }else{
      curSlide++
    }
    goToSlide(curSlide)
    activateDots(curSlide)
  }
  const prevSlide = function(){
    if(curSlide === 0){
      curSlide = maxSlide - 1;
    }else{
      curSlide--
    }
    goToSlide(curSlide)
    activateDots(curSlide)
  }

  const init = function(){
    createDots();
    activateDots(0)
    goToSlide(0)  
  }
  init();

  //Event Handlers
  btnLeft.addEventListener('click', prevSlide)
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide)
      activateDots(slide)
    }
  })
})();

const loading = function(e){
  
}
document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM tree built', e)
})
window.addEventListener("load", function(e){
  // document.querySelector("body").style.background = "red";
  console.log("Loaded",e)
})

// window.addEventListener('beforeunLoad',function(e){
//   e.preventDefault();
//   e.returnValue = ''
// })