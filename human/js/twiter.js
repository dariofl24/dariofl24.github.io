am4core.ready(function () {

    am4core.useTheme(am4themes_animated);

    var iconPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z";

    var chart = am4core.create("gender_chartdiv_twiter", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [
        {
            "name": "Male",
            "value": 43
        },
        {
            "name": "Female",
            "value": 57
        }
    ];

    var series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.alignLabels = true;

    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0.5;

    series.labelsContainer.width = 190;

    series.colors.list = [
        am4core.color("#3a74d4"),
        am4core.color("#D65DB1")
    ];

});

am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("income_chartdiv_twiter", am4charts.PieChart);

// Add data
    //$0 – $24,999: 13%
    // $25,000 – $49,999: 30%
    // $50,000 – $74,999: 27%
    // $75,000 – $99,999: 16%
    // 100,000 – $149,999: 10%
    // $150,000 or More: 4%

    chart.data = [
        {
            "ageGap": "$0 – $24.9K",
            "percent": 13
        },
        {
            "ageGap": "$25K – $49.9K",
            "percent": 30
        },
        {
            "ageGap": "$50K – $74.9K",
            "percent": 27
        },
        {
            "ageGap": "$75K – $99.9K",
            "percent": 16
        },
        {
            "ageGap": "$100K – $149.9K",
            "percent": 10
        },
        {
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

am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("age_chartdiv_twiter", am4charts.PieChart);

// Add data


    chart.data = [
        {
            "ageGap": "0 – 17",
            "percent": 11
        },
        {
            "ageGap": "18 – 24",
            "percent": 8
        },
        {
            "ageGap": "25 – 34",
            "percent": 16
        },
        {
            "ageGap": "35 – 44",
            "percent": 29
        },
        {
            "ageGap": "45 – 54",
            "percent": 20
        },
        {
            "ageGap": "55 – 64",
            "percent": 11
        },
        {
            "ageGap": "65 or more",
            "percent": 3
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

am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("children_chartdiv_twiter", am4charts.PieChart);

// Add data

    chart.data = [
        {
            "ageGap": "Yes",
            "percent": 28
        },
        {
            "ageGap": "No",
            "percent": 72
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

am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("education_chartdiv_twiter", am4charts.PieChart);

// Add data

    chart.data = [
        {
            "ageGap": "Less than HS diploma",
            "percent": 12
        },
        {
            "ageGap": "High School",
            "percent": 9
        },
        {
            "ageGap": "Some College",
            "percent": 47
        },
        {
            "ageGap": "Bachelors Degree",
            "percent": 24
        },
        {
            "ageGap": "Graduate Degree",
            "percent": 8
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
