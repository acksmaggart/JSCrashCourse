document.addEventListener("DOMContentLoaded", () => {
    // d3.select("body").append("svg").append("g");
    getData();
});


function drawVis(data) {

    let svgHeight = 600;
    let svgWidth = 600;

    let margins = {top: 40, right: 40, bottom: 40, left: 40};
    let drawingAreaHeight = svgHeight - margins.top - margins.bottom;
    let drawingAreaWidth = svgWidth - margins.left - margins.right;


    let svg = d3.select("body")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    let g = d3.select("svg").append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, (row) => {
            return row.x;
        })).range([0, drawingAreaWidth]);

    let yScale = d3.scaleLinear()
        .domain(d3.extent(data, (row) => {
            return row.y;
        })).range([drawingAreaHeight, 0]);

    let xAxisGroup = svg.append('g')
        .attr('id', "x-axis-group")
        .attr('transform', `translate(${margins.left}, ${margins.top + drawingAreaHeight})`)
        .call(d3.axisBottom(xScale));

    let yAxisGroup = svg.append('g')
        .attr('id', "y-axis-group")
        .attr('transform', `translate(${margins.right}, ${margins.top})`)
        .call(d3.axisLeft(yScale));

    let points = g.selectAll("circle").data(data);
    points = points.enter().append("circle")
        .attr("r", 5)
        .attr("fill", "yellowgreen")
        .attr("cx", (row) => {
            let scaledXValue = xScale(row.x);
            return scaledXValue;
        })
        .attr("cy", (row) => {
            let scaledYValue = yScale(row.y);
            return scaledYValue;
        })


}


function getData() {
    d3.csv("data/RandomPoints.csv", (row)=>{
        row.x = +row.x;
        row.y = +row.y;
        return row;
    }).then((data)=>{
        drawVis(data);
    });
}


function testDraw(testData) {

    let g = d3.select("g");
    let circles = g.selectAll("circle")
        .data(testData, (row)=>{
            return row.toString()
        });
    circles.exit().remove();
    circles = circles.enter().append("circle")
        .attr("fill", "red")
        .attr("r", 5)
        .attr('cx', (d)=>{return d})
        .attr("cy", 20)
        .merge(circles);
}