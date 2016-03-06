import h from 'hyperscript';
import moment from 'moment';

import style from './sprint-timeline.css';

const today = moment('12:00 02.03.2016', 'HH:mm DD.MM.YYYY');

export default function sprintTimeline({ days }) {
    const items = days.map((day) => {
        const isDone = day.diff(today, 'days') < 0;
        const isToday = day.format('DD.MM.YYYY') === today.format('DD.MM.YYYY');
        const hoursLeft = isToday && (24 - (Number(today.format('HH')) || 24));
        const opacity = isDone ? 1 : isToday ? (hoursLeft / 24) * 0.8 : 0;

        return h('.sprint-timeline__item',
            h('.sprint-timeline__item-bg', { style: `opacity: ${opacity}`}),
            day.format('DD.MM')
        );
    });

    return h('.sprint-timeline', items);
}
