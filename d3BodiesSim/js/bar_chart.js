const draw_sales_country = function(){
  
  var margin = {top: 20, right: 30, bottom: 40, left: 90},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  
  
  var svg = d3.select("#cel_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");


d3.csv("../data/sales_country.csv", function(data) {

  
var x = d3.scaleLinear()
    .domain([0, 1014])
    .range([ 0, width]);
    
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  
var y = d3.scaleBand()
.range([ 0, height ])
.domain(data.map(function(d) { return d.Country; }))
.padding(.1);

svg.append("g")
.call(d3.axisLeft(y))

  
svg.selectAll("myRect")
.data(data)
.enter()
.append("rect")
.attr("x", x(0) )
.attr("y", function(d) { return y(d.Country); })
.attr("width", function(d) { return x(d.Value); })
.attr("height", y.bandwidth() )
.attr("fill", "rgb(18, 86, 182)")
})

}

draw_sales_country();