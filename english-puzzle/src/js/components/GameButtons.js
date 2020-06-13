export default class GameButtons {
  static render(buttons) {
    return `
      <div class="game__buttons">
        <div class="game__button idk ${buttons.idk ? '' : 'hidden'}" data-button="idk">I don't know</div>
        <div class="game__button check ${buttons.check ? '' : 'hidden'}" data-button="check">Check</div>
        <div class="game__button cont ${buttons.cont ? '' : 'hidden'}" data-button="cont">Continue</div>
        <div class="game__button res ${buttons.res ? '' : 'hidden'}" data-button="res">Results</div>
      </div>
        `;
  }
}


// ${params.map((phrase, i) => Word.render(phrase.textExample.split(' '), i)).join('')}
