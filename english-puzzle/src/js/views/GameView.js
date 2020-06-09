import View from '../base/View';
import MenuLevel from '../components/MenuLevel';
import MenuPage from '../components/MenuPage';
import Tips from '../components/Tips';
import Words from '../components/Words';

export default class GameView extends View {
  constructor(container, components, config) {
    super(container);
    this.components = components;
    this.config = config;
  }

  getTemplate(params = {}) {
    console.log('paramsp', params);
    return `
        <div class="game">
          <div class="field">
            <div class="menu">
              <div class="controls">
                ${MenuLevel.render(params.levels)}
                ${MenuPage.render(params.pages)}
              </div>
              ${Tips.render()}
            </div>
            <div class="sound__block">
              <div class="sound__icon"></div>
            </div>
            <div class="translation__block">
                Женщина любит кататься на велосипеде
            </div>
            ${Words.render(params.words)}
          </div>
        </div>
    `;
  }

  handleMouse (handler) { // клик на меню (level/page)
    const levCur = document.querySelector('.level__current');
    const levMenu = document.querySelector('.level__menu');
    const pageCur = document.querySelector('.page__current');
    const pageMenu = document.querySelector('.page__menu');

    levCur.addEventListener('click', () => {
      levMenu.classList.toggle('hidden');
    });

    pageCur.addEventListener('click', () => {
      pageMenu.classList.toggle('hidden');
    });

    levMenu.addEventListener('click', ({target}) => {
      levMenu.classList.add('hidden');
      if (!target.classList.contains('menu__item')) {
        return;
      }
      handler(target.dataset.level, 'level')
    });

    pageMenu.addEventListener('click', ({target}) => {
      pageMenu.classList.add('hidden');
      if (!target.classList.contains('menu__item')) {
        return;
      }
      handler(target.dataset.page, 'page')
    });
  }

  clearGame() {
    const gameField = document.querySelector('.container');
    gameField.innerHTML = '';
  }

//   processAuth(handlerLogin, handlerPass) {
//     const loginButton = document.querySelector(this.config.loginButton);
//     loginButton.addEventListener('click', () => {
//       this.handleAuth(handlerLogin);
//     });

//     const registerButton = document.querySelector(this.config.registerButton);
//     registerButton.addEventListener('click', () => {
//       this.handleAuth(handlerPass);
//     });
//   }

//   handleAuth(handler) {
//     const emailVal = document.querySelector(this.config.emailInput).value;
//     const passVal = document.querySelector(this.config.passInput).value;
//     handler({ emailVal, passVal });
//   }

//   showErrors(errorsObj) {
//     const emailErrorBlock = document.querySelector(this.config.emailErrorBlock);
//     const passErrorBlock = document.querySelector(this.config.passErrorBlock);
//     emailErrorBlock.innerText = ('email' in errorsObj) ? errorsObj.email : '';
//     passErrorBlock.innerText = ('pass' in errorsObj) ? errorsObj.pass : '';
//   }

//   showApiError(errorText) {
//     const apiErrorBlock = document.querySelector(this.config.apiErrorBlock);
//     apiErrorBlock.innerText = errorText;
//   }

  // init(levObj) {
  //   super.init(levObj);
  // }


}