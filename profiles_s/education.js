am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("education_chartdiv_digg", am4charts.PieChart);

// Add data

    //Less than HS diploma: 15%
    // High School: 10%
    // Some College: 39%
    // Bachelors Degree: 27%
    // Graduate Degree: 9%

    chart.data = [
        {
            "ageGap": "Less than HS diploma",
            "percent": 15
        },
        {
            "ageGap": "High School",
            "percent": 10
        },
        {
            "ageGap": "Some College",
            "percent": 39
        },
        {
            "ageGap": "Bachelors Degree",
            "percent": 27
        },
        {
            "ageGap": "Graduate Degree",
            "percent": 9
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
    chart.radius = am4core.percent(60);


}); // end am4core.ready()