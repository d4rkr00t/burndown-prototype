import h from 'hyperscript';
import createStore from './store/store';

import style from './style.css';
import header from './components/header/header';
import sprintTimeline from './components/sprint-timeline/sprint-timeline';
import distribution from './components/distribution/distribution';
import teamPresence from './components/team-presence/team-presence';

const startDate = '24.02.2016';
const endDate = '08.03.2016';
const totalSP = 51;
const spDay = [0, 0, 2, 3, 3, 6, 12];
const team = [
    {
        login: 'sysoev',
        avatar: 'http://lorempixel.com/100/100/people/'
    },
    {
        login: 'xxxxxx',
        avatar: 'http://lorempixel.com/100/100/business/'
    },
    {
        login: 'vtroshina',
        avatar: 'http://lorempixel.com/100/100/cats/'
    },
    {
        login: 'boronchiev',
        avatar: 'http://lorempixel.com/100/100/sports/'
    }
];
const distr = {
    backlog: {
        title: 'Backlog',
        sp: 39
    },
    development: {
        title: 'Development',
        sp: 10
    },
    review: {
        title: 'Review',
        sp: 6
    },
    testing: {
        title: 'Testing',
        sp: 16
    },
    done: {
        title: 'Done',
        sp: 12
    }
};

const store = createStore(startDate, endDate, totalSP, spDay, team, distr);
console.log(store);

const metaTag=document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
document.getElementsByTagName('head')[0].appendChild(metaTag);

document.body.appendChild(
    h(
        'div.page',
        header(store),
        sprintTimeline(store),
        h('.wrapper', distribution(store)),
        h('.wrapper', teamPresence(store))
    )
);
