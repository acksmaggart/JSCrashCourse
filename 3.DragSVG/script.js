document.addEventListener("DOMContentLoaded", () => {
    drawVis();
});

function drawVis() {

    let circleX = -20,
        circleY = 20,
        groupX = 50,
        groupY = 55;

    const svg = d3.select('svg')
        .attr("width", 500)
        .attr('height', 500);

    const group = svg.append('g')
        .datum({x: groupX, y: groupY})
        .attr('transform', (d)=>{
            return `translate(${d.x}, ${d.y})`
        })
        .call(d3.drag()
            .on("drag", dragging));

    const rect = group.append('rect')
        .attr('width', 200)
        .attr('height', 200)
        .attr('fill', 'steelblue')
        .attr('transform', 'translate(0, 0)');

    const circle = group.append('circle')
        .datum({x: circleX, y: circleY})
        .attr('r', 15)
        .attr('fill', 'yellowgreen')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('transform', (d) => {
            return `translate(${d.x}, ${d.y})`
        })
        .call(d3.drag()
            .on("drag", dragging));

    const text = group.append("text")
        .text("Group")
        .attr("transform", "translate(150, 190)")
        .attr("fill", "white");

    const svgText = svg.append("text")
        .text("SVG")
        .attr("transform", "translate(5, 15)");
}

function dragging(d) {
    d3.select(this).attr('transform', (d)=>{
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        return `translate(${d.x}, ${d.y})`
    })
}

