import LoginController from '../controllers/LoginController';
import LoginModel from '../models/LoginModel';
import LoginView from '../views/LoginView';

import StartController from '../controllers/StartController';
import StartView from '../views/StartView';

import GameController from '../controllers/GameController';
import GameModel from '../models/GameModel';
import GameView from '../views/GameView';

import ResultsController from '../controllers/ResultsController';
import ResultsModel from '../models/ResultsModel';
import ResultsView from '../views/ResultsView';

import GlobalController from '../controllers/GlobalController';
import GlobalModel from '../models/GlobalModel';
import GlobalView from '../views/GlobalView';

// import ApiHelper from './apiHelper';
// import dummyImg from '../../img/bg1.jpg'; // для webpack

export default class App {
  constructor(appConfig, apiConfig) {
    this.appConfig = appConfig;
    this.apiConfig = apiConfig;
    this.currentPage = null;
    this.user = null;
    this.token = null;
    this.level = null;
    this.page = null;
    this.round = null;
    this.roundStats = null;
  }

  async init() {
    // localStorage.clear();
    this.loadDefaults();
    // this.loadPage('results'); // УДАЛИТЬ!!
    // this.loadPage('game'); // УДАЛИТЬ!!
    this.loadPage('login'); // РАСКОММЕНТИТЬ!!!
  }

  async loadPage(pageName) { // роутинг (загрузка переданной страницы)
    const container = this.appConfig.containers.siteContainer;

    let controller = null;

    let controllerConfig = null;
    let viewConfig = null;
    let modelConfig = null;

    let apiConfig = null;

    switch (pageName) {
      case 'login':
        if (this.user && this.token) {
          this.loadPage('start');
          return;
        }
        controllerConfig = this.appConfig.pages.login.controllerConfig;
        modelConfig = this.appConfig.pages.login.modelConfig;
        viewConfig = this.appConfig.pages.login.viewConfig;
        apiConfig = this.apiConfig;
        controller = new LoginController( // создать контроллер страницы входа
          new LoginModel(modelConfig, apiConfig),
          new LoginView(container, viewConfig),
        );
        // подписать приложение на событие "Пользователь авторизован"
        controller.events.subscribe(controllerConfig.events.logUser, this);
        break;

      case 'start':
        if (!this.user || !this.token) {
          this.loadPage('login');
          return;
        }

        await this.loadStatistics();

        controllerConfig = this.appConfig.pages.start.controllerConfig;
        viewConfig = this.appConfig.pages.start.viewConfig;
        controller = new StartController(null, new StartView(container, viewConfig));
        // подписать приложение на нажатие кнопки "Start"
        controller.events.subscribe(controllerConfig.events.startClicked, this);
        break;

      case 'game':
        if (!this.user || !this.token) {
          this.loadPage('login');
          return;
        }

        await this.loadStatistics();

        controllerConfig = Object.assign(this.appConfig.pages.game.controllerConfig, {
          level: this.level,
          page: this.page,
          round: this.round,
          tips: this.tips,
        });
        modelConfig = this.appConfig.pages.game.modelConfig;
        viewConfig = this.appConfig.pages.game.viewConfig;
        controller = new GameController(
          new GameModel(modelConfig),
          new GameView(container, viewConfig),
          controllerConfig,
        );
        // подписать приложение на сохранение статистики после перехода на след. раунд
        controller.events.subscribe(controllerConfig.events.saveStats, this);
        controller.events.subscribe(controllerConfig.events.saveTips, this);
        controller.events.subscribe(controllerConfig.events.logOutUser, this);
        controller.events.subscribe(controllerConfig.events.resClicked, this);
        controller.events.subscribe(controllerConfig.events.saveRound, this);
        controller.events.subscribe(controllerConfig.events.clearRound, this);

        break;

      case 'results':
        if (!this.user || !this.token) {
          this.loadPage('login');
          return;
        }

        // await this.loadStatistics();
        // const roundStats = this.getRoundStatsFromLocalStorage();

        controllerConfig = Object.assign(
          this.appConfig.pages.results.controllerConfig, {
            roundStats: this.getRoundStatsFromLocalStorage(),
          },
        );
        modelConfig = this.appConfig.pages.results.modelConfig;
        viewConfig = this.appConfig.pages.results.viewConfig;
        controller = new ResultsController(
          new ResultsModel(modelConfig),
          new ResultsView(container, viewConfig),
          controllerConfig,
        );

        controller.events.subscribe(controllerConfig.events.logOutUser, this);
        controller.events.subscribe(controllerConfig.events.contClicked, this);
        controller.events.subscribe(controllerConfig.events.clearRound, this);
        controller.events.subscribe(controllerConfig.events.goToGlobal, this);

        break;

      case 'global':
        if (!this.user || !this.token) {
          this.loadPage('login');
          return;
        }

        // await this.loadStatistics();

        controllerConfig = Object.assign(
          this.appConfig.pages.results.controllerConfig, {

          },
        );
        modelConfig = this.appConfig.pages.global.modelConfig;
        viewConfig = this.appConfig.pages.global.viewConfig;
        controller = new GlobalController(
          new GlobalModel(modelConfig),
          new GlobalView(container, viewConfig),
          controllerConfig,
        );

        controller.events.subscribe(controllerConfig.events.contClicked, this);
        break;

      default:
        this.loadPage('start');
        break;
    }

    controller.init();
  }

  handleEvent(event, payLoad) {
    const handlerFunc = this.appConfig.eventHandlers[event];
    this[handlerFunc](payLoad);
  }

  logUser = (data) => { // залогинить пользователя
    // const { userId: { id: user }, token } = data;
    const { userId: user, token } = data; // поменяли сигнатуры

    this.user = user;
    this.token = token;
    this.saveUserToLocalStorage();
    this.loadPage('start');
  }

  logOutUser = async (isNeedRedirect = false) => { // разлогинить пользователя
    this.user = null;
    this.token = null;
    this.saveUserToLocalStorage();
    if (isNeedRedirect) {
      await this.init();
    }
  }

  goToGlobal = () => {
    this.loadPage('global');
  }

  startClicked = () => {
    this.loadPage('game');
  }

  goToGame = () => {
    this.loadPage('game');
  }

  goToResults = () => {
    this.loadPage('results');
  }

  loadDefaults() {
    let userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    if (!userSettings) {
      userSettings = {
        user: null,
        token: null,
        level: 0,
        page: 0,
        round: 0,
        tips: {
          autosound: true,
          translate: true,
          audio: true,
          picture: false,
        },
        roundStats: {
          success: [],
          fail: [],
        },
      };

      localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
    }
    this.user = userSettings.user;
    this.token = userSettings.token;
    this.level = userSettings.level;
    this.page = userSettings.page;
    this.round = userSettings.round;
    this.tips = userSettings.tips;
    this.roundStats = userSettings.roundStats;
  }

  async loadStatistics() {
    if (!this.user || !this.token) {
      return;
    }
    const statsRequestObj = this.getStatsRequestObj('load');
    const { url, method, headers } = statsRequestObj;

    try {
      const rawResponse = await fetch(`${url}`, {
        method,
        headers,
      });
      const { status } = rawResponse;
      if (status !== 200) {
        if (status === 404) { // статистики по пользователю еще нет
          return;
        }
        if (status === 401) { // токен/пользователь неправильные или устарели
          this.logOutUser();
          return;
        }
      }
      // ошибок нет, статистика получена
      const content = await rawResponse.json();
      const {
        optional: {
          level, page, round, stats,
        },
      } = content;
      this.level = level;
      this.page = page;
      this.round = round;
      this.stats = stats;
    } catch (e) {
      return;
    }
  }

  /**
   * сохранить статистику на бэкенде
   * @param { newLevel, newPage, newRound } payload
   */
  async saveStatistics(payload) {
    if (!this.user || !this.token) {
      return;
    }
    const statsRequestObj = this.getStatsRequestObj('save');
    const { url, method, headers } = statsRequestObj;

    const { newLevel: lev, newPage: pg, newRound: rnd } = payload;

    try {
      const rawResponse = await fetch(`${url}`, {
        method,
        headers,
        body: JSON.stringify({
          optional: { level: lev, page: pg, round: rnd },
        }),
      });
      const { status } = rawResponse;
      if (status !== 200) {
        if (status === 400) { // ошибка в запросе
          return;
        }
        if (status === 401) { // токен/пользователь неправильные или устарели
          this.logOutUser();
        }
      }
      // const content = await rawResponse.json();
    } catch (e) {
      return;
    }
  }

  // /**
  //  * сохранить статистику на бэкенде
  //  * @param { newLevel, newPage, newRound } payload
  //  */
  // async saveCompleteRoundToBackend(payload) {
  //   if (!this.user || !this.token) {
  //     return;
  //   }

  //   this.loadStatistics();

  //   const statsRequestObj = this.getStatsRequestObj('save');
  //   console.log('statsRequestObj', statsRequestObj);
  //   const { url, method, headers } = statsRequestObj;

  //   const { time, level, round, knw, dnknw } = payload;

  //   try {
  //     const rawResponse = await fetch(`${url}`, {
  //       method,
  //       headers,
  //       body: JSON.stringify({
  //         optional: { level: lev, page: pg, round: rnd, stats:  },
  //       }),
  //     });
  //     const { status } = rawResponse;
  //     console.log('status', status);
  //     if (status !== 200) {
  //       if (status === 400) { // ошибка в запросе
  //         // console.log('Bad request, stats not saved');
  //         return;
  //       }
  //       if (status === 401) { // токен/пользователь неправильные или устарели
  //         // console.log('incorrect credentials');
  //         this.logOutUser();
  //         return;
  //       }
  //     }
  //     const content = await rawResponse.json();
  //     // console.log('content', content);
  //     return;
  //   } catch (e) {
  //     // console.log('error in backend while put stats');
  //     return;
  //   }
  // }

  // получить объект для запроса (url, action, header)
  getStatsRequestObj(meth = 'load') {
    const backendApiParams = this.apiConfig.backendApi;
    const statsApiParams = backendApiParams.general.statistics[meth];

    const { action, method, headers } = statsApiParams;

    const url = `${backendApiParams.url}${action}`.replace(/\$id/, this.user);
    const replacedHeaders = headers.Authorization.replace(/\$token/, this.token);

    return {
      url,
      method,
      headers:
        Object.assign(backendApiParams.defaultHeaders, {
          Authorization: replacedHeaders,
        }),
    };
  }

  saveUserToLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.user = this.user;
    userSettings.token = this.token;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  saveLevelToLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.level = this.level;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  savePageToLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.page = this.page;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  saveRoundToLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.round = this.round;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  saveTipsToLocalStorage(tipsObj) {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.tips = tipsObj;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  // записать пройденное предложение в LocalStorage
  saveRoundWordToLocalStorage(wordObj) {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    const { word, key } = wordObj;
    userSettings.roundStats[key].push(word);
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  // удалить все предложения раунда из LocalStorage
  clearRoundWordFromLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    userSettings.roundStats.fail.length = 0;
    userSettings.roundStats.success.length = 0;
    localStorage.setItem('dsEnglishPuzzleData', JSON.stringify(userSettings));
  }

  getRoundStatsFromLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('dsEnglishPuzzleData'));
    return userSettings.roundStats;
  }
}
