const countryMap = function(dataFile, country) {

    d3.select("#data-table").style("visibility","visible");
    d3.select("#map_svg > g").remove();
    var svg = d3.select("svg");

    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    
    
    d3.json(dataFile, function(data){

        // Color function
        var reportValues = data.features.map(val => val.properties["v2019"]);
        
        const colorFunction = d3.scaleSequential()
        .domain(d3.extent(Array.from(reportValues)))
        .interpolator(d3.interpolateGnBu);

        const fillFunction = function(d) {

            if(d.properties["v2019"] && d.id == country){
                return colorFunction(d.properties["v2019"]);
            }else{

                if(d.id == country){
                    return "red";
                }else{
                    return "#ccc";
                }
            }
        };
        
        const countryData = data.features.filter(function(d){
            return d.id == country;
        })[0];

        console.log(countryData);

        d3.select("#country_label").text(countryData.properties["name"]);

        d3.select("#th-name").text(countryData.properties["name"] || 'N/A');
        d3.select("#rank").text(countryData.properties["rank"] || 'N/A');
        d3.select("#gdp").text(countryData.properties["gdp"] || 'N/A');
        d3.select("#social_supp").text(countryData.properties["social_supp"] || 'N/A');
        d3.select("#life_exp").text(countryData.properties["life_exp"] || 'N/A');
        d3.select("#freedom").text(countryData.properties["freedom"] || 'N/A');
        d3.select("#generosity").text(countryData.properties["generosity"] || 'N/A');
        d3.select("#corruption").text(countryData.properties["corruption"] || 'N/A');
        
        var zoom = countryData.properties.zoom || 2580;
    
        var projection = d3.geoMercator()
        .center(countryData.properties.center)
        .scale(zoom)
        .translate([ width/2, height/2 ])

        svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", fillFunction)
        .attr("d", d3.geoPath().projection(projection))
        .attr("onclick", d => "javascript:countryMap('./data/data.geojson','"+d.id+"')")
        .style("stroke", "white");
});

};

const worldMap = function(dataFile){
    
    d3.select("#data-table").style("visibility","hidden");
    d3.select("#map_svg > g").remove();
    var svg = d3.select("svg");
    
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    
    const projection = d3.geoNaturalEarth1()
    .scale(width / 1.7 / Math.PI)
    .translate([width / 2, height / 2]);
    
    d3.select("#country_label").text("World");

    const processData = function(data) {
        
        var reportValues = data.features.map(val => val.properties["v2019"]);
        
        const colorFunction = d3.scaleSequential()
        .domain(d3.extent(Array.from(reportValues)))
        .interpolator(d3.interpolateGnBu);
        
        const fillFunction = function(d) {

            if(d.properties["v2019"]){
                return colorFunction(d.properties["v2019"]);
            }else{
                return "#ccc";
            }
        };
        
        const g = svg.append("g");
        
        g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", fillFunction)
        .attr("onclick", d => "javascript:countryMap('./data/data.geojson','"+d.id+"')")
        .style("stroke", "#7D7F7F");
};

d3.json(dataFile, processData);

};

const countriesList = function(datsource){

    d3.json(datsource, function (data) {

        d3.select("#countries").selectAll("li")
            .data(data.features)
            .enter()
            .append("li")
            .attr("class", "country_li")
            .sort( (a,b) => (b.properties["v2019"]||0) - (a.properties["v2019"]||0));
            
            d3.selectAll("#countries li")
            .append("a")
            .attr("onclick", d => "javascript:countryMap('./data/data.geojson','"+d.id+"')")
            .text(function(d) { 
                return d.properties.name; 
            });
    });
};

const datsource = "./data/data.geojson";

countriesList(datsource);
worldMap(datsource);
