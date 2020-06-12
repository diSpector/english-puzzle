export default class Task {

    /** @param [{text, order, width}, ...] */
  static render(word) {
    return `
      <div class="task">
        <div class="task__words">
          ${word.map((el) => 
            `<div class="${el.text === null ? 'empty__word' : 'task__word'}" 
            ${el.text === null ? 
              `style="width:${el.width ? el.width : 0}px;flex-grow:${el.width ? 0 : 1};
            "` : ''} 
            data-order-task="${el.order}">${el.text === null ? '' : el.text}</div>`).join('')}
        </div>
      </div>
      `;
  }
}