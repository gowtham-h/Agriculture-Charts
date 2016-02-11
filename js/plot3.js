(function(){

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

      var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:black'>" + d.Production + " (Ton mn)</span>";
            })
  var line = d3.svg.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Quantity); });

  var svg = d3.select("#tab3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

  d3.json("../data/json/commercial.json", function(error, data) {
    if (error) throw error;
    x.domain(data.map(function(d) {  return d.Year}));
     y.domain(d3.extent(data, function(d) { return d.Quantity; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Production(Ton mn)");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 2)
        // .attr('stroke', 'red')
        .attr('fill', 'steelblue')
        .attr("cx", function(d) {
          return x(d.Year);
        })
        .attr("cy", function(d) {
          return y(d.Quantity);
        })


  });
})();
