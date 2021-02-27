am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
    chart.data = [
        {
            "year": "2009 1Q",
            "hombres": 6181,
            "mujeres": 5618,
            "total": 11799
        },
        {
            "year": "2009 2Q",
            "hombres": 5669,
            "mujeres": 5152,
            "total": 10821
        },
        {
            "year": "2009 3Q",
            "hombres": 3378,
            "mujeres": 3069,
            "total": 6447
        },
        {
            "year": "2009 4Q",
            "hombres": 3266,
            "mujeres": 2969,
            "total": 6235
        },
        {
            "year": "2010 1Q",
            "hombres": 5629,
            "mujeres": 5187,
            "total": 10816
        },
        {
            "year": "2010 2Q",
            "hombres": 5845,
            "mujeres": 5386,
            "total": 11231
        },
        {
            "year": "2010 3Q",
            "hombres": 4356,
            "mujeres": 4015,
            "total": 8371
        },
        {
            "year": "2010 4Q",
            "hombres": 3409,
            "mujeres": 3141,
            "total": 6550
        },
        {
            "year": "2011 1Q",
            "hombres": 6221,
            "mujeres": 6629,
            "total": 12850
        },
        {
            "year": "2011 2Q",
            "hombres": 7413,
            "mujeres": 7898,
            "total": 15311
        },
        {
            "year": "2011 3Q",
            "hombres": 8230,
            "mujeres": 8770,
            "total": 17000
        },
        {
            "year": "2011 4Q",
            "hombres": 8447,
            "mujeres": 9002,
            "total": 17449
        },
        {
            "year": "2012 1Q",
            "hombres": 10139,
            "mujeres": 9391,
            "total": 19530
        },
        {
            "year": "2012 2Q",
            "hombres": 10950,
            "mujeres": 10143,
            "total": 21093
        }
    ];

// Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    //categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

// Create series
    function createSeries(field, name, fill) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "year";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;
        series.columns.template.fill = am4core.color(fill);
        series.columns.template.stroke = am4core.color("#ffffff");

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}";
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
    }

    createSeries("hombres", "Hombres", "#32c3fd");
    createSeries("mujeres", "Mujeres", "#e354e7");
    //createSeries("total", "Total");

}); // end am4core.ready()


am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.XYChart);

// Add data
    chart.data = [
        {
            "year": "2009 1Q",
            "hombres": 6181,
            "mujeres": 5618,
            "total": 11799
        },
        {
            "year": "2009 2Q",
            "hombres": 5669,
            "mujeres": 5152,
            "total": 10821
        },
        {
            "year": "2009 3Q",
            "hombres": 3378,
            "mujeres": 3069,
            "total": 6447
        },
        {
            "year": "2009 4Q",
            "hombres": 3266,
            "mujeres": 2969,
            "total": 6235
        },
        {
            "year": "2010 1Q",
            "hombres": 5629,
            "mujeres": 5187,
            "total": 10816
        },
        {
            "year": "2010 2Q",
            "hombres": 5845,
            "mujeres": 5386,
            "total": 11231
        },
        {
            "year": "2010 3Q",
            "hombres": 4356,
            "mujeres": 4015,
            "total": 8371
        },
        {
            "year": "2010 4Q",
            "hombres": 3409,
            "mujeres": 3141,
            "total": 6550
        },
        {
            "year": "2011 1Q",
            "hombres": 6221,
            "mujeres": 6629,
            "total": 12850
        },
        {
            "year": "2011 2Q",
            "hombres": 7413,
            "mujeres": 7898,
            "total": 15311
        },
        {
            "year": "2011 3Q",
            "hombres": 8230,
            "mujeres": 8770,
            "total": 17000
        },
        {
            "year": "2011 4Q",
            "hombres": 8447,
            "mujeres": 9002,
            "total": 17449
        },
        {
            "year": "2012 1Q",
            "hombres": 10139,
            "mujeres": 9391,
            "total": 19530
        },
        {
            "year": "2012 2Q",
            "hombres": 10950,
            "mujeres": 10143,
            "total": 21093
        }
    ];

// Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    //categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

// Create series
    function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "year";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}";
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#363636");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
    }

    // createSeries("hombres", "Hombres");
    // createSeries("mujeres", "Mujeres");
    createSeries("total", "Total");

}); // end am4core.ready()
