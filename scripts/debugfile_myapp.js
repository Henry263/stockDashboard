/**
 * Created by harshilkumar on 3/27/17.
 */
$(document).ready(function() {
    // Function to set and get the local storage object.
    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    }
    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);

        return value && JSON.parse(value);
    }

    getUserKey();
    // Get the unique userkey on pgae load from local storage.
    function getUserKey() {
        var userKeyLc = localStorage.getObject("userUniqKey123");
        // After getting LC userkey data check if it is empty or not.
        var keyFlag = checkUnqKey(userKeyLc);

        var stockDataFlag = chkStockData();
        //  Key  and stockdata is present and/or valid or Not
        if(keyFlag && stockDataFlag)
        {
            console.log("Everything looks good");
        }
        else
        {
            // Remove the existing local storage.
            localStorage.setObject("stockObject123", "");
            localStorage.setObject("userUniqKey123", "");

            // Load the pop up to ask user to provide the unique key to get the JSON data
            // User provided Key
            var _keyName = "Harshil"; // Get the data from user. If it is deleted.
            checkInJson(_keyName);
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

    // Check if object is empty or not
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    // Server call to check the user unique key is there or not?
    function checkInJson(_keyName) {

        var string = _keyName;

        // Encode the String
        // var encodedString = Base64.encode(string); // Temp commenting because it is not working.

        //var encodedString = string;
        var encodedString = "Rochir"
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

                        // Data set in local storage.
                        localStorage.setObject("stockObject123", res);
                        localStorage.setObject("userUniqKey123", _keyName);

                    }

                }
            },
            error: function() {
                console.log('process error');
            },
        });
    }

    /*
    // This is for
    var _testData =  {

            "WISC":{
                "BuyPrice":"239",
                "Quantity":"5",
                "TotalInvest":"5",
                "upWatch":"4",
                "downWatch":"100"
            },
        "OASR":{
            "BuyPrice":"2319",
            "Quantity":"5",
            "TotalInvest":"5",
            "upWatch":"4",
            "downWatch":"100"
        }


    };
    */
    var _usrKey = "";
    // Call this function to store the data. Pass the stockdata and unique key.
    //storeFirstTimedata(_testData, _usrKey);

    function storeFirstTimedata(stock_data, unqKey){
        var unqKey = localStorage.getObject("userUniqKey123");
        var keyFlag = checkUnqKey(unqKey);
        //var encodedUsrKey = Base64.encode(_userKey);

        var encodedUsrKey = unqKey;
        // Key is valid or not
        if(keyFlag)
        {
            alert("Key is already present in JSON file.");
            //encodedUsrKey = "perso"; // For testing purpose this is static

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

    /*
    // This is for
    var _appendData =  {

            "KBC": {
                "BuyPrice": "90",
                "Quantity": "5",
                "TotalInvest": "5",
                "upWatch": "4",
                "downWatch": "100"
            }

    };
    */

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
            encodedUsrKey = "Rochir";
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
});