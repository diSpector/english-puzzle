import Controller from '../base/Controller';

export default class StartController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  init() {
    this.view.init();
    this.view.processStart(this.processStart);
  }

  processStart = () => {
    this.events.notify('startClicked', {});
  }
}
