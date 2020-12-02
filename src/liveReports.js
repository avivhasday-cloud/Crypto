

function liveReports(symbolsArray){
    let symbols = symbolsArray.join(",").toString();
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];
    var dataPoints5 = [];
    var dataP = [dataPoints1, dataPoints2, dataPoints3, dataPoints4, dataPoints5]

    
    
    var options = {
        title: {
            text: "Currency chart"
        },
        axisX: {
            title: "chart updates every 2 secs"
        },
        axisY: {
            suffix: "$"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: symbolsArray[0],
            dataPoints: dataPoints1
        },
        {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: symbolsArray[1],
            dataPoints: dataPoints2
        }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: symbolsArray[2],
            dataPoints: dataPoints3
        },{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: symbolsArray[3],
            dataPoints: dataPoints4
        },{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00$",
            showInLegend: true,
            name: symbolsArray[4],
            dataPoints: dataPoints5
        }]
    };
    
    var chart = $("#liveReportsContainer").CanvasJSChart(options);
    
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    
    var updateInterval = 2000;

    
    var time = new Date;
    time.setHours(00);
    time.setMinutes(00);
    time.setSeconds(00);
    time.setMilliseconds(00);
    
    function updateChart(count) {
        count = count || 1;
        console.log(count)
        $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`,
            type: 'GET',
            success: function (data) {
                let dataValue = Object.values(data);
                time.setTime(time.getTime() + updateInterval);
                for (let i=0; i<Object.keys(data).length; i++){
                    dataP[i].push({
                        x: time.getTime(),
                        y: dataValue[i].USD
                    });
                }
               
                
            },
            error: function () {
                console.log('Failure');
            }
        });
        for (let i=0; i<symbolsArray.length; i++){
            options.data[i].legendText = `${symbolsArray[i]}`;
        }
        $("#liveReportsContainer").CanvasJSChart().render();
    }
    // generates first set of dataPoints 
    updateChart(100);
    setInterval(function () { updateChart() }, updateInterval);
} 