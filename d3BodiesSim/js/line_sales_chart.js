const draw_pie = function(component, dataFile){

    var width = 450
    height = 400
    margin = 20

var radius = (Math.min(width, height) / 3.2) - margin

var svg = d3.select(component)
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.json(dataFile, function(data) {
    
    var color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie().value(function(d) {return d.value; })

var data_ready = pie(d3.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
.innerRadius(radius/1.5)
.outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg.selectAll('mySlices')
.data(data_ready)
.enter()
.append('path')
.attr('d', arcGenerator)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg.selectAll('mySlices')
.data(data_ready)
.enter()
.append('text')
.text(function(d){ return d.data.key})
.attr("transform", function(d) 
{
    var centroid = arcGenerator.centroid(d);
    var scale = 1.7;
    svg.append('line')
    .attr('x1', centroid[0]*scale)
    .attr('y1', centroid[1]*scale)
    .attr('x2', centroid[0])
    .attr('y2', centroid[1])
    .attr('stroke', 'black')

    var yup = 11;
    if(centroid[1] < 0){
        var yup = -11;
    }

    return "translate(" + (centroid[0]*scale)+"," + ((centroid[1]*scale) + yup) + ")";  
})
.style("text-anchor", "middle")
.style("font-size", 17);

});

}

draw_pie("#cel_3","../data/line_sales.json");
draw_pie("#cel_4","../data/deals_data.json");
