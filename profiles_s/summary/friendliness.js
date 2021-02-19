am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end


    var chart = am4core.create('chartdiv_friendliness', am4charts.XYChart);
    chart.colors.step = 1;

    // chart.legend = new am4charts.Legend()
    // chart.legend.position = 'top'
    // chart.legend.paddingBottom = 20
    // chart.legend.labels.template.maxWidth = 95

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'category';
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;

    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.title.text = "Score";
    yAxis.title.fontWeight = "bold";


    function createSeries(value, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = value;
        series.dataFields.categoryX = 'category';
        series.name = name;

        // series.events.on("hidden", arrangeColumns);
        // series.events.on("shown", arrangeColumns);

        var bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = -10;
        bullet.label.text = '{valueY}';
        bullet.label.fill = am4core.color('#242424');

        return series;
    }

    chart.data = [
        {
            category: 'Karen Fortou',
            first: 4
        },
        {
            category: 'Mike Rafun',
            first: 2
        },
        {
            category: 'Jack Nymbul',
            first: 4.5
        }
    ];


    createSeries('first', 'U.S.A');
    //createSeries('second', 'Worldwide');


}); // end am4core.ready()