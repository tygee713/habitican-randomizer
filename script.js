'use strict';

function randomElementFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function equipItem(type, key, headers) {
  return await fetch(`https://habitica.com/api/v3/user/equip/${type}/${key}`, {
    method: "POST",
    headers,
  }).then((res) => res.json());
}

async function castSkill(spellId, targetId, headers) {
  let url = `https://habitica.com/api/v3/user/class/cast/${spellId}`;
  if (targetId) {
    url += "?targetId=" + targetId;
  }
  let response = await fetch(url, {
    method: "POST",
    headers,
  }).then((response) => response.json());
  return response;
}

function randomAnimals(mountsObj, petsObj, headers) {
  let html = "";
  let mounts = Object.keys(mountsObj).filter((m) => mountsObj[m]);
  let pets = Object.keys(petsObj).filter((p) => petsObj[p]);
  html +=
    "<h2>Random Pet and Random Mount!</h2><p>Don't want to choose your next mount or pet? You can randomize with a click.</p><p>Each pet and mount has the same chance to come out, so it can happen that if currect equipped animal is selected, then it is just unequipped.</p>";
  // random mount button
  if (mounts.length > 0) {
    html += '<input type="button" id="randomMount" value="Equip random mount">';
  } else {
    html += '<p class="not-found">Mounts not found</p>';
  }

  // random pet button
  if (pets.length > 0) {
    html += '<input type="button" id="randomPet" value="Equip random pet">';
  } else {
    html += '<p class="not-found">Pets not found</p>';
  }

  // random pet + mount button
  if (mounts.length > 0 && pets.length > 0) {
    html +=
      '<input type="button" id="randomPetAndMount" value="Equip random pet and mount">';
  }
  html += '<p id="animalResponse"></p>';

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  document.getElementById("main").appendChild(div);

  if (pets.length > 0) {
    document.getElementById("randomPet").addEventListener("click", async () => {
      let randomPetToEquip = randomElementFromArray(pets);
      let response = await equipItem("pet", randomPetToEquip, headers);
      document.getElementById("animalResponse").innerHTML = response.success
        ? `Successfully equipped pet ${randomPetToEquip}`
        : "Something went wrong";
    });
  }

  if (mounts.length > 0) {
    document
      .getElementById("randomMount")
      .addEventListener("click", async () => {
        let randomMountToEquip = randomElementFromArray(mounts);
        let response = await equipItem("mount", randomMountToEquip, headers);
        document.getElementById("animalResponse").innerHTML = response.success
          ? `Successfully equipped mount ${randomMountToEquip}`
          : "Something went wrong";
      });
  }

  if (pets.length > 0 && mounts.length > 0) {
    document
      .getElementById("randomPetAndMount")
      .addEventListener("click", async () => {
        let randomPetToEquip = randomElementFromArray(pets);
        let randomMountToEquip = randomElementFromArray(mounts);
        let response1 = await equipItem("pet", randomPetToEquip, headers);
        let response2 = await equipItem("mount", randomMountToEquip, headers);
        document.getElementById("animalResponse").innerHTML =
          response1.success && response2.success
            ? `Successfully equipped pet ${randomPetToEquip} and mount ${randomMountToEquip}`
            : "Something went wrong";
      });
  }
}

function randomTransformationItem(specialObj, partyMembersArr, headers) {
  let html = '<h2>Random Transformation Item</h2><p>Do you have many party members and many transformation items and choosing is so much effort? No issue, just press a button, and no choice is necessary.</p>';
  let transformationItems = ["snowball", "spookySparkles", "seafoam", "shinySeed"].filter(i => specialObj[i] && specialObj[i] > 0);
  if (transformationItems.length > 0) {
    html += '<input type="button" id="randomTransformationItem" value="Cast random transformation item on random party member">'
  } else {
    html += '<p id="not-found">No transformation items were found</p>';
  }

  html += '<p id="transformation-item-response"></p>';

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  document.getElementById("main").appendChild(div);

  if (transformationItems.length > 0) {
    document.getElementById("randomTransformationItem").addEventListener("click", async () => {
      let randomTransformationItem =
        randomElementFromArray(transformationItems);
      let randomPartyMemberObj = randomElementFromArray(partyMembersArr);

      let response = await castSkill(randomTransformationItem, randomPartyMemberObj.id, headers);
      document.getElementById("transformation-item-response").innerHTML = `${randomTransformationItem} was used on ${randomPartyMemberObj.profile.name} (${randomPartyMemberObj.auth.local.username}).`;
    })
  }
}

function buyRandomEquipment(goldOwned, availableEquipmentArr, headers) {
  let html =
    "<h2>Buy Random Equipment from the Market!</h2><p>Do you have too much stuff to buy, after maybe emptying your inventory ";
  html += "by resetting your account, or kind request to an admin?";
  html += "Just buy a random one using the button!</p>";
  availableEquipmentArr = availableEquipmentArr.filter(
    (i) => i.value <= goldOwned
  );
  if (availableEquipmentArr.length > 0) {
    html +=
      '<input type="button" id="buyRandomEquipment" value="Buy random piece of equipment">';
  } else {
    html +=
      '<p class="not-found">No purchasable equipment was found. Maybe you do not have anything remaining in the Market, or you need to change class or get more gold.</p>';
  }

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  div.setAttribute("id", "randomEquipmentDiv");
  document.getElementById("main").appendChild(div);

  if (availableEquipmentArr.length > 0) {
    document
      .getElementById("buyRandomEquipment")
      .addEventListener("click", async () => {
        let itemToPurchase = randomElementFromArray(availableEquipmentArr);
        const response = await fetch(
          `https://habitica.com/api/v3/user/buy-gear/${itemToPurchase.key}`,
          {
            method: "POST",
            headers,
          }
        ).then((resp) => resp.json());
        document.getElementById("randomEquipmentDiv").innerHTML =
          response.message;
      });
  }
}

async function randomBackground(backgrounds, headers) {
  let html =
    "<h2>Equip a Random Background</h2><p>Don't know what to wear? Let the Random Numger Generator choose your background!</p>";
  html +=
    '<input type="button" id="equipRandomBackgroundButton" value="Equip random background">';
  html += '<p id="backgroundResponse"></p>';

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  div.setAttribute("id", "equipRandomBackground");
  document.getElementById("main").appendChild(div);

  document
    .getElementById("equipRandomBackgroundButton")
    .addEventListener("click", async () => {
      let backgroundToEquip = randomElementFromArray(backgrounds);
      const response = await fetch(
        `https://habitica.com/api/v3/user/unlock?path=background.${backgroundToEquip}`,
        {
          method: "POST",
          headers,
        }
      ).then((resp) => resp.json());
      document.getElementById("backgroundResponse").innerHTML = response.success
        ? `Equipped background ${backgroundToEquip}`
        : "Something went wrong";
    });
}

function startRandomQuest(questsObj, userLevel, headers) {
  let html =
    "<h2>Start a random quest!</h2><p>Your party is not on a quest. Why don't you start one randomly right here? No need to choose it yourself!</p>";

  let questsArr = Object.keys(questsObj).filter(
    (quest) => questsObj[quest] && questsObj[quest] > 0
  );

  if (questsArr.length > 0) {
    html +=
      '<input type="button" id="randomQuestButton" value="Start a random quest from your inventory">';
    html += '<p id="randomQuestResponse"></p>';
  } else {
    html +=
      '<p class="not-found">No quest to start found in your inventory.</p>';
  }

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  div.setAttribute("id", "startRandomQuest");
  document.getElementById("main").appendChild(div);

  if (questsArr.length > 0) {
    document
      .getElementById("randomQuestButton")
      .addEventListener("click", async () => {
        let randomQuest = randomElementFromArray(questsArr);
        await fetch(
          `https://habitica.com/api/v3/groups/party/quests/invite/${randomQuest}`,
          {
            method: "post",
            headers,
          }
        ).then((resp) => resp.json);
        document.getElementById(
          "randomQuestResponse"
        ).innerText = `Invited party to quest: ${randomQuest}`;
        document.getElementById("randomQuestButton").style.display = "none";
      });
  }
}

function equipRandomEquipment(gearOwned, allGear, headers) {
  let html = "<h2>Random Costume or Battle Gear</h2>";
  html += "<p>Don't know what to wear? Let the RNG choose for you!</p>";
  html += "<p>Want to make it harder? Let RNG choose your equipment!</p>";
  html +=
    '<input type="button" id="randomBattleGear" value="Set your Battle Gear randomly">';
  html +=
    '<input type="button" id="randomCostume" value="Set your Costume randomly">';
  html += "<p id='randomEquipResponse'></p>";

  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("wrapper");
  document.getElementById("main").appendChild(div);

  async function equip(t) {
    let description = `New ${t}: `;
    let equippedKeys = [];
    let gearGroups = {};
    for (let gear in gearOwned) {
      if (gearOwned[gear]) {
        const type = gear.match(/^[a-zA-Z]+/)[0];
        gearGroups[type] = gearGroups[type] || [];
        gearGroups[type].push(gear);
      }
    }
    const types = [
      "armor",
      "back",
      "body",
      "eyewear",
      "head",
      "headAccessory",
    ].filter((t) => gearGroups.hasOwnProperty(t));
    for (let type of types) {
      let arr = gearGroups[type];
      let randomThing = randomElementFromArray(arr);
      await equipItem(t, randomThing, headers);
      let localObj = { type, key: randomThing };
      equippedKeys.push(localObj);
    }

    if (gearGroups.hasOwnProperty("weapon")) {
      let weapons = gearGroups.weapon;
      let randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
      await equipItem(t, randomWeapon, headers);
      let localObj = { type: "weapon", key: randomWeapon };
      equippedKeys.push(localObj);

      if (
        !allGear[randomWeapon].twoHanded &&
        gearGroups.hasOwnProperty("shield")
      ) {
        let shields = gearGroups.shield;
        let randomShield = randomElementFromArray(shields);
        await equipItem(t, randomShield, headers);
        let localObj = { type: "shield", key: randomShield };
        equippedKeys.push(localObj);
      }
    } else if (gearGroups.hasOwnProperty("shield")) {
      let shields = gearGroups.shield;
      let randomShield = randomElementFromArray(shields);
      await equipItem(t, randomShield, headers);
      let localObj = { type: "shield", key: randomShield };
      equippedKeys.push(localObj);
    }

    description +=
      "<ul><li>" +
      equippedKeys
        .map((obj) => `${obj.type}: ${allGear[obj.key].text}`)
        .join("</li><li>") +
      "</li></ul>";
    document.getElementById("randomEquipResponse").innerHTML = description;
  }

  document
    .getElementById("randomBattleGear")
    .addEventListener("click", () => equip("equipped"));
  document
    .getElementById("randomCostume")
    .addEventListener("click", () => equip("costume"));
}

document
  .getElementById("submit-api-key")
  .addEventListener("click", async () => {
    let UUID = document.getElementById("UUID").value;
    let apiKey = document.getElementById("api-key").value;
    document.getElementById("main").innerHTML =
      '<div class="wrapper"><p>Loading..</p></div>';
    let headers = {
      "x-api-user": UUID,
      "x-api-key": apiKey,
      "x-client":
        "c073342f-4a65-4a13-9ffd-9e7fa5410d6b - Ieahleen's Habitican Randomizer",
    };

    const {
      data: {
        items: {
          mounts: mountsObj,
          pets: petsObj,
          special: specialObj,
          quests: questsObj,
          gear: { owned: gearObj },
        },
        stats: { gp: goldOwned, class: userClass, lvl: userLevel },
        purchased: { background: backgroundsObj },
      },
    } = await fetch("https://habitica.com/api/v3/user", {
      method: "GET",
      headers,
    }).then((r) => r.json());

    const {
      success: partyDataWasFound,
      error,
      data: partyMembersArr,
    } = await fetch("https://habitica.com/api/v3/groups/party/members", {
      method: "GET",
      headers,
    }).then((r) => r.json());

    const { data: availableEquipmentArr } = await fetch(
      "https://habitica.com/api/v3/user/inventory/buy",
      {
        method: "GET",
        headers,
      }
    ).then((r) => r.json());

    const {
      data: { quest },
    } = await fetch("https://habitica.com/api/v3/groups/party", {
      method: "GET",
      headers,
    }).then((r) => r.json());

    const allGear = await fetch(
      "https://habitica.com/api/v3/content" + "?language=en",
      {
        method: "get",
        headers,
      }
    )
      .then((r) => r.json())
      .then((d) => d.data.gear.flat);

    document.getElementById("main").innerHTML = "";

    randomAnimals(mountsObj, petsObj, headers);

    if (partyDataWasFound) {
      randomTransformationItem(specialObj, partyMembersArr, headers);
      if (!quest.key) {
        startRandomQuest(questsObj, userLevel, headers);
      }
    }

    randomBackground(Object.keys(backgroundsObj), headers);

    buyRandomEquipment(goldOwned, availableEquipmentArr, headers);

    equipRandomEquipment(gearObj, allGear, headers);
  });
