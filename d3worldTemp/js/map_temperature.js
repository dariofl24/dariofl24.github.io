
var cachedTemperatureCountry = {};

const countryTempChart = function(country) {
    
    d3.select("#word_temp").style("visibility","visible");
    d3.select("#word_temp_title").style("visibility","visible");
    
    d3.select("#word_temp > svg").remove();

    const formater = function(d){return { date : d.date, value : +d.value }};

    const drawChart = function(data) {

        const margin = {top: 20, right: 30, bottom: 60, left: 60};

        const wordTemp =d3.select("#word_temp");
        const width = +wordTemp.node().getBoundingClientRect().width - margin.left - margin.right;
        const height = +wordTemp.node().getBoundingClientRect().height - margin.top - margin.bottom;

        var svg = wordTemp.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2.0)
        .attr("y", height + 40)
        .text("Year");

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", -90)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Temperature (Celsius)");
    
        var x_scale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale).tickFormat( (d,i) => d.toString() ));
    
        var y_scale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.value; }), d3.max(data, function(d) { return d.value; })])
        .range([ height, 0 ]);

        svg.append("g").call(d3.axisLeft(y_scale));
    
        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "aliceblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x_scale(d.date) })
        .y(function(d) { return y_scale(d.value) }))    
    };

    const cacheAndDrawChart = function(data) {

        if(data)
        {
            cachedTemperatureCountry[country] = data;
            drawChart(data);
        }
    };

    if(cachedTemperatureCountry[country])
    {
        drawChart(cachedTemperatureCountry[country]);
    }
    else
    {
        d3.csv("./data_temps/" + country + ".csv", formater, cacheAndDrawChart);
    }
}


var cachedDataCountry;

const countryMap = function(dataFile, country) {

    d3.select("#map_svg > g").remove();

    const drawCountry = function(data) {
        var reportValues = data.features.map(val => val.properties["tempRate"]);

        const colorFunction = d3.scaleSequential()
        .domain(d3.extent(Array.from(reportValues)))
        .interpolator(d3.interpolateOrRd);

        const countryData = data.features.filter(d => d.id == country)[0];

        d3.select("#country_label").text(countryData.properties["name"]);

        var zoom = countryData.properties.zoom || 2580;

        const svg = d3.select("svg");
        width = +svg.node().getBoundingClientRect().width;
        height = +svg.node().getBoundingClientRect().height;

        var projection = d3.geoMercator()
        .center(countryData.properties.center)
        .scale(zoom)
        .translate([ width/2, height/2 ])

        const fillFunction = function(d) {

            if(d.properties["tempRate"] && d.id == country)
            {
                return colorFunction(d.properties["tempRate"]);
            }
            else
            {
                if(d.id == country)
                {
                    return "red";
                }
                else
                {
                    return "#ccc";
                }
            }
        };

        svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", fillFunction)
        .attr("d", d3.geoPath().projection(projection))
        .attr("onclick", d => "javascript:countryMap('"+ dataFile + "','" + d.id + "')")
        .style("stroke", "white");
    };

    const cacheAndDrawCountry = function(data) {
        cachedDataCountry = data;
        drawCountry(cachedDataCountry);
    };

    if(cachedDataCountry)
    {
        drawCountry(cachedDataCountry);
    }
    else
    {
        d3.json(dataFile, cacheAndDrawCountry);
    }

    countryTempChart(country);
};

var cachedDataWorld;

const worldMap = function(dataFile) {

    d3.select("#map_svg > g").remove();
    d3.select("#country_label").text("World");

    d3.select("#word_temp").style("visibility","hidden");
    d3.select("#word_temp_title").style("visibility","hidden");
    d3.select("#word_temp > svg").remove();

    const drawWorldMap = function(data) {

        var reportValues = data.features.map(val => val.properties["tempRate"]);

        console.log(reportValues);

        const colorFunction = d3.scaleSequential()
        .domain(d3.extent(Array.from(reportValues)))
        .interpolator(d3.interpolateOrRd);

        const fillFunction = function(d) {

            if(d.properties["tempRate"])
            {
                return colorFunction(d.properties["tempRate"]);
            }
            else
            {
                return "#ccc";
            }
        };

        var svg = d3.select("svg");
        width = +svg.node().getBoundingClientRect().width;
        height = +svg.node().getBoundingClientRect().height;
        
        const projection = d3.geoNaturalEarth1()
        .scale(width / 1.7 / Math.PI)
        .translate([width / 2, height / 2]);

        svg.append("g").selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", fillFunction)
        .attr("onclick", d => "javascript:countryMap('"+ dataFile + "','" + d.id + "')")
        .style("stroke", "#7D7F7F");
    };

    const cacheAndDrawWorldMap = function(data){
        
        cachedDataWorld = data;
        drawWorldMap(cachedDataWorld);
    };

    if(cachedDataWorld)
    {
        drawWorldMap(cachedDataWorld);
    }
    else
    {
        d3.json(dataFile, cacheAndDrawWorldMap);
    }
};

var cachedDataList;

const countriesList = function(datsource) {
    
    const createList = function (data) 
    {
        d3.select("#countries").selectAll("li")
        .data(data.features)
        .enter()
        .append("li")
        .attr("class", "country_li")
        .sort( (a,b) => (b.properties["tempRate"]||0) - (a.properties["tempRate"]||0));

        d3.selectAll("#countries li")
        .append("a")
        .attr("onclick", d => "javascript:countryMap('"+ datsource + "','" + d.id + "')")
        .text(d => d.properties.name);
    };
    
    const cacheAndCreateList = function(data)
    {
        cachedDataList = data;
        createList(cachedDataList);
    };

    if(cachedDataList)
    {
        createList(cachedDataList);
    } 
    else 
    {
        d3.json(datsource, cacheAndCreateList);
    }

};

const datsource = "./data/data.geojson";

countriesList(datsource);
worldMap(datsource);
