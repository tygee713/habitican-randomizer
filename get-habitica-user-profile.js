'use strict';

const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const req = new XMLHttpRequest();
req.open("GET",'https://habitica.com/api/v3/user',true);
// XMLHttpRequest.setRequestHeader(header, value)
req.setRequestHeader('x-api-user', 'c073342f-4a65-4a13-9ffd-9e7fa5410d6b');
req.setRequestHeader('x-api-key', '#######');
req.send();
req.onload = function(){
    let gotData = JSON.parse(req.responseText);
    let data = JSON.stringify(gotData.data.items, null, 2);
    fs.writeFileSync('habitica-user-profile-items.json', data);
};