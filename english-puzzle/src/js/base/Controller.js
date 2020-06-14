import EventEmitter from '../components/EventEmitter';

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.events = new EventEmitter();
  }

  init() {
  }
}
