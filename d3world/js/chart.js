    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1020 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    var svg = d3.select("#word_temp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    d3.csv("./data_temps/CUB.csv", function(d){return { date : d.date, value : +d.value }},
    function(data) {
    
        var x_scale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale)
        .tickFormat( (d,i) => d.toString() )
        );
    
        var y_scale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.value; }), d3.max(data, function(d) { return d.value; })])
        .range([ height, 0 ]);

        svg.append("g")
        .call(d3.axisLeft(y_scale));
    
        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x_scale(d.date) })
        .y(function(d) { return y_scale(d.value) }))
        
    })
