export default class RoundWord {

  /**
   * 
   * @param {text, width, order} roundWord 
   * @param integer roundNumber 
   * @param string events 
   */
  static render(roundWord, roundNumber, events) {
    console.log('new roundWords', roundWord)
    return `
      <div class="phrase">
        <div class="number number__current">${roundNumber}</div>
        <div class="phrase__words empty ${events.includes('roundIsOver') ? 'round__done' : ''}">
        ${roundWord.map((el, i) => `
          <div class="phrase__word" 
          style="width:${el.width ? el.width : 0}px;flex-grow:${el.width ? '0' : '1' };" 
          data-order-task="${el.order}"
          data-order-round="${i}"
          >${el.text}</div>`).join('')}
        </div>
      </div>
      `;
  }
}

//

// ${roundWord.map((el) => `<div class="phrase__word">
// ${(el) ? el.text : ''}