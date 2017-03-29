/**
 * Created by harshilkumar on 3/16/17.
 */

$("document").ready(function () {

    $("div.each_chart_holder").load(function(){
        console.log("loaded");
        enable_chart_btn();
    });
    setTimeout( function(){
        enable_chart_btn
    }  , 30000 );
    //Calling function
    var copyLocalStockArray = [];
    var cahrtObject = {};

    var arryCounter = 0;
    var chartArray = [];

    var current_d = 0;
    var year_before_d = 0;

    //var get_stock_lc = {};
    function getlc_forchart()
    {
        var get_stock_lc = localStorage.getItem("stockObject123");
        if(isEmpty(get_stock_lc))
        {

            //setTimeout(getlc_forchart, 50000);
            setTimeout(function(){
                console.log("inside timeout and localstorage not found");
                getlc_forchart();
            },5000);
        }
        else
        {
            console.log("local storage is there.");
            checkdateTime();
        }
    }
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    function enable_chart_btn() {
        console.log("Enabling the chart button.");
        $('i.ichar').removeAttr("style");
        $('i.ichar').addClass("enable_show_chart_btn");
    }
    getlc_forchart();

    function checkdateTime()
    {

        var now_d = new Date();

        var curr_day = now_d.getDate();
        var curr_month = now_d.getMonth();
        curr_month = curr_month + 1;
        var curr_year = now_d.getFullYear();

        var year_before = curr_year - 1;

        if(curr_month < 10)
        {
            curr_month = "0"+curr_month;
        }
        current_d = curr_year+'-'+curr_month+'-'+curr_day;
        year_before_d = year_before+'-'+curr_month+'-'+curr_day;


        offset = -5.0

        clientDate = new Date();
        utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

        serverDate = new Date(utc + (3600000*offset));
        var hours = serverDate.getHours();

        console.log(hours);
        if(hours > 7)
        {
            getLocalStorage();
        }
        else
        {
            getLocalStorage();
        }

    }

    function getLocalStorage(){
        var _get_stock_lc = localStorage.getItem("stockObject123");
        var stc_json_lc = JSON.parse(_get_stock_lc);
        //console.log(stc_json_lc);
        var localStoreArray = [];
        $.each(stc_json_lc, function (key, val) {

            localStoreArray.push(key);

        });
        copyLocalStockArray = localStoreArray;
        gethistoricData();


    }



    function gethistoricData() {
        //console.log("Inside get json function"+st_symbol);
        var default_counter = arryCounter;
        var loop_init_val = copyLocalStockArray[default_counter];

        var historicDataurl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+copyLocalStockArray[arryCounter]+'%22%20and%20startDate%20%3D%20%22'+year_before_d+'%22%20and%20endDate%20%3D%20%22'+current_d+'%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        //var historicDataurl = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = '+copyLocalStockArray[arryCounter]+' and startDate = '+year_before_d+' and endDate = '+current_d+'&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=';
        $.ajax({
            url: historicDataurl,
            data: {
                format: 'json'
            },
            error: function () {
                console.log("Error while getting data");
            },
            //dataType: 'jsonp',
            success: function (data) {
                arryCounter++;
                if(arryCounter <= copyLocalStockArray.length) {


                    for (var i = 0; i < data.query.results.quote.length; i++) {

                        var arrid = " ";
                        var strDate = 0;
                        //arrid = generateid();
                        arrid = [];

                        cahrtObject = {};
                        var strDate = data.query.results.quote[i]["Date"];
                        arrid.push(strDate);

                        arrid.push(data.query.results.quote[i]["High"]);
                        arrid.push(data.query.results.quote[i]["Low"]);
                        arrid.push(data.query.results.quote[i]["Open"]);
                        arrid.push(data.query.results.quote[i]["Close"]);

                        //console.log(arrid);
                        chartArray.push(arrid);
                    }

                    cahrtObject[loop_init_val] = chartArray;
                    console.log(cahrtObject);
                    detailChart(chartArray, loop_init_val);

                }
                else
                {
                    console.log("loop finish");
                    enable_chart_btn();
                    //$('i.ichar').css('display','inline-block');
                }

            },type: 'GET'
        });

    }

    function generateid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 3; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    /*----------------------
     This is chart dialog
     *---------------------------*/
    $('#open_chart').click(function() {

    });
    $(document).on("click", "i.ichar", function () {
        var icon_chart_symbol = $(this).parents('div.first_row').find(".stc_name_style").text();
        var div_symbol_id = "chart_dialog_"+icon_chart_symbol;
        $("[id^='chart_dialog']").each(function () {
            var compare_id = $(this).attr('id');
            if(div_symbol_id != compare_id)
            {
                $(this).slideUp();
            }
            else
            {
                $(this).slideDown();
            }
        });
        $('.eachstock').css('display','none');
    });
    $(document).on("click", "i.close_btn", function () {
        //$(this).parent().next().toggle("slide");
        //$('i.ichar').css('display','inline-block');
        var compare_icon_id = $(this).parent().next().attr('id');
        var div_icon_id = $(this).parent().parent();
        compare_icon_id = compare_icon_id.substring(0, compare_icon_id.indexOf('_'));
        compare_icon_id = "chart_dialog_"+compare_icon_id;
        var divIdSymbol = div_icon_id.attr('id');
        $("[id^='chart_dialog']").each(function () {

            if(divIdSymbol == compare_icon_id)
            {
                div_icon_id.slideUp();
            }
        });
        $('.eachstock').css('display','block');
        //$('#chart_dialog').toggle("slide");
    });
    function dimOff() {
        document.getElementById("darkLayer").style.display = "none";
    }

    function dimOn() {
        document.getElementById("darkLayer").style.display = "";
    }
    function detailChart(stcArry, get_symbol) {

            anychart.onDocumentReady(function() {
                // set container id for the chart
                    $('div.eachstock').find('.perstock').each(function () {
                    var div_symbol_id = $(this).attr('id');
                    if (get_symbol == div_symbol_id) {
                        var uniquesymbol = get_symbol + "_chart";
                        var chart_id_symbol = "chart_dialog_" + get_symbol;
                        //console.log("Inside draw chart function"+uniquesymbol);
                        var char_container = '<div class="each_chart_holder" id="' + chart_id_symbol + '" style="display: none;"> ' +
                            '<div class="close_btn_chart">' +
                            '<i class="fa fa-times close_btn" aria-hidden="true"></i></div> ' +
                            ' <div id="' + uniquesymbol + '" class="chart_contaner"></div> ' +
                            ' </div> ';

                        //console.log("Inside draw chart function"+char_container);

                        var stc_arry = stcArry;
                        // create data table on loaded data
                        var dataTable = anychart.data.table();
                        dataTable.addData(stc_arry);

                        // map loaded data
                        var line_1_mapping = dataTable.mapAs({'value': 3});
                        var line_2_mapping = dataTable.mapAs({'value': 2});
                        var line_3_mapping = dataTable.mapAs({'value': 4});
                        var line_4_mapping = dataTable.mapAs({'value': 1});

                        // create stock chart
                        chart = anychart.stock();

                        // create first plot on the chart with column series
                        var firstPlot = chart.plot(0);
                        var series_1 = firstPlot.line(line_1_mapping);
                        var series_2 = firstPlot.line(line_2_mapping);
                        var series_3 = firstPlot.line(line_3_mapping);
                        var series_4 = firstPlot.line(line_4_mapping);

                        series_1.stroke("#558B2F");
                        series_2.stroke("#D84315");
                        series_3.stroke("#FF8F00");
                        series_4.stroke("blue");

                        series_1.name("High");
                        series_2.name("Low");
                        series_3.name("Close");
                        series_4.name("Open");

                        var legend = firstPlot.legend();
                        // enables legend
                        legend.enabled(true);

                        // turn the title on and set the position
                        legend.title(true);
                        legend.title().orientation('top').align('left');
                        //legend.align('center');

                        // format the title
                        legend.titleFormatter(function () {
                            return get_symbol;
                        });

                        //enable the titleSeparator
                        legend.titleSeparator(true);
                        // set legend position and items layout
                        firstPlot.legend().itemsLayout('horizontal');
                        firstPlot.legend().position('top');

                        // setting the space between the items
                        legend.itemsSpacing(10);

                        // enable the scroller
                        chart.scroller().enabled(true);

                        // adjust the scroller
                        //chart.selectRange('2014-01-02','2014-02-03');

                        // set container id for the chart
                        $(char_container).insertAfter($('div.eachstock'));
                        chart.container(uniquesymbol);

                        // adjust the scroller axis
                        var labels = chart.scroller().xAxis().labels();
                        var minorLabels = chart.scroller().xAxis().minorLabels();
                        // create scroller series with mapped data
                        chart.scroller().column(line_3_mapping);

                        // initiate chart drawing
                        chart.draw();

                    }

                });
                chartArray.length = 0;
                gethistoricData();
            });

    }
    //gethistoricData();
});
