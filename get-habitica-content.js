'use strict';

const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const req = new XMLHttpRequest();
req.open("GET",'https://habitica.com/api/v3/content',true);
req.send();
req.onload = function(){
    let gotData = JSON.parse(req.responseText);
    let data = JSON.stringify(gotData, null, 2);
    fs.writeFileSync('habitica-content.json', data);
};