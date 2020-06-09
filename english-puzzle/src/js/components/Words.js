import Word from './Word';

export default class Words {

    static render(params) {
      console.log('params from Words', params);
      return `
      <div class="phrases">
        ${params.map((phrase, i) => Word.render(phrase.textExample.split(' '), i)).join('')}
      </div>
      `;
    }
  }
  