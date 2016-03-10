const moment = require('moment');

module.exports = function sprintDays(startDate, endDate) {
    return Array.apply(null, Array(Number(endDate.diff(startDate, 'days')))).reduce((days, _, i) => {
        const day = moment(startDate).add(i + 1, 'd');

        if (['Su', 'Sa'].indexOf(day.format('dd')) === -1) {
            days.push(day);
        }

        return days;
    }, [startDate]);
}
