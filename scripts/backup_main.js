/**
 * Created by harshilkumar on 3/10/17.
 */



$(document).ready(function() {

    // Create Base64 Object
    //var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

    // Enable Chart button after 5 seconds to load all graph.
    setTimeout(enable_chart_btn, 5000);

    // Function to set and get the local storage object.
    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    }
    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);

        return value && JSON.parse(value);
    }


    function enable_chart_btn() {
        $('i.ichar').css('display','inline-block');
    }

    // Check if object is empty or not
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    mainfunction();
    function getPortfolioChart(portfolio_chart_array) {
        $('#portfolioChart').empty();
        var arry_for_chart = portfolio_chart_array

        // create data
        var data = arry_for_chart;

        // create a pie chart and set the data
        chart = anychart.pie(data);

        // set the inner radius
        // (to turn the pie chart into a doughnut chart)
        chart.innerRadius("40%");

        // set the position of labels
        chart.labels().position("outside");

        // configure connectors
        chart.connectorStroke({color: "#595959", thickness: 2, solid:"2 2"});

        // disable the legend
        chart.legend(true);

        // set the chart title
        chart.title("Your portfolio breakdown");

        // set the container id
        chart.container("portfolioChart");

        // initiate drawing the chart
        chart.draw();
    }
    function convertToServerTimeZone(){
        //EST
        offset = -5.0

        clientDate = new Date();
        utc = clientDate.getTime() + (clientDate.getTimezoneOffset()*60000);

        serverDate = new Date(utc + (3600000*offset));
        var time = serverDate.getHours() < 10 ? "0" + serverDate.getHours() : serverDate.getHours();

        console.log(time);
        console.log(serverDate.toLocaleString());
        if(time > 3 && time < 21)
        {
            console.log("Calling from timezone function");
            mainfunction();
        }
    }
    function mainfunction()
    {
        var timer_counter;
        var initiallCall = 1;

        fetchApi_Object();
        function fetchApi_Object() {
            //var getStockInitialData = fetchLocalStorage(); // Work done for new functionality
            var getStockInitialData = checklocal_storage();
            // Get the stockval strings for api call.
            var getApicallData = getStockVals(getStockInitialData);

            //$(".table_data_row").remove();
            callAPI(getApicallData, getStockInitialData);
            calling_timer(getApicallData, getStockInitialData)
        }

        function stopTimer() {
            console.log("Inside stop timer");
            clearInterval(timer_counter);
        }

        function calling_timer(ApicallData, StockInitialData) {
            var tempCOunt = 0;
            timer_counter = setInterval(function () {
                /// call your function here
                //tempCOunt++
                console.log("logiging mili seconds" + tempCOunt);
                //$(".table_data_row").remove();
                //callAPI(ApicallData, StockInitialData);


            }, 60000);
        }

        // /convertToServerTimeZone();
        $('.stc_name_txt').bind('keyup', function (e) {
            if (e.which >= 97 && e.which <= 122) {
                var newKey = e.which - 32;
                // I have tried setting those
                e.keyCode = newKey;
                e.charCode = newKey;
            }

            $('.stc_name_txt').val(($('.stc_name_txt').val()).toUpperCase());
        });

        $('div.left_part').find('input').each(function () {
            $(this).blur(function () {
                loop_through_field($(this));
            });
        });
        var resultFlag;

        function loop_through_field($inputField) {

            var dataAttr = $inputField.data("intype");
            console.log($inputField);
            if (dataAttr == 'text') {
                var regex_alphabet = /^([A-Za-z])*$/;
                if ($inputField.val().match(regex_alphabet) && $inputField.val().length > 0) {
                    console.log("look good");
                    resultFlag = true;
                    $inputField.removeClass("errborderclass");
                    $inputField.parent().siblings(".icon-tip").removeClass("tip_display");

                }
                else {
                    console.log("look not good");
                    $inputField.addClass("errborderclass");
                    $inputField.parent().siblings(".icon-tip").addClass("tip_display");
                    resultFlag = false;
                }
                return resultFlag;
            }
            else if (dataAttr == 'num') {
                var regex_num = /^-?\d+(?:\.\d+)?$/;
                if ($inputField.val().match(regex_num)) {
                    resultFlag = true;
                    console.log("look good");
                    $inputField.removeClass("errborderclass");
                    $inputField.parent().siblings(".icon-tip").removeClass("tip_display");
                }
                else {
                    console.log("look not good");
                    $inputField.addClass("errborderclass");
                    $inputField.parent().siblings(".icon-tip").addClass("tip_display");
                    resultFlag = false;
                }
                return resultFlag;
            }
        }

        function validateEachInput() {
            var trueFlag;
            $('div.left_part').find('input').each(function () {

                var getValidFlag = loop_through_field($(this));
                if (getValidFlag) {
                    trueFlag = true;
                }
            });
            return trueFlag;
        }

        $(document).on("click", "i.editstc", function () {
            var textval = $(this).parent().prev().find('.stc_name_style').text();
            $("#dialog").dialog("open");
            dimOn();
            var stock_local_store = localStorage.getObject("stockObject");
            console.log(stock_local_store);
            // Check first if localstorage is available
            if (typeof stock_local_store != 'undefined' && stock_local_store) {
                //deal with value'
                $.each(stock_local_store, function (skey, sval) {
                    if (skey == textval) {
                        console.log(skey);
                        $('.stc_name_txt').val(skey);
                        $('.stc_price_txt').val(sval["BuyPrice"]);
                        $('.stc_qty_txt').val(sval["Quantity"]);

                        $('.stc_pos').val(sval["upWatch"]);
                        $('.stc_neg').val(sval["downWatch"]);
                        $('.stc_name_txt').attr('readonly', true);
                    }
                });

            }
            else {
                console.log("Local storage is empty");
            }
        });
        $(document).on("click", "#getStockVal", function () {
            stopTimer();
            console.log("Button click");
            var getValidFlag = validateEachInput();
            if (getValidFlag) {
                // First get the existing local storage
                var stock_storage = localStorage.getObject("stockObject123");

                // Check first if localstorage is available
                if (typeof stock_storage != 'undefined' && stock_storage) {
                    //deal with value'
                    stocktable = stock_storage;
                }
                else {
                    var stocktable = {};
                }
                var stockAryFlag = false;
                var sName = $('.stc_name_txt').val();
                var sPrice = $('.stc_price_txt').val();
                var sQty = $('.stc_qty_txt').val();

                var sPos = $('.stc_pos').val();
                var sNeg = $('.stc_neg').val();

                if (sName && sPrice && sQty) {
                    var StcName = $('.stc_name_txt').val();

                    stocktable[StcName] = {};
                    stocktable[StcName]["BuyPrice"] = sPrice;
                    stocktable[StcName]["Quantity"] = sQty;
                    var Total_Invet = sQty * sPrice;
                    stocktable[StcName]["TotalInvest"] = Total_Invet.toFixed(2);
                    stockAryFlag = true;

                }
                if (sPos) {
                    stocktable[StcName]["upWatch"] = $('.stc_pos').val();
                }
                else {
                    stocktable[StcName]["upWatch"] = "0";
                }
                if (sNeg) {
                    stocktable[StcName]["downWatch"] = $('.stc_neg').val();
                }
                else {
                    stocktable[StcName]["downWatch"] = $('.stc_neg').val();
                }
                if (stockAryFlag) {

                    //localStorage.setObject("stockObject123", "");
                    // set new updated object in local storage as well as in json file.
                    storeStocks(stocktable);
                    var resetCount = 0;
                    //reset the api object again
                    fetchApi_Object();
                    $('div.left_part').find('input').each(function () {
                        $(this).val("");
                    });
                    $('#dialog').dialog("close");
                    dimOff();
                    $('.stc_name_txt').attr('readonly', false);

                }
            }


        });

        function storeStocks(newStockData) {
            var _lckey_newData = localStorage.getObject("userUniqKey123");
            storeFirstTimedata(newStockData, _lckey_newData);
        }

        function storeFirstTimedata(stock_data, unqKey){
            //var unqKey = localStorage.getObject("userUniqKey123");
            var keyFlag = checkUnqKey(unqKey);
            //var encodedUsrKey = Base64.encode(_userKey);

            var encodedUsrKey = unqKey;
            // Key is valid or not
            if(keyFlag)
            {
                alert("Key is already present in JSON file.");
                //encodedUsrKey = "perso"; // For testing purpose this is static
                appendstockData(stock_data);
                console.log(stock_data);
                //firstTimeUsrData(stock_data, encodedUsrKey);
            }
            else
            {
                // Ask user to provide the unique key.
                // encodedUsrKey = "perso"; // Testing purpose.
                firstTimeUsrData(stock_data, encodedUsrKey);
            }
        }
        // Store the JSON data of user with unique key.
        function firstTimeUsrData(usrDatatable, _userKey) {

            var encodedUsrKey = _userKey;
            var data = {"usrKey" : encodedUsrKey, "usrStcData" : usrDatatable}
            data = JSON.stringify(data);

            //console.log(data);
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/UpdateusrConfig',
                data: data,
                dataType: "json",
                crossDomain: true,
                success: function (data) {
                    console.log("successfully data stored in json file");
                    //console.log(data);
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error");
                    //callbackfn("Error getting the data")
                }
            });
        }

        // Call the function for append to exiting data.
        //appendstockData(_appendData);
        function appendstockData(_appndStcData){

            var _stcName;
            var _stockData = {};
            $.each(_appndStcData, function (keyNAme, value) {
                _stcName = keyNAme;
                _stockData = value;
            });
            var unqKey = localStorage.getObject("userUniqKey123");
            var keyFlag = checkUnqKey(unqKey);

            // Key is valid or not
            if(keyFlag)
            {
                var encodedUsrKey = unqKey;
                //encodedUsrKey = "Rochir";
                var data = {"usrKey" : encodedUsrKey, "usrStcData" : _stockData, "stcName" : _stcName};
                data = JSON.stringify(data);
                console.log(data);
                $.ajax({
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    url: 'http://localhost:3000/appendusrConfig',
                    data: data,
                    dataType: "json",
                    crossDomain: true,
                    complete: function() {
                        //called when complete
                        console.log('append user process complete');
                        //checkInJson(unqKey);
                    },
                    success: function (data) {
                        console.log("successfully data stored in json file");

                        //console.log(data);
                    },
                    error: function (textStatus, errorThrown) {
                        console.log("Error");
                    }
                });
            }
            else
            {
                // User key is not matching or not present in local storage so need to check on json file.;
                alert("Key is already present in JSON file.");
            }
        }
        /*------------------------------------------------------------
        // Set jsondata in json file for that user. (Old function)
        function setJsondata(stocktable) {
            var data = JSON.stringify(stocktable);
            //console.log(data);
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/UpdateJson',
                data: data,
                dataType: "json",
                crossDomain: true,
                success: function (data) {
                    console.log("successfully data stored in json file");
                    //console.log(data);
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error");
                    //callbackfn("Error getting the data")
                }
            });
        }
        */
        /****************** New Code ***********************************/

        function checklocal_storage() {
            var _lc_stockdata = {};
            var userKeyLc = localStorage.getObject("userUniqKey123");
            // After getting LC userkey data check if it is empty or not.
            var keyFlag = checkUnqKey(userKeyLc);

            var stockDataFlag = chkStockData();
            //  Key  and stockdata is present and/or valid or Not
            if(keyFlag && stockDataFlag)
            {
                console.log("Everything looks good");
                _lc_stockdata = localStorage.getObject("stockObject123");
                return _lc_stockdata;
            }
            else
            {

                // Load the pop up to ask user to provide the unique key to get the JSON data
                // User provided Key
                var _keyName = "Harshil"; // Get the data from user. If it is deleted.
                _lc_stockdata = checkInJson(_keyName);
                return _lc_stockdata;
            }
        }

        function chkStockData()
        {
            var stcObj = localStorage.getObject("stockObject123");
            if(typeof stcObj != 'undefined' && stcObj )
            {
                return true;
            }
            else {
                return false;
            }
        }
        // Function to valid the user unique key.
        function checkUnqKey(uerKey) {

            if(typeof uerKey != 'undefined' && uerKey )
            {
                return true;
            }
            else {
                return false;
            }
        }
        // Server call to check the user unique key is there or not?
        function checkInJson(_keyName) {

            var string = _keyName;

            // Encode the String
            // var encodedString = Base64.encode(string); // Temp commenting because it is not working.

            var encodedString = string;

            console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"
            //console.log(data);
            $.ajax({
                type: "GET",
                dataType: "json",
                data: '',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/getUsrKey/'+encodedString,
                complete: function() {
                    //called when complete
                    console.log('process complete');
                },
                success: function(res) {

                    if (isEmpty(res)) {
                        // Object is empty (Would return true in this example)
                        alert("There is an issue with the user key. Please check your email. for the key");
                    }
                    else {
                        // Result is getting the user data.
                        console.log(res);
                        console.log('process sucess');
                        if (isEmpty(res)) {
                            // Object is empty (Would return true in this example)
                            console.log("No Stock data found from localstorage.");
                        }
                        else {

                            // Remove the existing local storage.
                            localStorage.setObject("stockObject123", "");
                            localStorage.setObject("userUniqKey123", "");

                            // Data set in local storage.
                            localStorage.setObject("stockObject123", res);
                            localStorage.setObject("userUniqKey123", _keyName);
                            fetchApi_Object();

                        }

                    }
                },
                error: function() {
                    console.log('process error');
                },
            });
        }
        /****************** Code End *********************************/

        // ---------------------------Old Combination ----------------------------------
        /*
        // function to get data from local storage
        function fetchLocalStorage() {
            var tempvar = localStorage.getItem("stockObject");
            var finalResult = JSON.parse(tempvar);
            console.log("Inside fetchlocal storage new function");
            if (isEmpty(finalResult)) {
                // Object is empty (Would return true in this example)
                //console.log("No Stock data found from localstorage.");
                console.log(getJsonObject_new);
                var getJsonObject = fetchJsondata();
                return getJsonObject;
            }
            else {
                // Object is NOT empty
                //var getJsonObject_localstorage = getStockVals(finalResult);
                return finalResult;
            }
        }

        // Get data from json file.
        function fetchJsondata() {

            console.log("Inside fetch jsondata function");
            var fetchData;
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/getJson',
                dataType: "json",
                data: '',
                crossDomain: true,
                success: function (data) {
                    console.log(data);
                    if (isEmpty(data)) {
                        // Object is empty (Would return true in this example)
                        console.log("No Stock data found from localstorage.");


                    } else {
                        // Object is NOT empty
                        //getStockVals(data);
                        localStorage.setObject("stockObject", data);
                        fetchApi_Object();
                        return data;
                    }

                },
                error: function (textStatus, errorThrown) {
                    console.log("Error");
                }
            });

        }
        */
        //--------------------------------------------------- Code End ------------------------------------
        // Get the tickers for api
        function getStockVals(StockDetailsArray) {
            //
            var tickers = "";
            var stckName;
            for (var key in StockDetailsArray) {
                stckName = key;
                tickers = tickers + stckName + ",";
            }
            tickers = tickers.substring(0, tickers.length - 1);
            return tickers;
            // convertToServerTimeZone(tickers, StockDetailsArray);
            console.log(tickers);
        }

        // Each 1 minute call api
        var prvsCurrent;
        var prvsdownprice;
        var notifycounter = 0;

        function callAPI(apiStringVal, stocksObjectVal) {
            console.log("====== API Call ==========");
            console.log(apiStringVal);
            $(".eachstock").empty();
            if (apiStringVal) {
                $(".table_data_row").remove();

                var testurl = 'http://finance.google.com/finance/info?client=ig&q=nasdaq:' + apiStringVal + '';
                $.ajax({
                    //url: 'http://finance.google.com/finance/info?client=ig&q=nasdaq:MSFT',
                    url: testurl,
                    data: {
                        format: 'json'
                    },
                    error: function () {
                        console.log("Error while getting data");
                    },
                    dataType: 'jsonp',
                    success: function (data) {
                        var portfolio_chart_arry = [];
                        $(".table_data_row").remove();
                        if (notifycounter == 0) {
                            var generalStr = 'Hey this is headsup from notification';
                            var stockIconImage = "images/_uparrow.png";
                            notifyMe(generalStr, stockIconImage);
                        }
                        $.each(data, function (index, value) {
                            var last_change_percentage = 0;
                            var last_change = 0;

                            var priceDifference;
                            var stock_name = value["t"]; // Stock NAme
                            var last_price = value["l"]; // Last Price
                            last_change = value["c"]; // Change since last price
                            last_change_percentage = value["cp"]; // Change percentage



                            var last_change_percentage_u = value["cp_fix"]; // Change percentage

                            var dayhigh = value["_hi"];
                            var daylow = value["_lo"];

                            var comparePrice;
                            var compareQty;
                            var compareInvetment;

                            var currentPrice = 0;
                            var currentInvestmentValue = 0;

                            var stockup;
                            var stockdown;

                            var current_portfolio_status;
                            // calling the localstock data for comparison
                            $.each(stocksObjectVal, function (sindex, svalue) {
                                if (sindex == stock_name) {
                                    //console.log("Found");
                                    comparePrice = svalue["BuyPrice"];
                                    compareQty = svalue["Quantity"];
                                    compareInvetment = svalue["TotalInvest"];

                                    stockup = svalue["upWatch"];
                                    var upprice = stockup;
                                    console.log("stockup Proce:" +stockup);
                                    stockdown = svalue["downWatch"];
                                    var downprice = "-"+stockdown;
                                    //console.log("StockName: " + stock_name + " stockup check: " + stockup + " stockdown check: " + stockdown);
                                    currentPrice = last_price - comparePrice;
                                    var current_diff = currentPrice.toFixed(2);
                                    currentPrice = currentPrice.toFixed(2);

                                    currentInvestmentValue = last_price * compareQty;
                                    currentInvestmentValue = currentInvestmentValue.toFixed(2);

                                    var initialinvestment = comparePrice * compareQty;
                                    initialinvestment = initialinvestment.toFixed(2);

                                    current_portfolio_status =  currentInvestmentValue - initialinvestment;
                                    current_portfolio_status = current_portfolio_status.toFixed(2);



                                    // pass the value to draw portfolio chart function.
                                    portfolio_chart_arry.push({
                                        x:   stock_name,
                                        value: currentInvestmentValue
                                    });

                                    if (notifycounter == 0) {
                                        prvsCurrent = stockup;
                                        prvsdownprice = stockdown;
                                        /*
                                        console.log("Up Stock NAme: " + stock_name + " Previous price:" + prvsCurrent + " Current price: " + currentPrice);
                                        console.log("Down Stock NAme: " + stock_name + " Previous price:" + prvsdownprice + " Current price: " + currentPrice);
                                        console.log("----------------------------------------------------------------------------------------------");
                                        */
                                    }
                                    else {
                                        if (stockup > 0) {
                                            console.log("Up Stock NAme: " + stock_name + " Previous price:" + prvsCurrent + " Current price: " + currentPrice);
                                            console.log("Stock Up function: " + currentPrice);
                                            if (currentPrice > 0) {
                                                if (currentPrice >= stockup) {

                                                    currentPrice = formatNum(currentPrice);
                                                    if (prvsCurrent > currentPrice || prvsCurrent < currentPrice) {
                                                        prvsCurrent = currentPrice;
                                                        prvsCurrent = formatNum(prvsCurrent);
                                                        console.log("Up Stock NAme: " + stock_name + " Previous price:" + prvsCurrent + " Current price: " + currentPrice);
                                                        var upStr = 'Hey ' + stock_name + ' is up by ' + currentPrice + ' compare to purchase price';
                                                        var stockIconImage = "images/_uparrow.png";
                                                        notifyMe(upStr, stockIconImage);
                                                    }

                                                }
                                            }
                                        }
                                        if (stockdown > 0) {
                                            console.log("Up Stock NAme: " + stock_name + " Previous price:" + prvsCurrent + " Current price: " + currentPrice);
                                            if (currentPrice < 0) {
                                                stockdown = "-" + stockdown;

                                                if (currentPrice >= stockdown) {
                                                    currentPrice = formatNum(currentPrice);
                                                    if (prvsdownprice > currentPrice || prvsdownprice < currentPrice) {
                                                        prvsdownprice = currentPrice;
                                                        prvsdownprice = formatNum(prvsdownprice);
                                                        console.log("Down Stock NAme: " + stock_name + " Previous price:" + prvsCurrent + " Current price: " + currentPrice);
                                                        var downStr = 'Hey ' + stock_name + ' is down by ' + currentPrice + ' compare to purchase price';
                                                        var stockIconImage = "images/_downarrow.png";
                                                        notifyMe(downStr, stockIconImage);
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    $('#stockTab tr:last').after(
                                        '<tr class="table_data_row" ><td>' + stock_name + '</td><td>' + compareQty + '</td>' +
                                        '<td>' + compareInvetment + '</td><td>' + comparePrice + '</td><td>' + last_price + '</td>' +
                                        '<td>' + current_diff + '</td><td>' + last_change + '</td><td>' + upprice + '</td>' +
                                        '<td>' + downprice + '</td><td>' + currentInvestmentValue + '</td></tr>');


                                    var htmlblock = '<div class="perstock" id="'+stock_name+'"><div class="first_row"><div class="stc_name">' +
                                        '<span class="stc_name_style">' + stock_name + '</span>' +
                                        '<span class="curnt_prce"> : ' + last_price + '</span><span class="stc_cp">' +
                                        '<span>(</span><span class="cp_val">'+last_change_percentage+'</span>' +
                                        '<span class="sign_vals">%, '+last_change+'$</span>'+
                                        '<i class="fa fa-arrow-up" id="upar" aria-hidden="true"></i>' +
                                        '<i class="fa fa-arrow-down" id="downar" aria-hidden="true"></i><span>)</span></span><' +
                                        '/div><div class="expand_cls"><i class="fa fa-pencil-square-o editstc" aria-hidden="true"></i>' +
                                        '<i class="fa fa-line-chart ichar" aria-hidden="true" style="display: none;"></i></div>' +
                                        '</div>' +
                                        '<div class="row2style"><div class="row2heading"> Investment Bid</div>' +
                                        '<div><table style="width:100%" id="stockTab"><tbody>' +
                                        '<tr class="table_heading"> <th>Bid price</th>'+
                                        '<th>Qty</th> <th>Total($)</th>'+
                                        '</tr><tr class="table_data_row"><td>' + comparePrice + '$</td>' +
                                        '<td>' + compareQty + '</td><td>' + compareInvetment + '</td>' +
                                        '</tr> </tbody></table></div>' +
                                        '</div>' +
                                        '<div class="row3style"><div class="row3heading">Current Bid <span class="st_breakdown">(' +
                                        '<span class="total_portfolio_val"> Portfolio : </span><span class="st_amount">' + current_portfolio_status + '$</span>)</span></div>' +
                                        '<div><table style="width:100%" id="stockTab"><tbody>' +
                                        '<tr class="table_heading"> <th>Bid Price</th>'+
                                        '<th>Buy variation</th> <th>Total($)</th>'+
                                        '</tr><tr class="table_data_row"><td>' + last_price + '$</td>' +
                                        '<td>' + currentPrice + '$</td><td>' + currentInvestmentValue + '</td>' +
                                        '</tr> </tbody></table></div>' +
                                        '</div>'+
                                        '</div>';


                                    $(".eachstock").append(htmlblock);


                                }
                            });

                            //console.log("**********************************************************************************************")
                            // console.log("Stock Name "+stock_name +" : Stock Last Price "+last_price + " : Change since last price $"+last_change+" : Change in percentage "+last_change_percentage+"% : Unknown percentage "+last_change_percentage_u+"%");

                            //console.log(last_change_percentage);
                        });
                        notifycounter++;
                        enable_chart_btn();
                        getPortfolioChart(portfolio_chart_arry);

                        $(".eachstock").find(".perstock").each(function (){
                            var stc_last_price = $(this).find("span.cp_val").text();
                            if(stc_last_price > 0.0)
                            {
                                $(this).find("i#downar").css('display','none');
                                $(this).find("span.cp_val").css('color','green');
                                $(this).find("span.sign_vals").css('color','green');
                                $(this).addClass("positive_stocks");
                                $(this).removeClass("negative_stocks");
                            }
                            else
                            {
                                $(this).find("i#upar").css('display','none');
                                $(this).find("span.cp_val").css('color','red');
                                $(this).find("span.sign_vals").css('color','red');
                                $(this).addClass("negative_stocks");
                                $(this).removeClass("positive_stocks");
                            }
                            //console.log(stc_last_price);
                        });

                    },
                    type: 'GET'
                });
            }


        }

        function formatNum(value) {
            return value | 0;
        }

        function notifyMe(stockPriceVal, stockicon) {
            var notify_html = "'<ol><li>html data</li></ol>';"
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }
            else if (Notification.permission === "granted") {
                var options = {
                    body: stockPriceVal,
                    icon: stockicon,
                    dir: "ltr"
                };
                var notification = new Notification("Stock Updates", options);
            }
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    if (permission === "granted") {
                        var options = {
                            body: stockPriceVal,
                            icon: stockicon,
                            dir: "ltr"
                        };
                        var notification = new Notification("Stock Updates", options);
                    }
                });
            }
        }

        /******Open Modal window on icon click ******************/

        /******Open Modal window ******************/
        $("#open").click(function () {
            stopTimer();
            $("#dialog").dialog("open");
            dimOn();
        });

        $("#dialog").dialog({autoOpen: false, modal: true});

        $("body").on("click", ".ui-widget-overlay", function () {
            $('#dialog').dialog("close");
            dimOff();
            $('div.left_part').find('input').each(function () {
                $(this).val("");
            });
            $('.stc_name_txt').attr('readonly', false);
        });
        $("body").on("click", ".ui-button", function () {
            $('#dialog').dialog("close");
            dimOff();
            $('div.left_part').find('input').each(function () {
                $(this).val("");
            });
            $('.stc_name_txt').attr('readonly', false);
        });
        $("body").on("click", "#closedialog", function () {
            $('#dialog').dialog("close");
            dimOff();
            $('div.left_part').find('input').each(function () {
                $(this).val("");
            });
            $('.stc_name_txt').attr('readonly', false);
        });

        function dimOff() {
            $('.overlay').css('display','none');
        }
        function dimOn() {
            $('.overlay').css('display','block');
        }
        //ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close
        /*---------------------------------------------*/
        // This is working
        $('#testing').click(function (e) {
            e.preventDefault();
            console.log("Hi button click");
            $.ajax({
                type: 'GET',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/getJson',
                dataType: "json",
                data: '',
                crossDomain: true,
                success: function (data) {
                    console.log("success");
                    console.log(data);
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error");
                    //callbackfn("Error getting the data")
                }
            });
        });
        $('#testing2').click(function (e) {
            e.preventDefault();
            var dataObject = {};
            dataObject['newWeekEntry'] = "newEntry";
            dataObject['oldWeekEntry'] = "oldEntry";
            var data = JSON.stringify(dataObject);
            console.log(data);
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: 'http://localhost:3000/UpdateJson',
                data: data,
                dataType: "json",
                crossDomain: true,
                success: function (data) {
                    console.log("success");
                    console.log(data);
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error");
                    //callbackfn("Error getting the data")
                }
            });
        });

    }

});