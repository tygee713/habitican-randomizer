'use strict';

let UUID = null; 
let apiKey = null;

async function getUserDataJSON (){
    UUID = document.getElementById("UUID").value; 
    apiKey = document.getElementById("api-key").value;
    
    const response = await fetch('https://habitica.com/api/v3/user', {
        method: 'GET',
        headers: {"x-api-user": UUID, "x-api-key": apiKey} 
    }).then(r => r.json())
    return response;
}; 
async function getPartyMembersJSON () {
    const response = await fetch('https://habitica.com/api/v3/groups/party/members', {
        method: 'GET',
        headers: {"x-api-user": UUID, "x-api-key": apiKey} 
    }).then(r => r.json());
    return response;
}

async function equipItem (type, key) {
    const response = await fetch("https://habitica.com/api/v3/user/equip/" + type + "/" + key, {
        method: "POST", 
        headers: {"x-api-user": UUID, "x-api-key": apiKey}
    }).then(res => res.json())
    document.getElementById("header").append(response.success ? "Equipped a random thing: " + type + ": " + key : "Something went wrong!");
}

function randomElememtFromArray(arr) {
     return arr[Math.floor(Math.random() * arr.length)];
}

async function castSkill (spellId, targetId) {
    let url = "https://habitica.com/api/v3/user/class/cast/" + spellId;
    if (targetId) {
         url += "?targetId=" + targetId;
    }
    let response = await fetch(url, {
        method: "POST",
        headers: {"x-api-user": UUID, "x-api-key": apiKey}
        
    }).then(response => response.json());
    document.getElementById("header").append("response: " + response.success);
}

async function createRandomizeButtons () {
    const {data : {items : {mounts : mountsObj, pets: petsObj, special: specialObj}}} = await getUserDataJSON();
    const { data : partyMembersArr } = await getPartyMembersJSON();
    console.log(partyMembersArr);
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

    // random transformation item
     let transformationItems = ["snowball", "spookySparkles", "seafoam", "shinySeed"].filter(i => specialObj[i] && specialObj[i] > 0);
    if (transformationItems.length > 0) {
        html += '<input type="button" id="randomTransformationItem" value="Cast random transformation item on random party member">'
    }
    document.getElementById("main").innerHTML = html;

    // random mount logic
    if (mounts.length > 0) {
        document.getElementById("randomMount").addEventListener("click", () => {
            let randomMount = randomElememtFromArray(mounts);
            equipItem("mount", randomMount)
        })
    }

    // random pet logic
    if (pets.length > 0) {
        document.getElementById("randomPet").addEventListener("click", () => {
            let randomPet = randomElememtFromArray(pets);
            equipItem("pet", randomPet)
        })
    }

    // random mount+pet logic
    if (mounts.length > 0 && pets.length > 0) {
        document.getElementById("randomPetAndMount").addEventListener("click", async () => {
            let randomMount = randomElememtFromArray(mounts);
            await equipItem("mount", randomMount)
            let randomPet = randomElememtFromArray(pets);
            await equipItem("pet", randomPet)
        })
    }

    // random transformation item
    if (transformationItems.length > 0) {
        document.getElementById("randomTransformationItem").addEventListener("click", () => {
            let randomTransformationItem = randomElememtFromArray(transformationItems)
            let randomPartyMember = randomElememtFromArray(partyMembersArr);
            
        })
    }
}

document.getElementById('submit-api-key').addEventListener("click", createRandomizeButtons);

