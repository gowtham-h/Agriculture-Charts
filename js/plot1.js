(function(){
var margin = {top: 20, right: 20, bottom: 190, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.3);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(6)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return "<span style='color:black'>" + d.Production + " (Ton mn)</span>";
  })


var svg = d3.select("#tab1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);


d3.json("../data/json/oilseed.json", function(error, data) {
  if (error) console.log(error);
  x.domain(data.map(function(d) { return d.Particulars; }));
  y.domain([0, 16]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.5em")
      .style("text-anchor", "end")
      .text("Production");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Particulars); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Production); })
      .attr("height", function(d) { return height - y(d.Production); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});
})();
