import View from '../base/View';
import MenuLevel from '../components/MenuLevel';
import MenuPage from '../components/MenuPage';
import Tips from '../components/Tips';
import Words from '../components/Words';
import Task from '../components/Task';
import GameButtons from '../components/GameButtons';
import LogoutButton from '../components/LogoutButton';
import Translation from '../components/Translation';
import SoundBlock from '../components/SoundBlock';

export default class GameView extends View {
  constructor(container, components, config) {
    super(container);
    this.components = components;
    this.config = config;
  }

  getTemplate(params = {}) {
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
              ${Tips.render(params.tipsMenuConfig)}
            </div>
            ${SoundBlock.render(params.tipsRoundConfig.audio)}
            ${Translation.render(params.words.currentWord, params.tipsRoundConfig.translate)}
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

  handleMouseLogout(handlerLogout) { // клик по кнопке "Logout"
    const logOutButton = document.querySelector('.logout .logout__button');
    logOutButton.addEventListener('click', () => {
      handlerLogout();
    });
  }

  clearGame() {
    const gameField = document.querySelector('.container');
    gameField.innerHTML = '';
  }

  handleMouseSoundIcon(handlerSoundIcon) {
    const soundIconButton = document.querySelector('.sound__icon');
    if (soundIconButton.classList.contains('disabled')) { //
      return;
    }

    soundIconButton.addEventListener('click', () => {
      handlerSoundIcon();
    });
  }

  handleMouseTips(handlerTipsClick) {
    const tipsContainer = document.querySelector('.tips');
    tipsContainer.addEventListener('click', ({ target }) => {
      if (!target.classList.contains('tip__button')) {
        return;
      }
      handlerTipsClick(target);
    });
  }

  handleMouseRes(handlerResults) {
    const buttonRes = document.querySelector('.game__button.res');

    buttonRes.addEventListener('click', () => {
      handlerResults();
    });
  }

  showPlaying() {
    const soundIconButton = document.querySelector('.sound__icon');
    if (!soundIconButton.classList.contains('playing')) {
      soundIconButton.classList.add('playing');
    }
  }

  hidePlaying() {
    const soundIconButton = document.querySelector('.sound__icon');
    if (soundIconButton.classList.contains('playing')) {
      soundIconButton.classList.remove('playing');
    }
  }
}
