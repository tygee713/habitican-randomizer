'use strict';

function randomElememtFromArray(arr) {
     return arr[Math.floor(Math.random() * arr.length)];
}

async function equipItem (type, key, UUID, apiKey) {
    return await fetch("https://habitica.com/api/v3/user/equip/" + type + "/" + key, {
        method: "POST", 
        headers: {"x-api-user": UUID, "x-api-key": apiKey}
    }).then(res => res.json())
}

async function castSkill (spellId, targetId, UUID, apiKey) {
    let url = "https://habitica.com/api/v3/user/class/cast/" + spellId;
    if (targetId) {
         url += "?targetId=" + targetId;
    }
    let response = await fetch(url, {
        method: "POST",
        headers: {"x-api-user": UUID, "x-api-key": apiKey}
        
    }).then(response => response.json());
    return response;
}

function randomAnimals(mountsObj, petsObj, UUID, apiKey) {
    let html = '';
    let mounts = Object.keys(mountsObj).filter(m => mountsObj[m]);
    let pets = Object.keys(petsObj).filter(p => petsObj[p]);
    html += '<p>Don\'t want to choose your next mount or pet? You can randomize with a click.</p><p>Each pet and mount has the same chance to come out, so it can happen that if currect equipped animal is selected, then it is just unequipped.</p>'
    // random mount button
    if (mounts.length > 0) {
      html += '<input type="button" id="randomMount" value="Equip random mount">'
    } else {
        html += '<p>Mounts not found</p>'
    }

    // random pet button
    if (pets.length > 0) {
      html += '<input type="button" id="randomPet" value="Equip random pet">'
    } else {
        html += '<p>Pets not found</p>'
    }

    // random pet + mount button
    if (mounts.length > 0 && pets.length > 0) {
      html += '<input type="button" id="randomPetAndMount" value="Equip random pet and mount">'
    }
    html += '<p id="animalResponse"></p>';

    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add("wrapper");
    document.getElementById("main").appendChild(div);

    if (pets.length > 0) {
    document.getElementById("randomPet").addEventListener("click", async () => {
        let randomPetToEquip = randomElememtFromArray(pets);
        let response = await equipItem("pet", randomPetToEquip, UUID, apiKey)
        document.getElementById("animalResponse").innerHTML = response.success? "Successfully equipped pet " + randomPetToEquip : "Something went wrong";
    });}

        if (mounts.length > 0) {
    document.getElementById("randomMount").addEventListener("click", async () => {
        let randomMountToEquip = randomElememtFromArray(mounts);
        let response = await equipItem("mount", randomMountToEquip, UUID, apiKey)
        document.getElementById("animalResponse").innerHTML = response.success? "Successfully equipped mount " + randomMountToEquip : "Something went wrong";
    });}

    if (pets.length> 0 && mounts.length > 0) {
    document.getElementById("randomPetAndMount").addEventListener("click", async () => {
        let randomPetToEquip = randomElememtFromArray(pets);
        let randomMountToEquip = randomElememtFromArray(mounts);
        let response1 = await equipItem("pet", randomPetToEquip, UUID, apiKey)
        let response2 = await equipItem("mount", randomMountToEquip, UUID, apiKey)
        document.getElementById("animalResponse").innerHTML = response1.success && response2.success? "Successfully equipped pet " + randomPetToEquip + " and mount " + randomMountToEquip : "Something went wrong";
    });}

}

function randomTransformationItem(specialObj, partyMembersArr, UUID, apiKey) {
    let html = '<p>Do you have many party members and many transformation items and choosing is so much effort? No issue, just press a button, and no choice is necessary.</p>';
    let transformationItems = ["snowball", "spookySparkles", "seafoam", "shinySeed"].filter(i => specialObj[i] && specialObj[i] > 0);
    if (transformationItems.length > 0) {
        html += '<input type="button" id="randomTransformationItem" value="Cast random transformation item on random party member">'
    } else {
        html += "No transformation items were found"
    }

    html += '<p id="transformation-item-response"></p>';

    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add("wrapper");
    document.getElementById("main").appendChild(div);

    if (transformationItems.length > 0) {
    document.getElementById("randomTransformationItem").addEventListener("click", async () => {
        let randomTransformationItem = randomElememtFromArray(transformationItems)
        let randomPartyMemberObj = randomElememtFromArray(partyMembersArr);

        let response = await castSkill(randomTransformationItem, randomPartyMemberObj.id, UUID, apiKey);
        document.getElementById("transformation-item-response").innerHTML = randomTransformationItem + " was used on " + randomPartyMemberObj.profile.name + " (" + randomPartyMemberObj.auth.local.username + ").";
    })}
}

function randomEquipment (gp, c, eqArr, UUID, apiKey) {
    eqArr = eqArr.filter(i => i.value <= gp && (i.klass === "special" || i.klass === c));
    console.log(eqArr);
}

document.getElementById('submit-api-key').addEventListener("click", async () => {
    let UUID = document.getElementById("UUID").value; 
    let apiKey = document.getElementById("api-key").value;  
    
    const {
        data : {
            items : {
                mounts : mountsObj,
                pets: petsObj, 
                special: specialObj
            },
            stats : {
                gp : goldOwned,
                class : userClass
            }
        }
    } = await fetch('https://habitica.com/api/v3/user', {method: 'GET', headers: {"x-api-user": UUID, "x-api-key": apiKey}}).then(r => r.json());
    
    const {
        success : partyDataWasFound,
        error,
        data : partyMembersArr
    } = await fetch('https://habitica.com/api/v3/groups/party/members', {method: 'GET', headers: {"x-api-user": UUID, "x-api-key": apiKey}}).then(r => r.json());
    
    const {
        data : availableEquipmentArr
    } = await fetch('https://habitica.com/api/v3/user/inventory/buy', {method: 'GET', headers: {"x-api-user": UUID, "x-api-key": apiKey}}).then(r => r.json());
    
    document.getElementById("main").innerHTML = "";

    randomAnimals(mountsObj, petsObj, UUID, apiKey);

    if (partyDataWasFound) {
        randomTransformationItem(specialObj, partyMembersArr, UUID, apiKey);
    }

    randomEquipment(goldOwned, userClass, availableEquipmentArr, UUID, apiKey);
});
