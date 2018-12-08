document.addEventListener("DOMContentLoaded", ()=>{
    update(randomResults());
    d3.interval(() => {
        console.log(randomResults());
        update(randomResults());
    }, 2500)
});

function update(data) {
    let grouped = d3.nest()
        .key((d) => { return d.topic})
        .entries(data);

    grouped.map((group) => {
        group.values.sort((a, b) => {return a.order - b.order})
    });

    console.log(grouped);

    // let colorScale = d3.scaleLinear().domain([0, 1]).range(['#ffb3bb', '#c80635']);
    let colorScale = d3.scaleOrdinal(d3.schemePaired);


    /*** Draw the Donut Charts ***/

    let pieGen = d3.pie().value(d => d.frac).sort((a, b) => {
        let diff = a.order - b.order
        return diff;
    });
    let arcGen = d3.arc()
        .innerRadius(35)
        .outerRadius(50)
        .padAngle(.03);

    const body = d3.select('body');
    let svg = body.selectAll('svg').data(grouped);
    svg.exit().remove();
    svg = svg.enter().append('svg').merge(svg);

    svg.attr('height', 150)
        .attr('width', 220);

    let arcGroups = svg.selectAll('g.arc').data(d => [d]);
    arcGroups.exit().remove();
    arcGroups = arcGroups.enter().append('g').merge(arcGroups);
    arcGroups.attr('transform', 'translate(50, 100)')
        .classed('arc', true);

    arcGroups.each(function (d, i) {
        let arcData = pieGen(d.values);
        let arcs = d3.select(this).selectAll('path').data(arcData, d => d.data.cat);
        arcs.exit().remove();
        arcs = arcs.enter().append('path').merge(arcs);
        arcs.attr('fill', (d, i) => {
            return colorScale(d.index)
        })
            .transition()
            .duration(1000)
            .attrTween('d', arcTween);
    });


    function arcTween(d) {
        // Copy _oldData for use with interpolator so we can assign new value to it in next line.
        let i = this._oldData ? d3.interpolate(Object.assign({}, this._oldData), d) : d3.interpolate(d, d);
        this._oldData = d;
        return function (t) {
            return arcGen(i(t))
        }
    }


    /*** Draw the titles and labels ***/

    // Topic Titles
    let titles = svg.selectAll('text').data(d => [d]);
    titles = exitRemoveEnterAppend(titles, 'text');
    titles.text(d => d.values[0].topic)
        .attr('font-family', 'Roboto, sans-serif')
        .attr('font-size', 22)
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(5, 0)');

    // Create the Labels
    // Topic-level groups
    let topicGroups = svg.selectAll('g.topic-level').data(d => [d]);
    topicGroups.exit().remove();
    topicGroups = topicGroups.enter().append('g').merge(topicGroups);
    topicGroups.classed('topic-level', true)
        .attr('transform', 'translate(110, 50)');

    // category-level groups
    let catGroups = topicGroups.selectAll('g.cat-level').data(d => d.values);
    catGroups.exit().remove();
    catGroups = catGroups.enter().append('g').merge(catGroups);
    catGroups.classed('cat-level', true)
        .attr('transform', (d, i) => `translate(0, ${i * 20})`); // Position label based on index

    let catColorBox = catGroups.selectAll('rect').data(d => [d]);
    catColorBox = exitRemoveEnterAppend(catColorBox, 'rect');
    catColorBox.attr('fill', d => colorScale(d.order))
        .attr('width', 12)
        .attr('height', 12);

    let catName = catGroups.selectAll('text').data(d => [d]);
    catName = exitRemoveEnterAppend(catName, 'text');
    catName.text(d => d.cat)
        .attr('font-family', 'Roboto, sans-serif')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'baseline')
        .attr('transform', `translate(15, 10)`);

}


function randomResults() {
    const topic_category = {
        'Donuts' : ['Maple', 'Chocolate Cake', 'Glazed', 'Old Fashioned'],
        'NFL' : ['Raiders', 'Seahawks', 'Patriots'],
        'European Car' : ['Mercedez' ,'BMW', 'Porsche', 'Audi', 'Fiat'],
        'RPG Character' : ['Orc', 'Elf', 'Cleric' ,'Mage']
    };

    return Object.entries(topic_category).map((item) => {
      const topic = item[0];
      let cats = item[1];
      let indices = d3.range(cats.length);
      let cat_index = d3.zip(cats, indices);
      cat_index = d3.shuffle(cat_index);

      let random_array = Array.from({length: cats.length}, () => Math.random());

      const sum = random_array.reduce(get_sum);
      const normalized_array = random_array.map((item) => {
          return item / sum;
      });

      return d3.zip(normalized_array, cat_index).map((tuple) => {

          return {topic, 'cat' : tuple[1][0], 'order' : tuple[1][1], 'frac' : tuple[0]}
      })
    }).reduce(concat_reduce);
}

function get_sum(total, item){
    return total + item;
}

function concat_reduce(all, new_a) {
    return all.concat(new_a);
}

function exitRemoveEnterAppend(selection, appendType) {
    selection.exit().remove();
    return selection.enter().append(appendType).merge(selection);
}
