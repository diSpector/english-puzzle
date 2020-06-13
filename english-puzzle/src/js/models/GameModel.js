import Model from '../base/Model';

export default class GameModel extends Model {
  constructor(config) {
    super();
    this.config = config;
  }

  /**
   * @param {clickedWord: HtmlElement, allWords: NodeList[]} data
   * @param { solvedWords, currentWord, shuffledWord, roundWord, allWords} words
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
  */
  processClickWord(data, words, typeStr) {
    const clickedWordObj = data.clickedWord;
    const clickedWordParams = {
      text: clickedWordObj.innerHTML,
      width: clickedWordObj.offsetWidth,
      order: clickedWordObj.dataset.orderTask,
    };

    const { solvedWords, currentWord, allWords } = words;
    const {
      newRound: round, newShuffled: newShuffledWord,
    } = this.getUpdatedRoundAndTask(clickedWordParams, typeStr);

    const roundWord = words.roundWord.slice(0);
    const shuffledWord = words.shuffledWord.slice(0);

    if (typeStr === 'task') { // клик по слову в поле "задание"
      roundWord.push(round);
      shuffledWord.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);
    } else { // клик по слову в поле собираемых слов ("раунд")
      roundWord.splice(clickedWordObj.dataset.orderRound, 1);
      shuffledWord.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);
    }
    const deColoredRoundWord = roundWord.map((el) => Object.assign(el, { color: null }));
    return {
      solvedWords, currentWord, roundWord: deColoredRoundWord, shuffledWord, allWords,
    };
  }

  /**
   * @param {text, width, order} clickedWord
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
   */
  getUpdatedRoundAndTask(clickedWord, typeStr) {
    const newRound = { ...clickedWord };
    const newShuffled = { ...clickedWord };

    if (typeStr === 'task') {
      newShuffled.text = null;
    } else {
      newRound.text = null;
    }

    return { newRound, newShuffled };
  }

  isRoundFilled(words) {
    return words.shuffledWord.length === words.roundWord.length;
  }

  isRoundWordsCorrect(words, roundHtmlCollection) {
    const roundPhrase = words.currentWord.textExample;
    const roundStr = this.getStrFromHtmlCollection(roundHtmlCollection);
    return roundStr === roundPhrase;
  }

  getStrFromHtmlCollection(roundHtmlCollection) {
    return Array.from(roundHtmlCollection)
      .map((htmlEl) => htmlEl.innerHTML).join(' ');
  }

  getColorChecking(words) {
    const currentCorrectArr = words.currentWord.textExample.split(' ');
    const roundWordsArr = words.roundWord.map((el) => el.text);
    console.log('currentCorrectArr', currentCorrectArr);
    console.log('roundWordsArr', roundWordsArr);
    const {
      solvedWords, currentWord, shuffledWord, allWords,
    } = words;
    const checkedWord = words.roundWord.map((el, i) => {
      const colorBack = (currentCorrectArr[i] === roundWordsArr[i]) ? 'lightgreen' : 'lightcoral';
      return Object.assign(el, { color: colorBack });
    });
    console.log('checkedWord', checkedWord);
    return {
      solvedWords,
      currentWord,
      shuffledWord,
      roundWord: checkedWord,
      allWords,
    };
  }

  processIdkClick(words) {
    const { currentWord, solvedWords, allWords } = words;
    const roundWordArr = currentWord.textExample.split(' ');
    const roundWordArrObj = roundWordArr.map((item, i) => ({
      text: item,
      order: i,
      task: i,
    }));

    const shuffledWord = roundWordArr.map((item, i) => ({
      text: null,
      order: i,
      task: i,
    }));

    return {
      solvedWords, currentWord, roundWord: roundWordArrObj, shuffledWord, allWords,
    };
  }

  processContClick(words, newRound) {
    return this.getRoundConfig(words.allWords, newRound);
  }

  // получить 10 слов для переданного этапа и страницы
  // для каждого слова не более 10 слов в предложении
  async getWords(group, page) {
    // console.log('group', group);
    // console.log('page', page);
    const wordsPromise = await fetch(`${this.config.wordsUrl}
group=${group}
&page=${page}
&wordsPerExampleSentenceLTE=10
&wordsPerPage=10
  `);

    const words = await wordsPromise.json();
    console.log('words', words);

    const tenWords = this.getTenWords(words);
    return tenWords;
  }

  // получить угаданные слова и текущее слово на основании всего списка и текущего раунда
  getRoundConfig(words, currentRound) {
    const solvedWords = words.slice(0, currentRound);
    const currentWord = words[currentRound];
    const shuffledWord = this.shuffleWord(currentWord);
    const roundWord = [];
    const allWords = words;
    return {
      solvedWords,
      currentWord,
      shuffledWord,
      roundWord,
      allWords,
    };
  }

  shuffleWord(wordArr) { // перемешать слова в предложении
    const phrase = wordArr.textExample;
    const phraseArr = phrase.split(' ');
    this.shuffleArray(phraseArr);
    const shuffledWordObjArr = phraseArr.map((word, index) => ({
      text: word,
      order: index,
      width: null,
    }));
    return shuffledWordObjArr;
  }

  shuffleArray(wordsArr) { // перемешать слова в предложении (алгоритм Фишера-Ейтса)
    for (let i = wordsArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordsArr[i], wordsArr[j]] = [wordsArr[j], wordsArr[i]];
    }
    return wordsArr;
  }

  getTenWords(words) {
    const corrWords = this.correctWords(words);
    return corrWords.slice(0, 10);
  }

  correctWords(words) { // оставить предложения, в которых меньше 10 слов
    // const escapedWords = this.escapeWords(words);
    this.escapeWords(words);
    return words.filter((word) => this.filterWords(word));
  }

  escapeWords(words) { // сформировать массив с уже удаленными тегами
    return words
      .map((word) => Object.assign(word, { textExample: this.replaceTags(word.textExample) }));
  }

  replaceTags(phrase) { // удалить теги <b> из предложения, пригодились регэкспы
    const regExp = /<b>(.+)<\/b>/;
    return phrase.replace(regExp, '$1');
  }

  filterWords(word, threshold = 10) { // оставить предложения, в которых <= 10 слов
    const wordArr = word.textExample.split(' ');
    return wordArr.length <= threshold;
  }

  getElementsFromMax(cur, max) {
    const elements = [];
    for (let i = 0; i < max; i += 1) {
      const newEl = { id: i, current: (i === cur) };
      elements.push(newEl);
    }
    return elements;
  }

  // получить кол-во слов для переданного уровня сложности, у которого
  // в предложении максимум 10 слов, если отдавать по 10 таких слов
  // вернуть 10 или полученное значение
  async getPagesForLevel(levNum, thresholdWordsInSentence = 10, thresholdWordsPerPage = 10) {
    const wordsPromise = await fetch(`${this.config.wordsCountUrl}group=${levNum}
      &wordsPerExampleSentenceLTE=${thresholdWordsInSentence}
      &wordsPerPage=${thresholdWordsPerPage}`);

    const words = await wordsPromise.json();
    return (words.count >= 10) ? 10 : words.count;
  }

  // получить конфиг кнопок для конкретного момента (события) игры
  getButtonsConfig(eventName) {
    let buttonConfig = {};
    switch (eventName) {
      case 'newRoundBegin':
        buttonConfig = {
          idk: true, check: false, cont: false, res: false,
        };
        break;
      case 'IDontKnowClick':
        buttonConfig = {
          idk: false, check: false, cont: true, res: false,
        };
        break;
      case 'roundWordFilled':
        buttonConfig = {
          idk: false, check: true, cont: false, res: false,
        };
        break;
      case 'roundSuccess':
        buttonConfig = {
          idk: false, check: false, cont: true, res: false,
        };
        break;
      case 'roundFails':
        buttonConfig = {
          idk: true, check: true, cont: false, res: false,
        };
        break;
      case 'pageIsOver':
        buttonConfig = {
          idk: false, check: false, cont: true, res: true,
        };
        break;
      default:
        buttonConfig = {
          idk: true, check: false, cont: false, res: false,
        };
        break;
    }
    return buttonConfig;
  }

  // получить конфиг для следующего раунда
  getLevelPageRoundConfig(levels, pages, rounds) {
    const nextRound = rounds.current + 1;
    const curLevel = levels.current;
    const curPage = pages.current;
    const allRoundsCount = this.getAllRoundsCount(levels, pages, rounds);
    const nextRoundOrder = this.getNextRoundOrder(allRoundsCount, curLevel, curPage, nextRound);
    const nextConfig = this.parseNextRound(nextRoundOrder);

    const config = {
      levels: {
        levels: this.getElementsFromMax(nextConfig.level, 6),
        current: nextConfig.level,
      },
      pages: {
        pages: this.getElementsFromMax(nextConfig.page, 10),
        current: nextConfig.page,
      },
      rounds: { current: nextConfig.round },
    };

    return config;
  }

  // посчитать уровень, страницу, раунд по переданному порядковому номеру
  parseNextRound(nextRoundOrder) {
    const level = Math.floor(nextRoundOrder / 100);
    const page = Math.floor((nextRoundOrder - level * 100) / 10);
    const round = (nextRoundOrder - level * 100 - page * 10);
    return { level, page, round };
  }

  // получить порядковый номер следующего раунда (0, если последний)
  getNextRoundOrder(allRoundsCount, curLev, curPage, nextRound) {
    const nextRoundOrder = curLev * 100 + curPage * 10 + nextRound;
    return (nextRoundOrder > (allRoundsCount - 1)) ? 0 : nextRoundOrder;
  }

  // получить кол-во всех раундов (все уровни, все страницы)
  getAllRoundsCount(levels, pages) {
    const levelsCount = levels.levels.length;
    const pagesCount = pages.pages.length;
    return levelsCount * pagesCount * 10;
  }

  playSound(currentWord) { // озвучить предложение
    // const url = 'https://raw.githubusercontent.com/diSpector/rslang-data/master/data/01_0001_example.mp3';
    const url = `${this.config.wordsSoundUrl}${currentWord.audioExample.substring(6)}`;
    const audio = new Audio(url);
    audio.play();
  }
}
