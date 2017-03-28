/**
 * Created by harshilkumar on 3/10/17.
 */
var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();
//var app = express.createServer();
app.use(bodyParser.json());

app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, **Authorization**');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.header('Content-Security-Policy', 'default-src "self";script-src "self";object-src "none";img-src "self";media-src "self";frame-src "none";font-src "self" data:;connect-src "self";style-src "self"');
    next();
});

// Create Base64 Object
//var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// Test API
/*
app.get('/getJson', function (req, res) {
    fs.readFile('../json/stock.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log("THis is error")
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            //console.log(obj);
            res.send(obj);

        }});
});

// Api for new entry to JSON file.
app.post('/UpdateJson', function(req, res) {

    var newText = req.body;
    //console.log(newText);
    res.send(newText);

    // read in the JSON file
    fs.readFile('../json/stock.json', function(err, obj) {
        // Using another variable to prevent confusion.
        var fileObj = ' ';

        // Write the modified obj to the file
        fs.writeFile('../json/stock.json', fileObj, function(err) {
            if (err) throw err;
        });
        var jsonData = JSON.stringify(newText);
        //console.log(jsonData);
        fs.writeFile('../json/stock.json', jsonData, function(err) {
            if (err) throw err;
        });
    });

});
*/
// This is called when user is trying to append the data.
app.post('/appendusrConfig', function(req, res) {

    var usrConfig = req.body;

    var _apuserKey = req.body.usrKey;
    var _apusrStockData = req.body.usrStcData;
    var _apusrStocName = req.body.stcName;

    var userjsonData = JSON.stringify(_apusrStockData);

    console.log("Seperating the userkey :"+_apuserKey);
    console.log("the stock data :"+ userjsonData);
    console.log("the stock Name :"+ _apusrStocName);

    fs.readFile('../json/stc_data.json', function(err, obj) {
        // Using another variable to prevent confusion.
        var get_obj;
        var afterAppend = {};
        if (err){
            console.log("THis is error")
            console.log(err);
        } else {
            get_obj = JSON.parse(obj);
            console.log("Before update obj: "+ JSON.stringify(get_obj));
            var _get_key = JSON.stringify(get_obj[_apuserKey]);


            get_obj[_apuserKey][_apusrStocName] = _apusrStockData;
            //console.log(get_obj[_apuserKey][_apusrStocName]);

            //console.log("After update obj: "+ JSON.stringify(get_obj));

        }
        // Test object to remove everything from file.
        var emptyObj = ' ';

        // Write the modified obj to the file
        fs.writeFile('../json/stc_data.json', emptyObj, function(err) {
            if (err) throw err;
        });
        var _appenduserjsonData = {};
        _appenduserjsonData = JSON.stringify(get_obj);
        //console.log(jsonData);
        fs.writeFile('../json/stc_data.json', _appenduserjsonData, function(err) {
            if (err) throw err;
        });
        res.send(get_obj);
    });
});

// This is called when first time user is sending data. Get the post request with encoded userkey
app.post('/UpdateusrConfig', function(req, res) {

    var usrConfig = req.body;

    var userKey = req.body.usrKey;
    var usrStockData = req.body.usrStcData;

    console.log("Seperating the data :"+userKey);
    console.log("the data :"+ JSON.stringify(usrStockData));

    // Temp if it is blocking
    //var decodeduserKey = Base64.decode(userKey);

    var decodeduserKey = userKey;
        // read in the JSON file
    fs.readFile('../json/stc_data.json', function(err, obj) {
        // Using another variable to prevent confusion.
        var getexisting_obj;
        if (err){
            console.log("THis is error")
            console.log(err);
        } else {
            getexisting_obj = JSON.parse(obj);
            //console.log(obj);
            //res.send(obj);
        }
        //console.log(getexisting_obj);
        getexisting_obj[decodeduserKey] = usrStockData;
        console.log(getexisting_obj);


        // Test object to remove everything from file.
        var nullObj = ' ';

        // Write the modified obj to the file
        fs.writeFile('../json/stc_data.json', nullObj, function(err) {
            if (err) throw err;
        });
        var userjsonData = {};
        userjsonData = JSON.stringify(getexisting_obj);
        //console.log(jsonData);
        fs.writeFile('../json/stc_data.json', userjsonData, function(err) {
            if (err) throw err;
        });
        res.send(getexisting_obj);
    });
});

app.get('/getUsrKey/:id', function(req, res) {

    var userId = req.params.id;
    // Temp blocking because it blocked by network.
    //var decodedString = Base64.decode(userId);

    var decodedString = userId;
    console.log("I have received the ID: " +decodedString); // Outputs: "Hello World!"
    fs.readFile('../json/stc_data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log("THis is error")
            console.log(err);
        } else {
            var objData = JSON.parse(data); //now it an object
            //console.log(objData);
            var userkeyData = objData[decodedString];
            console.log( userkeyData );
            res.send(userkeyData);

        }});
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})


