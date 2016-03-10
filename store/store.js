import moment from 'moment';
import last from 'lodash/last';

import { sprintDays } from '../utils/date';

export default function createStore(startDate, endDate, totalSP, spDay, team, teamPresence, distr) {
    startDate = moment(startDate, 'DD.MM.YYYY');
    endDate = moment(endDate, 'DD.MM.YYYY');

    const days = sprintDays(startDate, endDate);
    const sprintLength = days.length;
    const done = last(spDay);
    const meanPerDay = done / spDay.length;
    const dayLeft = sprintLength - spDay.length;
    const predictedDone = Math.ceil((dayLeft * meanPerDay) + done);

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
        teamPresence,
        distr
    };
}
