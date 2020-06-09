import Model from '../base/Model';

export default class GameModel extends Model {
  constructor(config) {
    super();
    this.config = config;
  }

  async getWords(group, page) {
    console.log('group', group);
    console.log('page', page);
    const wordsPromise = await fetch(`${this.config.wordsUrl}
			group=${group}
			&page=${page}`
    );

    const words = await wordsPromise.json();
    const tenWords = this.getTenWords(words);

    return tenWords;
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
      .map((word) => Object.assign(word, {textExample : this.replaceTags(word.textExample)}));
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
      const newEl = { id: i, current: (i === cur) ? true : false};
      elements.push(newEl);
    }
    return elements;
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