import d3 from 'd3';
import last from 'lodash/last';
import moment from 'moment';

import createSvg from '../svg/svg';

import style from './burndown.css';

const padding = {
    top: 24,
    right: 80,
    bottom: 40,
    left: 80
}

const width = 900 - padding.right;
const height = 400 - padding.bottom;

export default function burndown({ days, sprintLength, totalSP, spDay, done, predictedDone }) {
    const svgElem = createSvg(width + padding.right, height + padding.bottom, 'burndown');

    const svg = d3.select(svgElem);
    const xRange = createXRange(sprintLength);
    const yRange = createYRange(sprintLength, totalSP);

    drawXAxis(svg, xRange, days, sprintLength);
    drawYAxis(svg, xRange, yRange, totalSP, sprintLength);
    drawPerfectLine(svg, xRange, yRange, sprintLength, totalSP);
    drawActualLine(svg, xRange, yRange, spDay, sprintLength, totalSP);
    drawPredictionLine(svg, xRange, yRange, spDay, sprintLength, predictedDone, done);

    return svgElem;
}

function createXRange(sprintLength) {
    return d3.scale
        .linear()
        .range([padding.left, width])
        .domain([0, sprintLength - 1]);
}

function createYRange(sprintLength, totalSP) {
    return d3.scale
        .linear()
        .range([padding.top, height])
        .domain([0, totalSP]);
}

function drawXAxis(svg, xRange, days, length) {
    const group = svg.append('g').attr('class', 'burndown__x-axis');
    const dates = [];

    group.selectAll('.burndown__x-tick')
            .data(new Array(length))
        .enter()
            .append('line')
            .attr('class', 'burndown__x-tick')
            .attr('x1', (d, i) => xRange(i))
            .attr('x2', (d, i) => xRange(i))
            .attr('y1', padding.top)
            .attr('y2', height + 10);

    group.selectAll('.burndown__x-label')
            .data(days)
        .enter()
            .append('text')
            .attr('class', 'burndown__x-label')
            .text((d) => d.format('DD.MM'))
            .attr('transform', (d, i) => `translate(${xRange(i)},${padding.top / 2})`);
}

function drawYAxis(svg, xRange, yRange, totalSP, sprintLength) {
    const axis = d3.svg
        .axis()
        .scale(yRange)
        .orient('left');

    svg.append('g')
        .attr('class', 'burndown__y-axis')
            .selectAll('.burndown__y-tick')
            .data(new Array(Math.ceil(totalSP / 5) - 1))
        .enter()
            .append('line')
            .attr('class', 'burndown__y-tick')
            .attr('x1', xRange(0) - 10)
            .attr('x2', xRange(sprintLength - 1) + 10)
            .attr('y1', (d, i) => yRange((i + 1) * 5))
            .attr('y2', (d, i) => yRange((i + 1) * 5));

    svg.append('g')
        .attr('class', 'burndown__y-axis')
        .attr('transform', 'translate(70,0)')
        .call(axis);
}

function drawPerfectLine(svg, xRange, yRange, length, totalSP) {
    const group = svg.append('g').attr('class', 'burndown__perfect');

    group
        .append('line')
        .attr('class', 'burndown__perfect-line')
        .attr('x1', xRange(0))
        .attr('x2', xRange(length - 1))
        .attr('y1', yRange(0))
        .attr('y2', yRange(totalSP));

    group
        .append('circle')
        .attr('class', 'burndown__perfect-total-point')
        .attr('cx', xRange(length - 1))
        .attr('cy', yRange(totalSP))
        .attr('r', 3);

    group
        .append('line')
        .attr('class', 'burndown__perfect-total-line')
        .attr('x1', xRange(length - 1))
        .attr('x2', xRange(length - 1))
        .attr('y1', yRange(totalSP) + 2)
        .attr('y2', yRange(totalSP) + 15);

    group
        .append('line')
        .attr('class', 'burndown__perfect-total-line')
        .attr('x1', xRange(length - 1) - 8)
        .attr('x2', xRange(length - 1) + 8)
        .attr('y1', yRange(totalSP) + 15)
        .attr('y2', yRange(totalSP) + 15);

    group
        .append('text')
        .attr('class', 'burndown__perfect-label')
        .text(totalSP)
        .attr('transform', `translate(${xRange(length - 1)},${yRange(totalSP) + 30})`);
}


function drawActualLine(svg, xRange, yRange, spDay, length, totalSP) {
    const lineFunction = d3.svg.line()
        .x((d, i)=> xRange(i))
        .y((d)=> yRange(d))
        .interpolate('cardinal');

    svg.append('path')
        .attr('class', 'burndown__actual')
        .attr('d', lineFunction(spDay));

    svg.selectAll('.burndown__point')
            .data(spDay)
        .enter()
            .append('circle')
            .attr('class', 'burndown__point')
            .attr('cx', (d, i) => xRange(i))
            .attr('cy', (d) => yRange(d))
            .attr('r', 3);
}

function drawPredictionLine(svg, xRange, yRange, spDay, length, predictedDone, done) {
    const group = svg.append('g');

    group
        .append('line')
        .attr('class', 'burndown__prediction')
        .attr('x1', xRange(spDay.length - 1))
        .attr('x2', xRange(length - 1))
        .attr('y1', yRange(done))
        .attr('y2', yRange(predictedDone));

    group
        .append('circle')
        .attr('class', 'burndown__prediction-total-point')
        .attr('cx', xRange(length - 1))
        .attr('cy', yRange(predictedDone))
        .attr('r', 3);

    group
        .append('line')
        .attr('class', 'burndown__prediction-total-line')
        .attr('x1', xRange(length - 1))
        .attr('x2', xRange(length - 1))
        .attr('y1', yRange(predictedDone) - 2)
        .attr('y2', yRange(predictedDone) - 15);

    group
        .append('line')
        .attr('class', 'burndown__prediction-total-line')
        .attr('x1', xRange(length - 1) - 8)
        .attr('x2', xRange(length - 1) + 8)
        .attr('y1', yRange(predictedDone) - 15)
        .attr('y2', yRange(predictedDone) - 15);

    group
        .append('text')
        .attr('class', 'burndown__prediction-label')
        .text(predictedDone)
        .attr('transform', `translate(${xRange(length - 1)},${yRange(predictedDone) - 20})`);
}
