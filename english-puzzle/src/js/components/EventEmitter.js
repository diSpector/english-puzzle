export default class EventEmitter {
  constructor() {
    this._listeners = [];
  }

  subscribe(eventName, listener) { // подписать на событие
    this._listeners.push({ listener, eventName });
  }

  unsubscribe(eventName, listener) { // отписать от события
    this._listeners = this._listeners.filter((list) => {
      return (list.listener !== listener && list.eventName !== eventName);
    });
  }

  notify(eventName, data) { // оповестить всех о событии
    this._listeners.forEach((list) => {
      if (list.eventName === eventName) {
        list.listener.handleEvent(eventName, data);
      }
    })
  }
}