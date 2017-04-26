var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
// get the data
d3.json("data/RIO_BRT_GPS_T.json", function(error, data) {
  if (error) throw error;

  // format the data
  data.veiculos.forEach(function(d) {
    d.velocidade = +d.velocidade;
  });

  // Scale the range of the data in the domains
  x.domain(data.veiculos.map(function(d) { return d.linha; }));
  y.domain([0, d3.max(data.veiculos, function(d) { return d.velocidade; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data.veiculos)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.linha); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.velocidade); })
      .attr("height", function(d) { return height - y(d.velocidade); });

  // add the x Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});