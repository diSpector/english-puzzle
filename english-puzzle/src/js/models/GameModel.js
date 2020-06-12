import Model from '../base/Model';

export default class GameModel extends Model {
  constructor(config) {
    super();
    this.config = config;
  }

  /** 
   * @param {clickedWord: HtmlElement, allWords: NodeList[]} data
   * @param { solvedWords, currentWord, shuffledWord, roundWord} words
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
  */
  processClickWord(data, words, typeStr) {
    const clickedWordObj = data.clickedWord;
    const clickedWordParams = {
      text: clickedWordObj.innerHTML,
      width: clickedWordObj.offsetWidth,
      order: clickedWordObj.dataset.orderTask
    };

    const { newRound: roundWord, newShuffled: newShuffledWord } = this.getUpdatedRoundAndTask(clickedWordParams, typeStr);

    const roundWords = words.roundWord.slice(0);
    const shuffleWords = words.shuffledWord.slice(0);

    if (typeStr === 'task') {
      roundWords.push(roundWord);
      shuffleWords.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);
    } else {
      roundWords.splice(clickedWordObj.dataset.orderRound, 1);
      shuffleWords.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);
    } 
    return { roundWords, shuffleWords };
  }

  /**
   * 
   * @param {text, width, order} clickedWord 
   * @param 'task|round' typeStr - был ли клик по слову в раунде или в задании
   */
  getUpdatedRoundAndTask(clickedWord, typeStr) {
    const newRound = Object.assign({}, clickedWord);
    const newShuffled = Object.assign({}, clickedWord);

    if (typeStr === 'task') {
      newShuffled.text = null;
    } else {
      newRound.text = null;
    }

    return { newRound, newShuffled };
  }

  /**
   * вернуть конфиг для кнопок - какие отображать в данный момент       
   * @param { solvedWords, currentWord, shuffledWord, roundWord} words
   */
  getButtonsConfig(words) {
    return words.shuffledWord.length === words.roundWord.length;
  }

  isRoundWordsCorrect(phraseStr, roundHtmlCollection) {
    const roundStr = this.getStrFromHtmlCollection(roundHtmlCollection);
    return roundStr === phraseStr;
  }

  getStrFromHtmlCollection(roundHtmlCollection) {
    return Array.from(roundHtmlCollection)
      .map((htmlEl) =>htmlEl.innerHTML).join(' ');
  }

  getObjForIdk(words) {
    const { currentWord } = words;
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

    return {roundWord: roundWordArrObj, shuffleWord: shuffledWord};
  }

  // processClickWord(data, words) {
  //   const clickedWordObj = data.clickedWord;
  //   const clickedWordParams = {
  //     text: clickedWordObj.innerHTML,
  //     width: clickedWordObj.offsetWidth,
  //     order: clickedWordObj.dataset.orderTask
  //   };

  //   const { newRound: roundWord, newShuffled: newShuffledWord } = this.getRoundAndShuffledFromClicked(clickedWordParams);

  //   const roundWords = words.roundWord.slice(0);
  //   const shuffleWords = words.shuffledWord.slice(0);

  //   roundWords.push(roundWord);
  //   shuffleWords.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);

  //   return { roundWords, shuffleWords };
  // }

  // processClickRoundWord(data, words) {
  //   const clickedWordObj = data.clickedWord;
  //   const clickedWordParams = {
  //     text: clickedWordObj.innerHTML,
  //     width: clickedWordObj.offsetWidth,
  //     order: clickedWordObj.dataset.orderTask
  //   };

  //   const { newRound: roundWord, newShuffled: newShuffledWord } = this.getShuffledandRoundFromClicked(clickedWordParams);

  //   const roundWords = words.roundWord.slice(0);
  //   const shuffleWords = words.shuffledWord.slice(0);

  //   roundWords.splice(clickedWordObj.dataset.orderRound, 1);
  //   shuffleWords.splice(clickedWordObj.dataset.orderTask, 1, newShuffledWord);

  //   return { roundWords, shuffleWords };
  // }

  // getShuffledandRoundFromClicked(clickedWord) {
  //   const newRound = Object.assign({}, clickedWord,  { text: null });
  //   const newShuffled = Object.assign({}, clickedWord);

  //   return { newRound, newShuffled };
  // }

  // /**
  //  * 
  //  * @param {text, width, order} clickedWord 
  //  */
  // getRoundAndShuffledFromClicked(clickedWord) {
  //   const newRound = Object.assign({}, clickedWord);
  //   const newShuffled = Object.assign({}, clickedWord, { text: null });

  //   return { newRound, newShuffled };
  // }


  // получить 10 слов для переданного этапа и страницы
  // для каждого слова не более 10 слов в предложении
  async getWords(group, page) {
    console.log('group', group);
    console.log('page', page);
    const wordsPromise = await fetch(`${this.config.wordsUrl}
			group=${group}
      &page=${page}
      &wordsPerExampleSentenceLTE=10
      &wordsPerPage=10
    `);

    const words = await wordsPromise.json();

    const tenWords = this.getTenWords(words);
    return tenWords;
  }

  // получить угаданные слова и текущее слово на основании всего списка и текущего раунда
  getRoundConfig(words, currentRound) {
    if (currentRound === 1) {
      return { solvedWords: [], currentWord: words[0] };
    }

    return {
      solvedWords: words.slice(0, currentRound - 1),
      currentWord: words[currentRound - 1],
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
    // return phraseArr;
    // const newPhrase = phraseArr.join(' ');
    // wordArr.textExample = newPhrase;
    // return wordArr;
  }

  shuffleArray(wordsArr) { // перемешать слова в предложении (алгоритм Фишера-Ейтса)
    for (let i = wordsArr.length - 1; i > 0; i--) {
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
    const escapedWords = this.escapeWords(words);
    return words.filter((word) => this.filterWords(word));
  }

  escapeWords(words) { // сформировать массив с уже удаленными тегами
    return words
      .map((word) => Object.assign(word, { textExample: this.replaceTags(word.textExample) }));
  }

  replaceTags(phrase) { // удалить теги <b> из предложения, пригодились регэкспы
    const regExp = /<b>(.+)<\/b>/;
    return phrase.replace(regExp, "$1");
  }

  filterWords(word, threshold = 10) { // оставить предложения, в которых <= 10 слов
    const wordArr = word.textExample.split(' ');
    return wordArr.length <= threshold;
  }

  getElementsFromMax(cur, max) {
    const elements = [];
    for (let i = 0; i < max; i += 1) {
      const newEl = { id: i, current: (i === cur) ? true : false };
      elements.push(newEl);
    }
    return elements;
  }

  // получить кол-во слов для переданного уровня сложности, у которого
  // в предложении максимум 10 слов, если отдавать по 10 таких слов
  // вернуть 10 или полученное значение 
  async getPagesForLevel(levNum, thresholdWordsInSentence = 10, thresholdWordsPerPage = 10) { // получить 
    const wordsPromise = await fetch(`${this.config.wordsCountUrl}group=${levNum}
      &wordsPerExampleSentenceLTE=${thresholdWordsInSentence}
      &wordsPerPage=${thresholdWordsPerPage}`
    );

    const words = await wordsPromise.json();
    return (words.count >= 10) ? 10 : words.count;
  }

  // getLevels(cur) { // получить массив объектов с этапами
  //   const levels = [];
  //   for (let i = 0; i < this.config.maxLevels; i += 1) {
  //     const newLev = { id: i, current: (i === cur) ? true : false};
  //     levels.push(newLev);
  //   }
  //   return levels;
  // }

  // getPages(cur) { // получить массив объектов с этапами
  //   const levels = [];
  //   for (let i = 0; i < this.config.maxLevels; i += 1) {
  //     const newLev = { id: i, current: (i === cur) ? true : false};
  //     levels.push(newLev);
  //   }
  //   return levels;
  // }

  // load(email, pass) {
  // 	this.email = email;
  // 	this.pass = pass;
  // 	return true;
  // }

  // validate(callback) {
  // 	this.clearErrors();
  // 	if (!this.config.regExp.email.test(this.email)) {
  // 		this._errors.email = this.config.errors.email;
  // 	}

  // 	if (!this.config.regExp.pass.test(this.pass)) {
  // 		this._errors.pass = this.config.errors.pass;
  // 	}
  // 	callback(this.getErrors());
  // 	return (Object.keys(this._errors).length === 0) ? true : false;
  // }

  // async loginUser(user, loginHandler) {
  // 	const {
  // 		url, // ссылка
  // 		defaultHeaders: headers, // заголовки
  // 		loginPage: { login: { action, method } } // деструктурируем экшн и метод
  // 	} = this.apiConfig.backendApi;

  // 	try {
  // 		const rawResponse = await fetch(`${url}${action}`, {
  // 			method: method,
  // 			headers: headers,
  // 			body: JSON.stringify(user)
  // 		});
  // 		if (rawResponse.status !== 200) {
  // 			loginHandler('Email or password is incorrect');
  // 			return null;
  // 		}
  // 		const content = await rawResponse.json();
  // 		loginHandler('');
  // 		return content;
  // 	} catch (e) {
  // 		loginHandler('The auth server is unavailable');
  // 		return null;
  // 	}
  // }

  // async createUser(user, registerHandler) {
  // 	const {
  // 		url, // ссылка
  // 		defaultHeaders: headers, // заголовки
  // 		loginPage: { register: { action, method } } // деструктурируем экшн и метод
  // 	} = this.apiConfig.backendApi;

  // 	try {
  // 		const rawResponse = await fetch(`${url}${action}`, {
  // 			method: method,
  // 			headers: headers,
  // 			body: JSON.stringify(user)
  // 		});
  // 		if (rawResponse.status !== 200) {
  // 			registerHandler(`The user "${user.email}" already exists`);
  // 			return null;
  // 		}
  // 		const content = await rawResponse.json();
  // 		registerHandler('');
  // 		return content;
  // 	} catch (e) {
  // 		registerHandler('The register server is unavailable');
  // 		return null;
  // 	}
  // }

  // getErrors() {
  // 	return this._errors;
  // }

  // clearErrors() {
  // 	this._errors = {};
  // }
}