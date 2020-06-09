import Controller from '../base/Controller';

export default class GameController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  async init(params = {}) {
    console.log('container', document.querySelector('.container'));
    const levels = this.model.getElementsFromMax(this.config.level, this.config.maxLevels);
    const pages = this.model.getElementsFromMax(this.config.page, this.config.maxPages);
    const words = await this.model.getWords(this.config.level, this.config.page);
    const currentLev = this.config.level;
    const currentPage = this.config.page;
    this.view.clearGame();
    this.view.init({ words, levels : {levels, current : currentLev}, pages: {pages, current : currentPage}});
    this.view.handleMouse(this.processMenuClick);
  }

  processMenuClick = (data, key) => { 
    this.config[key] = parseInt(data, 10);
    this.init();
  }


  //   processLogin = async ({emailVal: email, passVal: password}) => {
  //     if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
  //       const loggedUser = await this.model.loginUser({email, password}, this.processApiErrors); 
  //       if (loggedUser) {
  //         this.events.notify('userIsLogin', loggedUser);
  //       }
  //     } 
  //   }

  //   processRegister = async ({emailVal: email, passVal: password}) => {
  //     if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
  //       const newUser = await this.model.createUser({email, password}, this.processApiErrors); 
  //       const loggedUser = (newUser) ? await this.model.loginUser({email, password}, this.processApiErrors) : null;
  //       if (loggedUser) {
  //         this.events.notify('userIsLogin', loggedUser);
  //       }
  //     } 
  //   }

  //   processValidationErrors = (errors) => {
  //     this.view.showErrors(errors);
  //   }

  //   processApiErrors = (errorText) => {
  //     this.view.showApiError(errorText);
  //   }

}
