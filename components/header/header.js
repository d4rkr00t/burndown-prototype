import h from 'hyperscript';
import style from './header.css';

import burndown from '../burndown/burndown.js';

export default function header(store) {
    return h(
        'div.header',
        h('h1.header__text', 'Geo Sprint', h('span.header__number', 8)),
        h('.header__chart', burndown(store))
    );
}
