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
    const {data : {items : {mounts : mountsObj, pets: petsObj}}} = await getUserDataJSON();
    let html = ''; 

    let mounts = Object.keys(mountsObj).filter(m => mountsObj[m]);
    let pets = Object.keys(petsObj).filter(p => petsObj[p]);
    
    // random mount button
    if (mounts.length > 0) {
      html += '<input type="button" id="randomMount" value="Equip random mount">'
    }

    // random pet button
    if (pets.length > 0) {
      html += '<input type="button" id="randomPet" value="Equip random pet">'
    }

    // random pet + mount button
    if (mounts.length > 0 && pets.length > 0) {
      html += '<input type="button" id="randomPetAndMount" value="Equip a random pet and mount">'
    }

    document.getElementById("main").innerHTML = html;

    // random mount logic
    if (mounts.length > 0) {
        document.getElementById("randomMount").addEventListener("click", () => {
            let randomMount = mounts[Math.floor(mounts.length * Math.random())];
            equipItem("mount", randomMount)
        })
    }

    // random pet logic
    if (pets.length > 0) {
        document.getElementById("randomPet").addEventListener("click", () => {
            let randomPet = pets[Math.floor(pets.length * Math.random())];
            equipItem("pet", randomPet)
        })
    }

    // random mount+pet logic
    if (mounts.length > 0 && pets.length > 0) {
        document.getElementById("randomPetAndMount").addEventListener("click", async () => {
            let randomMount = mounts[Math.floor(mounts.length * Math.random())];
            await equipItem("mount", randomMount)
            let randomPet = pets[Math.floor(pets.length * Math.random())];
            await equipItem("pet", randomPet)
        })
    }
}

document.getElementById('submit-api-key').addEventListener("click", createRandomizeButtons);

