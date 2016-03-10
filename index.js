import h from 'hyperscript';
import createStore from './store/store';
import config from './config'
import loadSprintData from './utils/load-sprint-data';

import style from './style.css';
import header from './components/header/header';
import sprintTimeline from './components/sprint-timeline/sprint-timeline';
import distribution from './components/distribution/distribution';
import teamPresence from './components/team-presence/team-presence';

const sprintNumber = Number(window.location.search.match(/(\d+)/)[0]);

const metaTag=document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
document.getElementsByTagName('head')[0].appendChild(metaTag);

function main({ number, sprint, data }) {
    const { startDate, endDate, totalSP } = sprint;
    const { spDay, distr, presence } = data;
    const { team } = config;

    const store = createStore(startDate, endDate, totalSP, spDay, team, presence, distr);
    console.log(store);

    document.body.appendChild(
        h(
            'div.page',
            header(store),
            sprintTimeline(store),
            h('.wrapper', distribution(store)),
            h('.wrapper', teamPresence(store))
        )
    );
}

loadSprintData(sprintNumber).then(main);
