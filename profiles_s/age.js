am4core.ready(function() {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("age_chartdiv_digg", am4charts.PieChart);

// Add data

    chart.data = [ {
        "ageGap": "0 – 17",
        "percent": 11
    }, {
        "ageGap": "18 – 24",
        "percent": 9
    }, {
        "ageGap": "25 – 34",
        "percent": 18
    }, {
        "ageGap": "35 – 44",
        "percent": 29
    }, {
        "ageGap": "45 – 54",
        "percent": 18
    }, {
        "ageGap": "55 – 64",
        "percent": 10
    }, {
        "ageGap": "65 or more",
        "percent": 4
    }
    ];

// Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "percent";
    pieSeries.dataFields.category = "ageGap";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    //
    chart.radius = am4core.percent(45);
    chart.innerRadius = am4core.percent(25);
    chart.startAngle = 180;
    chart.endAngle = 360;
    //

// This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    pieSeries.colors.step = 3;

    chart.hiddenState.properties.radius = am4core.percent(0);
    //chart.radius = am4core.percent(60);


}); // end am4core.ready()