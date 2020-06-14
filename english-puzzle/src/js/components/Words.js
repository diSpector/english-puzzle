import Word from './Word';
import RoundWord from './RoundWord';

export default class Words {
  /** words: {solvedWords: [], currentWord: {}, shuffledWord: {}, roundWord: {}} */
  static render(words, events) {
    return `
      <div class="phrases">
        ${words.solvedWords.map((phrase, i) => Word.render(phrase.textExample.split(' '), i)).join('')}
        ${RoundWord.render(words.roundWord, words.solvedWords.length + 1, events)}
      </div>
      `;
  }
}
