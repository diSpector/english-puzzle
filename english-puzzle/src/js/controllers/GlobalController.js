import Controller from '../base/Controller';

export default class GlobalController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  init() {
    this.view.clear();
    this.view.init(this.config.roundStats);
    this.view.handleMouseLogout(this.processLogoutClick);
    this.view.handleMouseCont(this.processContClick);
  }

  processContClick = () => {
    this.events.notify('goBackToGame', true);
  }

  processLogoutClick = () => { // нажатие на кнопку "Logout"
    this.events.notify('logOutUser', true);
  }
}
