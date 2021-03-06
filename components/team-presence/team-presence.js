import h from 'hyperscript';

import widgetTitle from '../widget-title/widget-title';
import style from './team-presence.css';

export default function teamPresence({ team, teamPresence, days }) {
    return h('.team-presence',
        widgetTitle('Team Presence'),
        h('.team-presence__days',
            h('.team-presence__days-offset'),
            days.map(d => h('.team-presence__day', d.format('DD.MM')))
        ),
        team.map(m => h('.team-presence__member', avatar(m), presence(teamPresence[m.login])))
    );
}

function avatar(member) {
    return h('img.team-presence__member-avatar', { src: member.avatar });
}

function presence(presence) {
    return presence.map(p => h(`.team-presence__member-day${p === 0 ? '.-absent' : ''}`));
}
