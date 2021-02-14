am4core.ready(function() {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("income_chartdiv_digg", am4charts.PieChart);

// Add data

    chart.data = [ {
        "ageGap": "$0 – $24.9K",
        "percent": 14
    }, {
        "ageGap": "$25K – $49.9K",
        "percent": 28
    }, {
        "ageGap": "$50K – $74.9K",
        "percent": 25
    }, {
        "ageGap": "$75K – $99.9K",
        "percent": 20
    }, {
        "ageGap": "$100K – $149.9K",
        "percent": 10
    }, {
        "ageGap": "$150K or More",
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