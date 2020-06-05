import View from '../base/View';

export default class LoginView extends View {
  constructor(container, config) {
    super(container);
    this.config = config;
  }

  processAuth(handlerLogin, handlerPass) {
    const loginButton = document.querySelector(this.config.loginButton);
    loginButton.addEventListener('click', () => {
      this.handleAuth(handlerLogin);
    });

    const registerButton = document.querySelector(this.config.registerButton);
    registerButton.addEventListener('click', () => {
      this.handleAuth(handlerPass);
    });
  }

  handleAuth(handler) {
    const emailVal = document.querySelector(this.config.emailInput).value;
    const passVal = document.querySelector(this.config.passInput).value;
    handler({ emailVal, passVal });
  }

  showErrors(errorsObj) {
    const emailErrorBlock = document.querySelector(this.config.emailErrorBlock);
    const passErrorBlock = document.querySelector(this.config.passErrorBlock);
    emailErrorBlock.innerText = ('email' in errorsObj) ? errorsObj.email : '';
    passErrorBlock.innerText = ('pass' in errorsObj) ? errorsObj.pass : '';
  }

  showApiError(errorText) {
    const apiErrorBlock = document.querySelector(this.config.apiErrorBlock);
    apiErrorBlock.innerText = errorText;
  }

  getTemplate() {
    return `
    <div class="login">
      <div class="form">
        <div class="form__title">
            Login
        </div>
        <div class="form__credentials">
            <div class="form__input">
                <div class="input__help">Email</div>
                <input type="text" class = "email" placeholder="Enter your email">
                <div class="email input__error"></div>
            </div>
            <div class="form__input">
                <div class="input__help">Password</div>
                <input type="password" class = "password" placeholder="Enter your password">
                <div class="password input__error"></div>
            </div>
        </div>

        <div class="login__button">
            <div class="form__button button__login">Login</div> 
            <div class="input__error login__error"></div>
        </div>
        <div class="or">-or-</div>
        <div class="register__button">
            <div class="form__button button__register">Register</div> 
            <div class="input__error register__error"></div>
        </div>
      </div>
    </div>
    `;
  }
}