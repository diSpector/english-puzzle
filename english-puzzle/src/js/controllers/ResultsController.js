import Controller from '../base/Controller';

export default class ResultsController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  init() {
    this.view.clear();
    this.view.init(this.config.roundStats);
    this.view.handleSoundClick(this.handleSound);
    this.view.handleMouseLogout(this.processLogoutClick);
    this.view.handleMouseCont(this.processContClick);
  }

  processContClick = () => {
    this.events.notify('clearRound', true);
    this.events.notify('goBackToGame', true);
  }

  handleSound = (elem) => {
    const { roundStats } = this.config;
    this.model.processSound(elem, roundStats);
  }

  processLogoutClick = () => { // нажатие на кнопку "Logout"
    this.events.notify('logOutUser', true);
  }
}
