export default class View {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.render();
  }

  render() {
    const template = this.getTemplate();
    const container = document.querySelector(this.container);
    container.innerHtml = ''; 
    container.insertAdjacentHTML('afterbegin', template);
  }

  getTemplate() {
    return '';
  }

}