export default class MenuLevel {

  static render(params) {
    return `
      <div class="menu__level">
        <div class="level__title">Level:</div>
        <div class="level__list">
            <div class="level__current">${params.current + 1}</div>
            <div class="level__menu dropdown__menu hidden">
              ${params.levels.map((lev) => `
                <div class="menu__item ${lev.current ? `active` : ``}"
                  data-level="${lev.id}">${lev.id + 1}</div>`
              ).join('')}
            </div>
        </div>
      </div>
    `;
  }

}