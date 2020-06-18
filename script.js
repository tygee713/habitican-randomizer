'use strict';

let UUID = null; 
let apiKey = null;

async function getUserDataJSON (){
    UUID = document.getElementById("UUID").value; 
    apiKey = document.getElementById("api-key").value;
    
    const response = await fetch('https://habitica.com/api/v3/user?userFields=items', {
        method: 'GET',
        headers: {"x-api-user": UUID, "x-api-key": apiKey} 
    }).then(r => r.json())
    return response;
}; 

async function equipItem (type, key) {
    const response = await fetch("https://habitica.com/api/v3/user/equip/" + type + "/" + key, {
        method: "POST", 
        headers: {"x-api-user": UUID, "x-api-key": apiKey}
    }).then(res => res.json())
    document.getElementById("header").append(response.success ? "Equipped a random thing: " + type + ": " + key : "Something went wrong!");
}

async function createRandomizeButtons () {
    const data = await getUserDataJSON();

    let html = ''; 

    let mounts = Object.keys(data.data.items.mounts).filter(m => data.data.items.mounts[m]);
    
    if (mounts.length > 0) {
      html += '<input type="button" id="randomMount" value="Equip random mount">'
    }

    document.getElementById("main").innerHTML = html;

    if (mounts.length > 0) {
        document.getElementById("randomMount").addEventListener("click", () => {
            let randomMount = mounts[Math.floor(mounts.length * Math.random())];
            equipItem("mount", randomMount)
        })
    }
}

document.getElementById('submit-api-key').addEventListener("click", createRandomizeButtons);

