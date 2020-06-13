import View from '../base/View';
import MenuLevel from '../components/MenuLevel';
import MenuPage from '../components/MenuPage';
import Tips from '../components/Tips';
import Words from '../components/Words';
import Task from '../components/Task';
import GameButtons from '../components/GameButtons';
import LogoutButton from '../components/LogoutButton';
import Translation from '../components/Translation';

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
          <div class="game__background"></div>
          ${LogoutButton.render()}
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
            ${Translation.render(params.words.currentWord)}
            ${Words.render(params.words, params.events)}
            ${Task.render(params.words.shuffledWord)}
            ${GameButtons.render(params.buttons)}
          </div>
        </div>
    `;
  }

  handleMouseMenus(handler) { // клик на меню (level/page)
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

    levMenu.addEventListener('click', ({ target }) => {
      levMenu.classList.add('hidden');
      if (!target.classList.contains('menu__item')) {
        return;
      }
      handler(target.dataset.level, 'level');
    });

    pageMenu.addEventListener('click', ({ target }) => {
      pageMenu.classList.add('hidden');
      if (!target.classList.contains('menu__item')) {
        return;
      }
      handler(target.dataset.page, 'page');
    });
  }

  handleMouseTask(handlerTask) { // клик на слово в задании и в раунде
    const taskSelector = document.querySelector('.task .task__words');
    const allWordsInTask = document.querySelectorAll('.task .task__words .task__word');
    taskSelector.addEventListener('click', ({ target }) => {
      if (!target.classList.contains('task__word')) {
        return;
      }
      handlerTask({ clickedWord: target, allWords: allWordsInTask }, 'task');
    });

    const roundSelector = document.querySelector('.phrase__words.empty');
    // const allWordsInRound = document.querySelectorAll('.phrase__words.empty .phrase__word');
    roundSelector.addEventListener('click', ({ target }) => {
      if (roundSelector.classList.contains('round__done')) {
        return;
      }
      if (!target.classList.contains('phrase__word')) {
        return;
      }
      handlerTask({ clickedWord: target, allWords: allWordsInTask }, 'round');
    });
  }

  handleMouseCheck(handlerCheck) { // клик на кнопке "Check"
    const buttonCheck = document.querySelector('.game__button.check');
    const allWordsInRound = document.querySelectorAll('.phrase__words.empty .phrase__word');

    buttonCheck.addEventListener('click', () => {
      handlerCheck(allWordsInRound);
    });
  }

  handleMouseIdk(handlerIdk) { // клик по кнопке "I don't know"
    const buttonIdk = document.querySelector('.game__button.idk');
    // const allWordsInTask = document.querySelectorAll('.task .task__words .task__word');

    buttonIdk.addEventListener('click', () => {
      handlerIdk();
    });
  }

  handleMouseCont(handlerCont) { // клик по кнопке "Continue"
    const buttonCont = document.querySelector('.game__button.cont');

    buttonCont.addEventListener('click', () => {
      handlerCont();
    });
  }

  handleMouseLogout(handlerLogout) {// клик по кнопке "Logout"
    const logOutButton = document.querySelector('.logout .logout__button');
    logOutButton.addEventListener('click', () => {
      handlerLogout();
    })
  }

  clearGame() {
    const gameField = document.querySelector('.container');
    gameField.innerHTML = '';
  }

  handleMouseSoundIcon(handlerSoundIcon) {
    const soundIconButton = document.querySelector('.sound__icon');
    soundIconButton.addEventListener('click', () => {
      handlerSoundIcon();
    });
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
