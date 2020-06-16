'use strict';

const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let UUID = null;
let apiKey = null;

document.getElementById('submit-api-key').onclick = getUserDataJSON;

function getUserDataJSON (){
    console.log("getUserData")
    UUID = document.getElementById("UUID").value;
    apiKey = document.getElementById("api-key").value;

    const req = new XMLHttpRequest();
    req.open("GET",'https://habitica.com/api/v3/user?userFields=items',true);
    req.setRequestHeader('x-api-user', UUID);
    req.setRequestHeader('x-api-key', apiKey);
    req.send();
    req.onload = buttonsFromUserData(req.responseText);
};

function buttonsFromUserData (userDataJSON) {
    let userData = JSON.parse(userDataJSON);
    let buttonsHTML = '';
    let mounts = Object.keys(userData.data.items.mounts).filter(m => userData.data.items.mounts[m]);
    if (mounts.length > 0) {
        var randomMount = mounts[Math.floor(Math.random() * mounts.length)];
        buttonsHTML += '<input type="button" id="randomMount" text="Equip a random mount!">'
        document.getElementById("randomMount").addEventListener("click", equipItem(randomMount))
    }
}

function equipItem(type, key) {
    const req = new XMLHttpRequest();
    req.open("POST",'https://habitica.com/api/v3/user/equip/' + type + '/' + key,true);
    req.setRequestHeader('x-api-user', UUID);
    req.setRequestHeader('x-api-key', apiKey);
    req.send();
    // req.onload
}