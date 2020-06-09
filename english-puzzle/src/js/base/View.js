export default class View {
  constructor(container) {
    this.container = container;
  }

  init(params = {}) {
    this.render(params);
  }

  render(params = {}) {
    const template = this.getTemplate(params);
    const container = document.querySelector(this.container);
    // console.log('container', container);
    container.innerHtml = '';
    container.insertAdjacentHTML('afterbegin', template);
  }

  getTemplate(params = {}) {
    return '';
  }

}