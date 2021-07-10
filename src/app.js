import "./style.css";

console.log("app.working");

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


    if (
      dragShift > 100 &&
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

  setStylePosition() {
    this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
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