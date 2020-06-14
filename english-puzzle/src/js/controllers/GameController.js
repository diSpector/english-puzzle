import Controller from '../base/Controller';

export default class GameController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
    this.state = {};
    /** @property
     * state : {
          words: { solvedWords, currentWord, shuffledWord, roundWord, allWords},
          levels: { levels, current },
          pages: { pages, current },
          rounds: { current },
          buttons: { idk : bool, check : bool, cont : bool, res: bool},
          events: [],
          tipsMenuConfig: {autosound: bool, translate: bool, audio: bool, picture: bool }
          tipsRoundConfig: {autosound: bool, translate: bool, audio: bool, picture: bool },
        }
    */
  }

  async init() {
    /**
     * level - уровень сложности (1-6)
     * page - страница на этом уровне (1-10) из 10 предложений
     * round - предложение на этой странице (1-10) из слов (до 10 слов)
     */
    const currentLev = this.config.level;
    const currentPage = this.config.page;
    const currentRound = this.config.round;

    const tipsMenuConfig = this.config.tips;
    const tipsRoundConfig = this.config.tips; // при первом запуске - настройки по умолчанию

    // console.log('this.config: ', this.config);

    // получить список уровней (1-6) и страниц для уровней (1-10) с учетом активного
    const pagesCount = await this.model.getPagesForLevel(currentLev);
    const levels = this.model.getElementsFromMax(currentLev, this.config.maxLevels);
    const pages = this.model.getElementsFromMax(currentPage, pagesCount);

    // получить 10 слов для конкретного уровня и страницы
    const words = await this.model.getWords(currentLev, currentPage);
    console.log('words', words);

    /** @var { solvedWords, currentWord, shuffledWord, roundWord, allWords } wordsConfig */
    const wordsConfig = this.model.getRoundConfig(words, currentRound);
    const buttonsConfig = this.model.getButtonsConfig('newRoundBegin');
    console.log('initial words config', wordsConfig);

    this.setState({
      words: wordsConfig,
      levels: { levels, current: currentLev },
      pages: { pages, current: currentPage },
      rounds: { current: currentRound },
      buttons: buttonsConfig,
      events: [],
      tipsMenuConfig,
      tipsRoundConfig,
    });
    this.renderView();
  }

  renderView() {
    this.view.clearGame();
    this.view.init(this.state);
    this.view.handleMouseMenus(this.processMenuClick);
    this.view.handleMouseTask(this.processTaskClick);
    this.view.handleMouseCheck(this.processCheckClick);
    this.view.handleMouseIdk(this.processIdkClick);
    this.view.handleMouseCont(this.processContClick);
    this.view.handleMouseRes(this.processResClick);
    this.view.handleMouseLogout(this.processLogoutClick);
    this.view.handleMouseSoundIcon(this.processSoundIconClick);
    this.view.handleMouseTips(this.processTipsClick);
  }

  processResClick = () => { // нажатие на кнопку "Results"
    const { levels, pages, rounds } = this.state;
    const newLevelPageRound = this.model.getLevelPageRoundConfig(levels, pages, rounds);

    const newLevel = newLevelPageRound.levels.current;
    const newPage = newLevelPageRound.pages.current;
    const newRound = newLevelPageRound.rounds.current;

    this.events.notify('saveStatistics', { newLevel, newPage, newRound });
    this.events.notify('goToResults', true);
  }

  processTipsClick = (data) => { // клик по подсказкам
    const tipsMenuConfig = { ...this.state.tipsMenuConfig };
    const tipsMenuConfigUpdated = this.model.getTipsMenuConfig(data, tipsMenuConfig);

    this.events.notify('saveTips', tipsMenuConfigUpdated);
    this.updateState({
      tipsMenuConfig: tipsMenuConfigUpdated,
    });
    this.renderView();
  }

  processSoundIconClick = () => {
    const { words: { currentWord } } = this.state;
    this.model.playSound(currentWord);
    this.highlightSoundIcon();
  }

  // подсветить иконку звука
  // не используется toggle, чтобы стиль не показался после того, как пользователь
  // его принудительно выключит, перейдя на другой раунд
  highlightSoundIcon() {
    this.view.showPlaying();
    setTimeout(() => {
      this.view.hidePlaying();
    }, 5000);
  }

  processLogoutClick = () => { // нажатие на кнопку "Logout"
    this.events.notify('logOutUser', true);
  }

  /**
   * @param integer data - новый выбранный уровень (level) или страницы (page)
   * @param 'level|page' key - маркер выбора
   */
  processMenuClick = (data, key) => { // клик по меню (этапу/странице)
    if (this.config[key] === parseInt(data, 10)) { // ничего не делать, если выбор тот же
      return;
    }
    this.config[key] = parseInt(data, 10);
    this.config.round = 0; // сбросить раунд при переключении

    this.events.notify('clearRound'); // сбросить статистику раунда при переключении

    this.init();
  }

  processContClick = async () => {
    console.log('this.state', this.state);
    const {
      words, events, levels, pages, rounds, tipsMenuConfig,
    } = this.state;
    const prevPage = pages.current;
    const prevLevel = levels.current;

    const newLevelPageRound = this.model.getLevelPageRoundConfig(levels, pages, rounds);

    const newLevel = newLevelPageRound.levels.current;
    const newPage = newLevelPageRound.pages.current;
    const newRound = newLevelPageRound.rounds.current;

    const isNewLevelOrPage = ((newLevel !== prevLevel) || (newPage !== prevPage));

    const newWords = isNewLevelOrPage
      ? await this.model.getWords(newLevel, newPage)
      : words.allWords;

    const wordsConfig = this.model.getRoundConfig(newWords, newRound);
    const buttonsConfig = this.model.getButtonsConfig('newRoundBegin');

    events.length = 0; // cбросить все стили при переходе на след. раунд

    if (isNewLevelOrPage) { // если переход на новую страницу/уровень
      this.events.notify('clearRound'); // сбросить статистику раунда при переключении
    }

    this.events.notify('saveStatistics', { newLevel, newPage, newRound });
    this.updateState({
      words: wordsConfig,
      events,
      buttons: buttonsConfig,
      ...newLevelPageRound,
      tipsRoundConfig: tipsMenuConfig, // обновить отобр. подсказок в зависимости от кнопок
    });
    this.renderView();
  }

  processIdkClick = () => { // клик по кнопке "I don't know"
    const { words, events, tipsMenuConfig } = this.state;
    const wordsConfig = this.model.processIdkClick(words);

    const isSolvedLastWord = (words.solvedWords.length === 9);
    const buttonEvent = isSolvedLastWord ? 'pageIsOver' : 'IDontKnowClick';
    const buttonsConfig = this.model.getButtonsConfig(buttonEvent);

    events.push('roundIsOver'); // чтобы запретить редактировать собранное слово через стили

    const wordForSave = this.model.getWordObjForSave(words.currentWord, 'fail');
    this.events.notify('saveRoundWord', wordForSave);

    this.updateState({
      words: wordsConfig,
      events,
      buttons: buttonsConfig,
    });
    this.renderView();

    if (tipsMenuConfig.autosound) {
      this.model.playSound(words.currentWord);
      this.highlightSoundIcon();
    }
  }

  /**
   * Проверить, верный ли порядок слов в предложении, подсветить слова
   * @param {NodeList[]} allWordsInRound
   */
  processCheckClick = (allWordsInRound) => {
    const { words, events, tipsMenuConfig } = this.state;
    const isWordCorrect = this.model.isRoundWordsCorrect(words, allWordsInRound);
    const isSolvedLastWord = (isWordCorrect && words.solvedWords.length === 9);

    const wordsConfig = this.model.getColorChecking(words, allWordsInRound);
    // const buttonEvent = (isWordCorrect)
    //   ? (isSolvedLastWord ? 'pageIsOver' : 'roundSuccess')
    //   : 'roundFails';

    // let buttonEvent = (isWordCorrect) ? 'roundSuccess' : 'roundFails';
    // buttonEvent = (isWordCorrect && isSolvedLastWord) ? 'pageIsOver' : buttonEvent;
    let buttonEvent = 'roundFails';
    if (isWordCorrect) {
      buttonEvent = (isSolvedLastWord) ? 'pageIsOver' : 'roundSuccess';
    }

    const buttonsConfig = this.model.getButtonsConfig(buttonEvent);

    if (isWordCorrect) {
      events.push('roundIsOver'); // чтобы запретить редактировать собранное слово через стили
      const wordForSave = this.model.getWordObjForSave(words.currentWord);
      this.events.notify('saveRoundWord', wordForSave);
    }

    this.updateState({
      words: wordsConfig,
      buttons: buttonsConfig,
      events,
    });
    this.renderView();

    // проигрывание звука после обновления вьюхи
    if (isWordCorrect && tipsMenuConfig.autosound) {
      this.model.playSound(words.currentWord);
      this.highlightSoundIcon();
    }
  }

  /**
   * @param {clickedWord: HtmlElement, allWords: NodeList[]} data
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
  */
  processTaskClick = (data, typeStr) => { // клик по слову в задании (добавление в раунд)
    const { words } = this.state;
    const wordsConfig = this.model.processClickWord(data, words, typeStr);
    const isRoundFilled = this.model.isRoundFilled(wordsConfig);

    const buttonEvent = (isRoundFilled) ? 'roundWordFilled' : '';
    const buttonsConfig = this.model.getButtonsConfig(buttonEvent);

    this.updateState({
      words: wordsConfig,
      buttons: buttonsConfig,
    });
    this.renderView();
  }

  setState(stateObj) { // сохранить новый стейт
    this.state = stateObj;
  }

  updateState(newObj) { // обновить стейт
    Object.entries(newObj).forEach(([key, value]) => {
      if (key in this.state) {
        this.state[key] = value;
      }
    });
  }
}
