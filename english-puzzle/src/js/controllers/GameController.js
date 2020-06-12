import Controller from '../base/Controller';

export default class GameController extends Controller {
  constructor(model, view, config) {
    super(model, view);
    this.config = config;
    this.state = {};
    /** @property 
     * state : { 
          words: { solvedWords, currentWord, shuffledWord, roundWord},
          levels: { levels, current },
          pages: { pages, current },
          rounds: { currentRound },
          buttons: { idk : bool, check : bool, cont : bool, res: bool},
          events: [],
        }
    */
  }

  async init(params = {}) {

    const levels = this.model.getElementsFromMax(this.config.level, this.config.maxLevels);
    const pagesCount = await this.model.getPagesForLevel(this.config.level);
    const pages = this.model.getElementsFromMax(this.config.page, pagesCount);
    const words = await this.model.getWords(this.config.level, this.config.page);
    console.log('words', words);
    const currentLev = this.config.level;
    const currentPage = this.config.page;
    const currentRound = 4; // !!!!!!!
    // const currentRound = this.state.rounds ? this.state.rounds.currentRound : 1; // !!!
    const { solvedWords, currentWord } = this.model.getRoundConfig(words, currentRound);
    const shuffledWord = this.model.shuffleWord(currentWord);
    const roundWord = [];

    this.setState({
      words: { solvedWords, currentWord, shuffledWord, roundWord },
      levels: { levels, current: currentLev },
      pages: { pages, current: currentPage },
      rounds: { currentRound },
      buttons: { idk: true, check: false, cont: false, res: true },
      events: [],
    });

    console.log('this.state', this.state);


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
    // this.view.handleMouseTask(this.processTaskClick, this.processRoundClick);
  }

  processMenuClick = (data, key) => { // клик по меню (этапу/странице)
    this.config[key] = parseInt(data, 10);
    this.init();
  }

  processContClick = () => {
    const { rounds : { currentRound } } = this.state;
    const newRound = currentRound + 1;
    console.log('newRound', newRound);

    this.updateState({ rounds: { currentRound : newRound } });
    console.log('this.state after update', this.state);
    this.renderView();
  }

  processIdkClick = () => { // клик по кнопке "I don't know"
    const { words, buttons, events } = this.state;
    const { roundWord, shuffleWord } = this.model.getObjForIdk(words);
    words.shuffledWord = shuffleWord;
    words.roundWord = roundWord;

    buttons.check = false;
    buttons.idk = false;
    buttons.cont = true;

    events.push('roundIsOver');

    this.updateState({ words: words, events: events, buttons: buttons });
    this.renderView();
  }

  /**
   * Проверить, верный ли порядок слов в предложении
   * @param {NodeList[]} allWordsInRound 
   */
  processCheckClick = (allWordsInRound) => {
    const currentWord = this.state.words.currentWord.textExample;
    const isWordCorrect = this.model.isRoundWordsCorrect(currentWord, allWordsInRound);
    console.log('isWordCorrect', isWordCorrect);

  }

  /** 
   * @param {clickedWord: HtmlElement, allWords: NodeList[]} data
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
  */
  processTaskClick = (data, typeStr) => { // клик по слову в задании (добавление в раунд)
    const { words, buttons } = this.state;
    const { roundWords: roundWord, shuffleWords: newShuffled }
      = this.model.processClickWord(data, words, typeStr);

    words.roundWord = roundWord;
    words.shuffledWord = newShuffled;

    buttons.check = this.model.getButtonsConfig(words);

    this.updateState({ words: words, buttons: buttons });
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


// processRoundClick = (data) => { // клик по слову в раунде (добавление в задание)
//   const { words } = this.state;

//   const newData = this.model.processClickRoundWord(data, words);
//   const { roundWords: roundWord, shuffleWords: newShuffled } = newData;

//   words.roundWord = roundWord;
//   words.shuffledWord = newShuffled;
//   this.updateState({ words: words });
//   this.renderView();
// }