export default function svg(width, height, className) {
    const svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElem.setAttribute('class', className);
    svgElem.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgElem.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    return svgElem;
}
