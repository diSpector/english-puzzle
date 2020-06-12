export default class MenuPage {

  static render(params) {
    return `
      <div class="menu__page">
        <div class="page__title">Page:</div>
          <div class="page__list">
            <div class="page__current">${params.current + 1}</div>
            <div class="page__menu dropdown__menu hidden">
              ${params.pages.map((page) => `
              <div class="menu__item ${page.current ? `active` : ``}"
                data-page="${page.id}">${page.id + 1}</div>`
              ).join('')}
            </div>
          </div>
        </div>
    `;
  }
}
