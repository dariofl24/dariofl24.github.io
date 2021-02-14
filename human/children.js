am4core.ready(function() {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("children_chartdiv_digg", am4charts.PieChart);

// Add data

    chart.data = [ {
        "ageGap": "Yes",
        "percent": 22
    }, {
        "ageGap": "No",
        "percent": 78
    }
    ];

// Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "percent";
    pieSeries.dataFields.category = "ageGap";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    pieSeries.colors.step = 8;

    chart.hiddenState.properties.radius = am4core.percent(0);
    chart.radius = am4core.percent(85);


}); // end am4core.ready()