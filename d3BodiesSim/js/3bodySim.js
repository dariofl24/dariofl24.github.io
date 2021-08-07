const colors = ["rgb(255, 183, 3)", "rgb(217, 4, 41)", "rgb(72, 191, 227)"];
var stopFlag = false;
var running = false;

const simulation = function (data) {

    var t = 0;
    const G = 6.6;
    var it = 0;

    var d12, d31, d23;
    var d12s, d31s, d23s;
    var f1x, f2x, f3x, f1y, f2y, f3y;
    var x1, x2, x3, y1, y2, y3;

    var result = {
        b1:[],
        b2:[],
        b3:[]
    };

    while (t <= data.mtime)
    {
        d12s = Math.pow((data.b1.x - data.b2.x), 2) + Math.pow((data.b1.y - data.b2.y), 2);
        d31s = Math.pow((data.b1.x - data.b3.x), 2) + Math.pow((data.b1.y - data.b3.y), 2);
        d23s = Math.pow((data.b2.x - data.b3.x), 2) + Math.pow((data.b2.y - data.b3.y), 2);

        d12 = Math.sqrt(d12s);
        d31 = Math.sqrt(d31s);
        d23 = Math.sqrt(d23s);

        f12 = ((G * data.b1.m * data.b2.m) / d12s);
        f13 = ((G * data.b1.m * data.b3.m) / d31s);
        f23 = ((G * data.b2.m * data.b3.m) / d23s);

        f1x = f12 * ((data.b2.x - data.b1.x) / d12);
        f1x = f13 * ((data.b3.x - data.b1.x) / d31) + f1x;

        f1y = f12 * ((data.b2.y - data.b1.y) / d12);
        f1y = f13 * ((data.b3.y - data.b1.y) / d31) + f1y;

        f2x = f12 * ((data.b1.x - data.b2.x) / d12);
        f2x = f23 * ((data.b3.x - data.b2.x) / d23) + f2x;

        f2y = f12 * ((data.b1.y - data.b2.y) / d12);
        f2y = f23 * ((data.b3.y - data.b2.y) / d23) + f2y;

        f3x = f23 * ((data.b2.x - data.b3.x) / d23);
        f3x = f13 * ((data.b1.x - data.b3.x) / d31) + f3x;

        f3y = f23 * ((data.b2.y - data.b3.y) / d23);
        f3y = f13 * ((data.b1.y - data.b3.y) / d31) + f3y;

        x1 = ((f1x * Math.sqrt(data.dt)) / (2 * data.b1.m)) + (data.b1.v.x * data.dt) + data.b1.x;
        y1 = ((f1y * Math.sqrt(data.dt)) / (2 * data.b1.m)) + (data.b1.v.y * data.dt) + data.b1.y;

        x2 = ((f2x * Math.sqrt(data.dt)) / (2 * data.b2.m)) + (data.b2.v.x * data.dt) + data.b2.x;
        y2 = ((f2y * Math.sqrt(data.dt)) / (2 * data.b2.m)) + (data.b2.v.y * data.dt) + data.b2.y;

        x3 = ((f3x * Math.sqrt(data.dt)) / (2 * data.b3.m)) + (data.b3.v.x * data.dt) + data.b3.x;
        y3 = ((f3y * Math.sqrt(data.dt)) / (2 * data.b3.m)) + (data.b3.v.y * data.dt) + data.b3.y;

        data.b1.v.x = ((f1x / data.b1.m) * data.dt) + data.b1.v.x;
        data.b1.v.y = ((f1y / data.b1.m) * data.dt) + data.b1.v.y;

        data.b2.v.x = ((f2x / data.b2.m) * data.dt) + data.b2.v.x;
        data.b2.v.y = ((f2y / data.b2.m) * data.dt) + data.b2.v.y;

        data.b3.v.x = ((f3x / data.b3.m) * data.dt) + data.b3.v.x;
        data.b3.v.y = ((f3y / data.b3.m) * data.dt) + data.b3.v.y;

        if(it % 20 == 0){

            result.b1.push([scaleX(x1), scaleY(y1)]);
            result.b2.push([scaleX(x2), scaleY(y2)]);
            result.b3.push([scaleX(x3), scaleY(y3)]);

        }

        data.b1.x = x1;
        data.b1.y = y1;

        data.b2.x = x2;
        data.b2.y = y2;

        data.b3.x = x3;
        data.b3.y = y3;

        t += data.dt;
        it += 1;
    }

    console.log("t",t);
    return result;
}

function drawLine(x1, y1, x2, y2, n, svg){
    
    svg.append("line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2)
    .style("stroke", colors[n])
    .style("stroke-width", 1);
}

function scaleX(x){
    return x/5.0;
}

function scaleY(y){
    return (-1*y)/5.0;
}

function startSim(data){
    
    var svg = d3.select("#svg_sim g");

    const svg_node = d3.select("#svg_sim");
    width = +svg_node.node().getBoundingClientRect().width / 2;
    height = +svg_node.node().getBoundingClientRect().height / 2;

    svg.attr("transform", "translate("+width+", "+height+")");

    var body1 = svg.append("circle")
    .attr("cx", data.b1.x/5)
    .attr("cy", -data.b1.y/5)
    .attr("r", 8)
    .attr("fill", colors[0]);

    data.b1["obj"] = body1;

    var body2 = svg.append("circle")
    .attr("cx", data.b2.x/5)
    .attr("cy", -data.b2.y/5)
    .attr("r", 8)
    .attr("fill", colors[1]);

    data.b2["obj"] = body2;

    var body3 = svg.append("circle")
    .attr("cx", data.b3.x/5)
    .attr("cy", -data.b3.y/5)
    .attr("r", 8)
    .attr("fill", colors[2]);

    data.b3["obj"] = body3;

    var dataResult = simulation(data);
    console.log("dataResult.b1.length",dataResult)

    const duration_ms =2;

    // B1
    var b1_iteration = 0;
    
    data.b1.obj.transition()
    .duration(duration_ms)
    .attr("cx", dataResult.b1[b1_iteration][0])
    .attr("cy", dataResult.b1[b1_iteration][1])
    .on("end", function repeat() {

        b1_iteration++;

        if(b1_iteration < dataResult.b1.length-1 && !stopFlag)
        {
            drawLine(dataResult.b1[b1_iteration][0],
                dataResult.b1[b1_iteration][1],
                dataResult.b1[b1_iteration+1][0],
                dataResult.b1[b1_iteration+1][1],
                0,svg);

            d3.active(this)
            .transition()
            .duration(duration_ms)
            .attr("cx", dataResult.b1[b1_iteration][0])
            .attr("cy", dataResult.b1[b1_iteration][1])
            .on("end", repeat);
        }
        else
        {
            console.log("END");
            running = false;
        }
    });

    // B2
    var b2_iteration = 0;
    
    data.b2.obj.transition()
    .duration(duration_ms)
    .attr("cx", dataResult.b2[b2_iteration][0])
    .attr("cy", dataResult.b2[b2_iteration][1])
    .on("end", function repeat() {

        b2_iteration++;

        if(b2_iteration < dataResult.b2.length-1 && !stopFlag)
        {
            drawLine(dataResult.b2[b2_iteration][0],
                dataResult.b2[b2_iteration][1],
                dataResult.b2[b2_iteration+1][0],
                dataResult.b2[b2_iteration+1][1],
                1,svg);

            d3.active(this)
            .transition()
            .duration(duration_ms)
            .attr("cx", dataResult.b2[b2_iteration][0])
            .attr("cy", dataResult.b2[b2_iteration][1])
            .on("end", repeat);
        }
        else
        {
            console.log("END");
            running = false;
        }
    });

    // B3
    var b3_iteration = 0;
    
    data.b3.obj.transition()
    .duration(duration_ms)
    .attr("cx", dataResult.b3[b3_iteration][0])
    .attr("cy", dataResult.b3[b3_iteration][1])
    .on("end", function repeat() {

        b3_iteration++;

        if(b3_iteration < dataResult.b3.length-1 && !stopFlag)
        {
            drawLine(dataResult.b3[b3_iteration][0],
                dataResult.b3[b3_iteration][1],
                dataResult.b3[b3_iteration+1][0],
                dataResult.b3[b3_iteration+1][1],
                2,svg);

            d3.active(this)
            .transition()
            .duration(duration_ms)
            .attr("cx", dataResult.b3[b3_iteration][0])
            .attr("cy", dataResult.b3[b3_iteration][1])
            .on("end", repeat);
        }
        else
        {
            console.log("END");
            running = false;
        }
    });
}

function doStop(){
    stopFlag = true;   
}

function doClear(){

    if(running){
        doStop();
    }

    d3.select("#svg_sim g").remove();
    d3.select("#svg_sim").append("g");
}

function loadData(){

    stopFlag = false;

    pdata ={
        dt:0.01,
        mtime:6500,
        b1:{v:{}},
        b2:{v:{}},
        b3:{v:{}}
    }

    // B1
    pdata.b1.x = (+d3.select("#B1_X").node().value);
    pdata.b1.y = (+d3.select("#B1_Y").node().value);
    pdata.b1.m = (+d3.select("#B1_MASS").node().value);
    pdata.b1.v.x = (+d3.select("#B1_VX").node().value);
    pdata.b1.v.y = (+d3.select("#B1_VY").node().value);

    // B2
    pdata.b2.x = (+d3.select("#B2_X").node().value);
    pdata.b2.y = (+d3.select("#B2_Y").node().value);
    pdata.b2.m = (+d3.select("#B2_MASS").node().value);
    pdata.b2.v.x = (+d3.select("#B2_VX").node().value);
    pdata.b2.v.y = (+d3.select("#B2_VY").node().value);

    // B3
    pdata.b3.x = (+d3.select("#B3_X").node().value);
    pdata.b3.y = (+d3.select("#B3_Y").node().value);
    pdata.b3.m = (+d3.select("#B3_MASS").node().value);
    pdata.b3.v.x = (+d3.select("#B3_VX").node().value);
    pdata.b3.v.y = (+d3.select("#B3_VY").node().value);

    if(!running){
        doClear();
        startSim(pdata);
        running = true;
    }else{
        console.log("ALREADY RUNNING!");
    }
    
}
