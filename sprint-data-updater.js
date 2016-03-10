const sprintNumber = 9;

const sprintDays = require('./utils/date');
const fs = require('fs');
const got = require('got');
const key = require('./key');
const moment = require('moment');
const sprint = require('./sprints/' + sprintNumber + '/sprint.json');
const startDate = moment(sprint.startDate, 'DD.MM.YYYY');
const endDate = moment(sprint.endDate, 'DD.MM.YYYY');
const todayDate = moment(new Date());
const sprintLength = sprintDays(startDate, endDate).length;
const daysPassed = sprintDays(startDate, todayDate).length;
const QUEUE = 'SERP';
const URLS = {
    center: 'https://center.yandex-team.ru/api/v1',
    issues: 'https://st-api.yandex-team.ru/v2/issues'
};
const DISTRIBUTION = {
    backlog: ['open'],
    development: ['inProgress'],
    review: ['inReview'],
    testing: ['readyForTest', 'testing'],
    done: ['tested', 'readyForDev', 'dev', 'rc', 'closed']
};

function sendRequest(url, method, payload) {
    const params = {
        body: JSON.stringify(payload),
        headers: {
            Authorization: 'OAuth ' + key,
            'Content-Type': 'application/json'
        }
    };

    return got[method](url, params);
}

function getAllTasks(url, queue, filter) {
    return sendRequest(url + '?filter=' + filter + '&filter=queue:' + queue, 'get', {});
}

function processTasks(tasks) {
    return tasks
        .filter((t) => Number((t.originalEstimate.match(/(\d+)/) || [])[0]))
        .map((t) => ({
            title: t.summary,
            key: t.key,
            tags: t.tags,
            sp: Number(t.originalEstimate.match(/(\d+)/)[0]),
            updatedAt: t.updatedAt,
            status: t.status.key
        }));
}

function addDistribution(d, status, sp) {
    Object.keys(DISTRIBUTION).forEach((key) => {
        const rules = DISTRIBUTION[key];

        if (rules.indexOf(status) !== -1) {
            d[key].sp += sp;

            return false;
        }
    });
}

function addSpDay(spDay, date, sp) {
    const diff = date.diff(startDate, 'd');
    spDay[diff] = spDay[diff] >= 0 ? spDay[diff] + sp : sp;
}

function prepareData(tasks) {
    const initialData = {
        distr: {
            backlog: {
                title: 'Backlog',
                sp: 0
            },
            development: {
                title: 'Development',
                sp: 0
            },
            review: {
                title: 'Review',
                sp: 0
            },
            testing: {
                title: 'Testing',
                sp: 0
            },
            done: {
                title: 'Done',
                sp: 0
            }
        },
        spDay: Array.apply(null, Array(daysPassed))
    };

    const data = tasks.reduce((d, t) => {
        addDistribution(d.distr, t.status, t.sp);

        if (DISTRIBUTION.done.indexOf(t.status) !== -1 ) {
            addSpDay(d.spDay, moment(new Date(t.updatedAt)), t.sp);
        }

        return d;
    }, initialData);

    data.spDay = data.spDay.reduce((newSpDay, d, index) => {
        var prevDay = 0;

        if (newSpDay[index - 1] >= 0) {
            prevDay = newSpDay[index - 1];
        }

        if (d >= 0) {
            newSpDay[index] = d + prevDay;
        } else {
            newSpDay[index] = prevDay;
        }

        return newSpDay;
    }, []);

    data.presence = {
        sysoev: [1, 1, 1, 1, 1, 1, 1, 1],
        xxxxxx: [1, 1, 1, 1, 1, 1, 1, 1],
        boronchiev: [1, 1, 1, 0, 0, 0, 0, 0],
        vtroshina: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    return data;
}

function saveData(data) {
    fs.writeFileSync('./sprints/' + sprintNumber + '/data.json', JSON.stringify(data));

    return data;
}

getAllTasks(URLS.issues, QUEUE, sprint.filter)
    .then((res) => JSON.parse(res.body))
    .then(processTasks)
    .then(prepareData)
    .then(saveData)
    .then(data => console.log(data))
    .catch(err => console.error(err));
