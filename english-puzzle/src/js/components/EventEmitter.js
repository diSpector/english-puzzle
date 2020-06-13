export default class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(eventName, listener) { // подписать на событие
    this.listeners.push({ listener, eventName });
  }

  unsubscribe(eventName, listener) { // отписать от события
    this.listeners = this.listeners
      .filter((list) => (list.listener !== listener && list.eventName !== eventName));
  }

  notify(eventName, data) { // оповестить всех о событии
    this.listeners.forEach((list) => {
      if (list.eventName === eventName) {
        list.listener.handleEvent(eventName, data);
      }
    });
  }
}
