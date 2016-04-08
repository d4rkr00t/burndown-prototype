import h from 'hyperscript';
import d3 from 'd3';

import createSvg from '../svg/svg';
import widgetTitle from '../widget-title/widget-title';
import style from './distribution.css';

const width = 130;
const height = 160;

export default function distribution({ distr, totalSP }) {
    const svgElem = createSvg(width * Object.keys(distr).length, height, 'distribution__chart');
    const svg = d3.select(svgElem);
    const color = d3.scale
        .linear()
        .range(['#3F51B5', '#E91E63'])
        .domain([0, width]);

    const scale = d3.scale
        .linear()
        .range([10, width])
        .domain([0, totalSP]);

    const groups = Object
        .keys(distr)
        .map(k => distr[k].title);

    const sizes = Object
        .keys(distr)
        .map(k => distr[k].sp || '');

    drawGroups(svg, color, scale, groups, sizes);

    return h('.distribution',
        widgetTitle('Distribution'),
        svgElem
    );
}

function drawGroups(svg, color, scale, groupsNames, sizes) {
    const calcPos = (i) => ((i + 1) * width) - (width / 2);

    svg.selectAll('.distribution__group')
            .data(sizes)
        .enter()
            .append('circle')
            .style('fill', (d) => color(scale(d)))
            .attr('class', 'distribution__group')
            .attr('cx', (d, i) => calcPos(i))
            .attr('cy', height / 2)
            .attr('r', (d) => scale(d) / 2);

    svg.selectAll('.distribution__group-sp')
            .data(sizes)
        .enter()
            .append('text')
            .attr('class', 'distribution__group-sp')
            .attr('transform', (d, i) => `translate(${calcPos(i)},${(height / 2) + 4})`)
            .text((d) => d);

    svg.selectAll('.distribution__group-label')
            .data(groupsNames)
        .enter()
            .append('text')
            .attr('class', 'distribution__group-label')
            .attr('transform', (d, i) => `translate(${calcPos(i)},15)`)
            .text((d) => d);
}
