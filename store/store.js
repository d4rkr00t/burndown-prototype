import moment from 'moment';
import last from 'lodash/last';

import { sprintDays } from '../utils/date';

export default function createStore(startDate, endDate, totalSP, spDay, team, distr) {
    startDate = moment(startDate, 'DD.MM.YYYY');
    endDate = moment(endDate, 'DD.MM.YYYY');

    const days = sprintDays(startDate, endDate);
    const sprintLength = days.length;
    const done = last(spDay);
    const meanPerDay = done / spDay.length;
    const dayLeft = sprintLength - spDay.length;
    const predictedDone = Math.ceil((dayLeft * meanPerDay) + done);

    team = team.map(m => {
        m.presence = Array.apply(null, Array(sprintLength)).map(i => Math.random() > .9 ? 0 : 1);
        return m;
    })

    return {
        startDate,
        endDate,
        sprintLength,
        days,
        totalSP,
        spDay,
        meanPerDay,
        done,
        predictedDone,
        team,
        distr
    };
}
