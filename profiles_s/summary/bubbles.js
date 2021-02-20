am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("chartdiv_bubbles", am4charts.XYChart);
    chart.colors.step = 3;

// Add data
    chart.data = [{
        "education": 3.5,
        "subject": 4,
        "exp": 4,
        "uname": "Karen Fortou"
    }, {
        "education": 4.5,
        "subject": 5,
        "exp": 4.5,
        "uname": "Mike Rafun"
    }, {
        "education": 2,
        "subject": 2.5,
        "exp": 2.5,
        "uname": "Jack Nymbul"
    }];

// Create axes
    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.min = 2;
    xAxis.max = 6;
    xAxis.title.text = "Subject matter knowledge";
    xAxis.title.fontWeight = "bold";


    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 1.5;
    yAxis.max = 6;
    yAxis.title.text = "Education";
    yAxis.title.fontWeight = "bold";

// Create series #1
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "education";
    series.dataFields.valueX = "subject";
    series.dataFields.value = "exp";
    series.dataFields.category = "uname";
    series.strokeOpacity = 0;
    series.name = "Series 1";

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.strokeOpacity = 0.2;
    bullet.stroke = am4core.color("#ffffff");
    bullet.nonScalingStroke = true;
    bullet.tooltipText = "education:{valueX} subject:{valueY}";
    series.heatRules.push({
        target: bullet.circle,
        min: 10,
        max: 60,
        property: "radius"
    });

    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{category}";

    //chart.legend = new am4charts.Legend();

}); // end am4core.ready()

am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("chartdiv_bubbles_2", am4charts.XYChart);
    chart.colors.step = 3;

// Add data
    chart.data = [{
        "comm": 3.5,
        "presentation": 3,
        "friendliness": 4,
        "uname": "Karen Fortou"
    }, {
        "comm": 2,
        "presentation": 1.5,
        "friendliness": 2,
        "uname": "Mike Rafun"
    }, {
        "comm": 5,
        "presentation": 2.75,
        "friendliness": 4.5,
        "uname": "Jack Nymbul"
    }];

// Create axes
    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    //xAxis.renderer.maxGridDistance = 5;
    xAxis.min = 1;
    xAxis.max = 4;
    xAxis.title.text = "Presentation";
    xAxis.title.fontWeight = "bold";

    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // yAxis.renderer.minGridDistance = 50;
    yAxis.min = 1.5;
    yAxis.max = 6;
    yAxis.title.text = "Communication";
    yAxis.title.fontWeight = "bold";

// Create series #1
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "comm";
    series.dataFields.valueX = "presentation";
    series.dataFields.value = "friendliness";
    series.dataFields.category = "uname";
    series.strokeOpacity = 0;
    series.name = "Series 1";

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.strokeOpacity = 0.2;
    bullet.stroke = am4core.color("#ffffff");
    bullet.nonScalingStroke = true;
    bullet.tooltipText = "education:{valueX} subject:{valueY}";
    series.heatRules.push({
        target: bullet.circle,
        min: 10,
        max: 60,
        property: "radius"
    });

    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{category}";

    //chart.legend = new am4charts.Legend();

}); // end am4core.ready()

