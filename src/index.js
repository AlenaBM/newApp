import "./style.css";

const appClassName = 'wrap';
const appLineClassName = 'app-line';
const appSlideClassName = 'app-slide';

class App {
  constructor(element, options = {}) {
    this.containerNode = element;
    this.size = element.childElementCount;
    this.currentSlide = 0;
    this.currentSlideWasChanged = false;

    this.manageHTML = this.manageHTML.bind(this);
    this.setParameters = this.setParameters.bind(this);
    this.setEvents = this.setEvents.bind(this);
    this.resizeAppWrap = this.resizeAppWrap.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.dragging = this.dragging.bind(this);
    this.setStylePosition = this.setStylePosition.bind(this);

    this.manageHTML();
    this.setParameters();
    this.setEvents();
  }
  manageHTML() {
    this.containerNode.classList.add(appClassName);
    this.containerNode.innerHTML = `
    <div class = "${appLineClassName}">
      ${this.containerNode.innerHTML}
    </div>
    `;
    this.lineNode = this.containerNode.querySelector(`.${appLineClassName}`);

    this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
      wrapElByDiv({
        element: childNode,
        className: appSlideClassName
      })
    );
  }
  setParameters() {
    const coordsContainer = this.containerNode.getBoundingClientRect();
    this.width = coordsContainer.width;
    this.maximumX = -(this.size - 1) * this.width;
    this.x = -this.currentSlide * this.width;

    this.resetStyleTransition();
    this.lineNode.style.width = `${this.size * this.width}px`;
    this.lineNode.style.height = `100%`;
    this.setStylePosition();
    Array.from(this.slideNodes).forEach((slideNode) => {
      slideNode.style.width = `${this.width}px`;
      slideNode.style.height = `100%`;
    });
  }
  setEvents() {
    this.debouncedResizeAppWrap = debounce(this.resizeAppWrap);
    window.addEventListener('resize', this.debouncedResizeAppWrap);
    this.lineNode.addEventListener('pointerdown', this.startDrag);
    window.addEventListener('pointerup', this.stopDrag);
    window.addEventListener('pointercancel', this.stopDrag);
  }

  destroyEvents() {
    window.removeEventListener('resize', this.debouncedResizeAppWrap);
    this.lineNode.removeEventListener('pointerdown', this.startDrag);
    window.removeEventListener('pointerup', this.stopDrag);
    window.removeEventListener('pointercancel', this.stopDrag);

  }

  resizeAppWrap() {
    this.setParameters();
  }

  startDrag(evt) {
    this.currentSlideWasChanged = false;
    this.clickX = evt.pageX;
    this.startX = this.x;
    this.resetStyleTransition();
    window.addEventListener('pointermove', this.dragging);
  }

  stopDrag() {
    window.removeEventListener('pointermove', this.dragging);
    this.x = -this.currentSlide * this.width;
    this.setStylePosition();
    this.setStyleTransition();
  }

  dragging(evt) {
    this.dragX = evt.pageX;
    const dragShift = this.dragX - this.clickX;
    const easing = dragShift / 5;
    this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);

    this.setStylePosition();
    this.setAnimation();


    if (
      dragShift > -100 &&
      dragShift > 0 &&
      !this.currentSlideWasChanged &&
      this.currentSlide > 0
    ) {
      this.currentSlideWasChanged = true;
      this.currentSlide = this.currentSlide - 1;
    }

    if (
      dragShift < 100 &&
      dragShift < 0 &&
      !this.currentSlideWasChanged &&
      this.currentSlide < this.size - 1
    ) {
      this.currentSlideWasChanged = true;
      this.currentSlide = this.currentSlide + 1;
    }
  }

  setAnimation() {
    const sperm1 = document.querySelector('.sperm2-icon');
    sperm1.style.cssText = `animation: spermMoving1 2.4s 1 linear`;

    const sperm2 = document.querySelector('.sperm3-icon');
    sperm2.style.cssText = `animation: spermMoving2 2.4s 1 linear`;

    const sperm3 = document.querySelector('.sperm4-icon');
    sperm3.style.cssText = `animation: spermMoving3 2.4s 1 linear`;

    const sperm4 = document.querySelector('.sperm5-icon');
    sperm4.style.cssText = `animation: spermMoving4 2.4s 1 linear`;

    const sperm5 = document.querySelector('.sperm6-icon');
    sperm5.style.cssText = `animation: spermMoving5 2.4s 1 linear`;
  }
  setStylePosition() {
    this.lineNode.style.transform = `translateX(${this.x}px)`;
  }
  setStyleTransition() {
    this.lineNode.style.transition = `all 0.5s linear 0s`;
  }
  resetStyleTransition() {
    this.lineNode.style.transition = `all 0s linear 0s`;
  }
}

function wrapElByDiv({ element, className }) {
  const wrapperNode = document.createElement('div');
  wrapperNode.classList.add(className);

  element.parentNode.insertBefore(wrapperNode, element);
  wrapperNode.appendChild(element);

  return wrapperNode;
}

function debounce(func, time = 100) {
  let timer;
  return function (e) {
    clearTimeout(timer);
    timer = setTimeout(func, time, e);
  };
}



new App(document.getElementById('appWrap'));



const popupList = document.querySelector('.popup-list');
const popupHead = popupList.querySelector('.head-list');
const popupChild = popupList.querySelector('.popup-ul-child');
const btnPrev = popupList.querySelector('.popup-btn-prev');
const btnNext = popupList.querySelector('.popup-btn-next');
const dot = popupList.querySelector('.dot-active');
const dotChild = popupList.querySelector('.dot-child');



function nextSlide(e) {
  e.preventDefault();
  popupHead.classList.remove('head-list');
  popupChild.classList.add('head-list');
  dot.classList.remove('dot-active');
  dotChild.classList.add('dot-active');
}
function prevSlide(e) {
  e.preventDefault();
  popupHead.classList.add('head-list');
  popupChild.classList.remove('head-list');
  dot.classList.add('dot-active');
  dotChild.classList.remove('dot-active');
}


btnNext.addEventListener('click', nextSlide);
btnPrev.addEventListener('click', prevSlide);