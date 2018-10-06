let data;
const maxPossible = Number.MAX_SAFE_INTEGER;

let x, y, radius, color;


document.addEventListener("DOMContentLoaded", () => {
    const filterButton = document.getElementById("filter-button")
        .addEventListener("click", filterCallback);
    const clearButton = document.getElementById("clear-button")
        .addEventListener("click", clearCallback);
    getData();
});

function setup(data) {
    let d = data;

    const svg = d3.select('svg')
        .attr("width", 750)
        .attr('height', 500);

    const margins = {top: 20, right: 20, bottom: 60, left: 90};
    const width = +svg.attr('width') - margins.left - margins.right;
    const height = +svg.attr('height') - margins.top - margins.bottom;

    const dotGroup = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .attr("id", "dot-group");


    x = d3.scaleLinear().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);
    radius = d3.scaleLinear().range([8, 20]);
    color = d3.scaleOrdinal().domain(['m', 'f']).range(['#9EB200', '#9F19FF']);

    x.domain([d3.min(d, (d) => {return +d.height}) * .8, d3.max(d, (d) => {return +d.height}) * 1.1]);
    y.domain([d3.min(d, (d) => {return +d.weight}) * .8, d3.max(d, (d) => {return +d.weight}) * 1.1]);
    radius.domain(d3.extent(d, d => +d.age));



    const xAxisGroup = svg.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(${margins.left}, ${margins.top + height + 2})`)
        .call(d3.axisBottom(x));

    xAxisGroup.append("text")
        .text("Height")
        .attr("font-family", 'sans-serif')
        .attr("transform", "translate(600, -10)")
        .attr("font-size", 16)
        .attr("fill", "black");

    const yAxisGroup = svg.append('g')
        .attr('class', 'axis axis-y')
        .attr('transform', `translate(${margins.left - 2}, ${margins.top})`)
        .call(d3.axisLeft(y));

    yAxisGroup.append("text")
        .text("Weight")
        .attr("font-family", 'sans-serif')
        .attr("transform", "translate(20, 5) rotate(270)")
        .attr("font-size", 16)
        .attr("fill", "black");

    update();
}


function update(ageMin=0, ageMax=maxPossible, weightMin=0, weightMax=maxPossible,
                heightMin=0, heightMax=maxPossible, gender=null) {

    // let d = copyData();
    // d.sort((a, b) => {return +a.age - +b.age});

    // Apply Filters
    let d = data.filter((d)=>{return +d.age > ageMin && +d.age < ageMax})
        .filter((d)=>{return +d.height > heightMin && +d.height < heightMax})
        .filter((d)=>{return +d.weight > weightMin && +d.weight < weightMax});
    if (gender) {
        d = d.filter((d) => {return d.gender === gender})
    }


    // Draw
    let dotGroup = d3.select("#dot-group");
    let svg = d3.select("svg");

    let dots = dotGroup.selectAll('circle').data(d, function(d){
        return d.name
    });
    dots.exit().remove();
    dots = dots.enter().append('circle').merge(dots);


    dots.attr('fill', (d)=>{
        return color(d.gender);
    })
        .attr('r', (d) => {
            return radius(+d.age)
        })
        .attr('cx', (d)=>{
            const cx = x(+d.height);
            return cx;
        })
        .attr('cy', (d)=>{
            const cy = y(+d.weight);
            return cy;
        });

    let names = dotGroup.selectAll('text').data(d, function(d){
        return d.name
    });
    names.exit().remove();
    names = names.enter().append('text').merge(names);

    names.text((d) => {
        return d.name;
    }).attr('x', (d)=>{
        return x(+d.height) + radius(+d.age)
    })
        .attr('y', (d)=>{
            return y(+d.weight) + radius(+d.age)
        })
        .style('font-family', 'sans-serif')
        .attr('text-anchor', 'start')
        .attr("alignment-baseline", 'hanging');
}

function getData() {
    d3.csv('data/People.csv').then((d) => {
        data = d;
        setup(data);
    });
}


function filterCallback(e) {
    let args = {
        ageMin : 0,
        ageMax:maxPossible,
        weightMin:0,
        weightMax:maxPossible,
        heightMin:0,
        heightMax:maxPossible,
        gender:null
    };

    let inputs = d3.selectAll("input")
        .each(function(d) {
            if (this.type === "radio"){
                if(this.checked){
                    args.gender = this.value;
                }
            } else {
                if (this.value) {
                    args[this.dataset.bound] = +this.value;
                }
            }
        });
    return update(args.ageMin, args.ageMax, args.weightMin, args.weightMax,
        args.heightMin, args.heightMax, args.gender);
}

function clearCallback(e) {
    d3.selectAll("input")
        .each(function (d) {
            if (this.type !== 'radio') {
                this.value = ''
            } else {
                this.checked = false;
            }

        });
    update();
}

function copyData(){
    let copy = [];
    data.map((line)=>{
        let single = Object.assign({}, line);
        copy.push(single);
    });
    return copy;
}
