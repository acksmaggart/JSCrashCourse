document.addEventListener("DOMContentLoaded", ()=>{
    update([1, 2, 3]);
    update([1, 2, 3, 4]);
});


function update(data) {

    let body = d3.select("body");
    let svg = body.select("svg");

    if (svg.empty()){
        body.append("svg");
        svg = body.select("svg");
    }

    let topGroups = svg.selectAll("g.top-group").data(data);
    topGroups = topGroups.enter().append("g")
        .classed("top-group", true)
        .merge(topGroups);

    // let circleData = d3.range(5).map((d)=>{return Math.random() * 10});
    let bottomGroups = topGroups.selectAll("g").data(d=>[d]);
    bottomGroups = bottomGroups.enter().append("g").merge(bottomGroups);



}