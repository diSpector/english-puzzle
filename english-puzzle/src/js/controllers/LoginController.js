import Controller from '../base/Controller';

export default class LoginController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  init() {
    this.view.clear();
    this.view.init();
    this.view.processAuth(this.processLogin, this.processRegister);
  }

  processLogin = async ({ emailVal: email, passVal: password }) => {
    if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
      const loggedUser = await this.model.loginUser({ email, password }, this.processApiErrors);
      console.log('loggedUser', loggedUser);
      if (loggedUser) {
        this.events.notify('userIsLogin', loggedUser);
      }
    }
  }

  processRegister = async ({ emailVal: email, passVal: password }) => {
    if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
      const newUser = await this.model.createUser({ email, password }, this.processApiErrors);
      const loggedUser = (newUser)
        ? await this.model.loginUser({ email, password }, this.processApiErrors)
        : null;
      if (loggedUser) {
        this.events.notify('userIsLogin', loggedUser);
      }
    }
  }

  processValidationErrors = (errors) => {
    this.view.showErrors(errors);
  }

  processApiErrors = (errorText) => {
    this.view.showApiError(errorText);
  }
}
