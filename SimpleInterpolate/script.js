document.addEventListener("DOMContentLoaded", ()=>{
    const data = [
        {"label":"one", "value":20},
        {"label":"two", "value":50},
        {"label":"three", "value":30}];

    let pieGen = d3.pie().value(d=>d.value);


    let arcGen = d3.arc()
        .innerRadius(50)
        .outerRadius(100);

    let pieData = pieGen(data);

    let colorScale = d3.scaleLinear().domain([0, 1]).range(['#ff541c', '#12fffd']);

    let pieGroup = d3.select('svg').selectAll('g').data([data]);
    pieGroup = pieGroup.enter().append('g').merge(pieGroup);
    pieGroup.attr('transform', 'translate(150, 150)');

    let arcs = pieGroup.selectAll('path').data(pieData);
    arcs.exit().remove();
    arcs = arcs.enter().append('path').merge(arcs);
    arcs.attr('d', d => arcGen(d))
        .attr('fill', d => colorScale(d.value / 100));
});