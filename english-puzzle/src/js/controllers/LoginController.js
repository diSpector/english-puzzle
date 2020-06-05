import Controller from '../base/Controller';

export default class LoginController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
  }

  init() {
    this.view.init(); 
    this.view.processAuth(this.processLogin, this.processRegister);
  }

  processLogin = async ({emailVal: email, passVal: password}) => {
    if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
      const loggedUser = await this.model.loginUser({email, password}, this.processApiErrors); 
      // console.log('loggedUser', loggedUser); // {userId, token, message} //
      if (loggedUser) {
        this.events.notify('userIsLogged', loggedUser);
      }
    } 
  }

  processRegister = async ({emailVal: email, passVal: password}) => {
    let newUser = null;
    let loggedUser = null;
    if (this.model.load(email, password) && this.model.validate(this.processValidationErrors)) {
      newUser = await this.model.createUser({email, password}, this.processApiErrors); 
      // if (newUser) {
      //   loggedUser = await this.model.loginUser({email, password}, this.processApiErrors);
      // }
      loggedUser = (newUser) ? await this.model.loginUser({email, password}, this.processApiErrors) : null;
      if (loggedUser) {
        this.events.notify('userIsLogged', loggedUser);
      }
      // console.log('newUser', newUser); // {id, email}
      // console.log('loggedUser', loggedUser); // {userId:{id}, token, message}
    } 
  }

  processValidationErrors = (errors) => {
    this.view.showErrors(errors);
  }

  processApiErrors = (errorText) => {
    this.view.showApiError(errorText);
  }
  
}
