document.addEventListener("DOMContentLoaded", ()=>{
    d3.interval(() => {
        console.log(randomResults());
        update(randomResults())
    }, 5000)
});


function update(data) {
    let grouped = d3.nest()
        .key((d) => { return d.topic})
        .entries(data);

    console.log(grouped);

    const body = d3.select('body');
    let svg = body.selectAll('svg').data(grouped);
    svg.exit().remove();
    svg = svg.enter().append('svg').merge(svg);

    svg.attr('height', 50)
        .attr('width', 50);

}

function randomResults() {
    const topic_category = {
        'Donuts' : ['Maple', 'Chocolate Cake', 'Glazed', 'Old Fashioned'],
        'NFL' : ['Raiders', 'Seahawks', 'Patriots'],
        'European Car' : ['Mercedez' ,'BMW', 'Porsche', 'Audi', 'Fiat'],
        'RPG' : ['Orc', 'Elf', 'Cleric' ,'Mage']
    };

    return Object.entries(topic_category).map((item) => {
      const topic = item[0];
      let cats = item[1];
      cats = d3.shuffle(cats);
      // let random_array = Array.from({length: cats.length}, () => Math.floor(Math.random() * cats.length));
        let random_array = Array.from({length: cats.length}, () => Math.random());

      const sum = random_array.reduce(get_sum);
      const normalized_array = random_array.map((item) => {
          return item / sum;
      });
      return d3.zip(normalized_array, cats).map((tuple) => {
          return {topic, 'cat' : tuple[1], 'frac' : tuple[0]}
      })
    }).reduce(concat_reduce);

}

function get_sum(total, item){
    return total + item;
}

function concat_reduce(all, new_a) {
    return all.concat(new_a);
}
