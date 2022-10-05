'use strict';

const headers = {
  'x-client':
    "c073342f-4a65-4a13-9ffd-9e7fa5410d6b - Ieahleen's Habitican Randomizer",
};
const get = { method: 'GET' };
const post = { method: 'POST' };

function randomElementFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchAPI(url, params) {
  const response = await fetch(url, { headers, ...params });
  return response.json();
}

async function equipItem(type, key) {
  return await fetchAPI(
    `https://habitica.com/api/v3/user/equip/${type}/${key}`,
    post
  );
}

async function castSkill(spellId, targetId) {
  let url = `https://habitica.com/api/v3/user/class/cast/${spellId}`;
  if (targetId) {
    url += '?targetId=' + targetId;
  }
  let response = await fetchAPI(url, post);
  return response;
}

function randomAnimals(mountsObj, petsObj) {
  let html = '';
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

  let div = document.createElement('div');
  div.innerHTML = html;
  div.classList.add('wrapper');
  document.getElementById('main').appendChild(div);

  if (pets.length > 0) {
    document.getElementById('randomPet').addEventListener('click', async () => {
      let randomPetToEquip = randomElementFromArray(pets);
      let response = await equipItem('pet', randomPetToEquip);
      document.getElementById('animalResponse').innerHTML = response.success
        ? `Successfully equipped pet ${randomPetToEquip}`
        : 'Something went wrong';
    });
  }

  if (mounts.length > 0) {
    document
      .getElementById('randomMount')
      .addEventListener('click', async () => {
        let randomMountToEquip = randomElementFromArray(mounts);
        let response = await equipItem('mount', randomMountToEquip);
        document.getElementById('animalResponse').innerHTML = response.success
          ? `Successfully equipped mount ${randomMountToEquip}`
          : 'Something went wrong';
      });
  }

  if (pets.length > 0 && mounts.length > 0) {
    document
      .getElementById('randomPetAndMount')
      .addEventListener('click', async () => {
        let randomPetToEquip = randomElementFromArray(pets);
        let randomMountToEquip = randomElementFromArray(mounts);
        let response1 = await equipItem('pet', randomPetToEquip);
        let response2 = await equipItem('mount', randomMountToEquip);
        document.getElementById('animalResponse').innerHTML =
          response1.success && response2.success
            ? `Successfully equipped pet ${randomPetToEquip} and mount ${randomMountToEquip}`
            : 'Something went wrong';
      });
  }
}

function randomTransformationItem(specialObj, partyMembersArr, repeat = false) {
  const el = document.querySelector('#transf-item-id');
  let div;
  if (!el) {
    div = document.createElement('div');
    div.id = 'transf-item-id';
    div.classList.add('wrapper');
    document.getElementById('main').appendChild(div);
  } else {
    div = el;
  }

  console.log(partyMembersArr);
  let html =
    '<h2>Random Transformation Item</h2><p>Do you have many party members and many transformation items and choosing is so much effort? No issue, just press a button, and no choice is necessary.</p>';
  let transformationItems = [
    'snowball',
    'spookySparkles',
    'seafoam',
    'shinySeed',
  ].filter((i) => specialObj[i] && specialObj[i] > 0);
  if (transformationItems.length > 0) {
    html += `<input type="button" id="randomTransformationItem" value="Cast random transformation item on random party member"><label for="no-repeat"><input id="no-repeat" type="checkbox"${repeat ? 'checked' : ''
      }> Do not transform if already trasformed please</label><span id="no-repeat-span" class="not-found hide">No party mate available</span>`;
  } else {
    html += '<p id="not-found">No transformation items were found</p>';
  }

  html += '<p id="transformation-item-response"></p>';

  div.innerHTML = html;

  if (transformationItems.length > 0) {
    const repCheckbox = document.querySelector('#no-repeat');
    const nrspam = document.querySelector('#no-repeat-span');
    const randItemButton = document.querySelector('#randomTransformationItem');

    if (
      repCheckbox.checked &&
      partyMembersArr.filter((partyMate) => {
        const buffs = partyMate.stats.buffs;
        return !(
          buffs.seafoam ||
          buffs.shinySeed ||
          buffs.snowball ||
          buffs.spookySparkles
        );
      }).length === 0
    ) {
      nrspam.classList.remove('hide');
      randItemButton.disabled = true;
    }

    repCheckbox.addEventListener('change', function (event) {
      const noRepeatSpan = document.querySelector('#no-repeat-span');
      const randItemButton = document.querySelector(
        '#randomTransformationItem'
      );
      if (
        this.checked &&
        partyMembersArr.filter((partyMate) => {
          const buffs = partyMate.stats.buffs;
          return !(
            buffs.seafoam ||
            buffs.shinySeed ||
            buffs.snowball ||
            buffs.spookySparkles
          );
        }).length === 0
      ) {
        noRepeatSpan.classList.remove('hide');
        randItemButton.disabled = true;
      } else {
        noRepeatSpan.classList.add('hide');
        randItemButton.disabled = false;
      }
    });
    document
      .getElementById('randomTransformationItem')
      .addEventListener('click', async (event) => {
        event.target.classList.add('hide');
        document.querySelector('label[for="no-repeat"]').classList.add('hide');
        const checkbox = document.querySelector('#no-repeat');
        if (checkbox.checked) {
          partyMembersArr = partyMembersArr.filter((partyMate) => {
            const buffs = partyMate.stats.buffs;
            return !(
              buffs.seafoam ||
              buffs.shinySeed ||
              buffs.snowball ||
              buffs.spookySparkles
            );
          });
        }
        let randomlyChoosenTransformationItem =
          randomElementFromArray(transformationItems);
        let randomPartyMemberObj = randomElementFromArray(partyMembersArr);

        let response = await castSkill(
          randomlyChoosenTransformationItem,
          randomPartyMemberObj.id
        );
        randomPartyMemberObj.stats.buffs[
          randomlyChoosenTransformationItem
        ] = true;
        specialObj[randomlyChoosenTransformationItem]--;
        console.log(randomPartyMemberObj);
        document.getElementById(
          'transformation-item-response'
        ).innerHTML = `${randomlyChoosenTransformationItem} was used on ${randomPartyMemberObj.profile.name} (${randomPartyMemberObj.auth.local.username}).`;
        const newButton = document.createElement('button');
        newButton.innerText = 'back';
        document
          .querySelector('#randomTransformationItem')
          .parentNode.append(newButton);
        newButton.addEventListener('click', () =>
          randomTransformationItem(
            specialObj,
            partyMembersArr,
            checkbox.checked
          )
        );
      });
  }
}

function buyRandomEquipment(goldOwned, availableEquipmentArr) {
  let html =
    '<h2>Buy Random Equipment from the Market!</h2><p>Do you have too much stuff to buy, after maybe emptying your inventory ';
  html += 'by resetting your account, or kind request to an admin?';
  html += 'Just buy a random one using the button!</p>';
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

  let div = document.createElement('div');
  div.innerHTML = html;
  div.classList.add('wrapper');
  div.setAttribute('id', 'randomEquipmentDiv');
  document.getElementById('main').appendChild(div);

  if (availableEquipmentArr.length > 0) {
    document
      .getElementById('buyRandomEquipment')
      .addEventListener('click', async () => {
        let itemToPurchase = randomElementFromArray(availableEquipmentArr);
        const response = await fetchAPI(
          `https://habitica.com/api/v3/user/buy-gear/${itemToPurchase.key}`,
          post
        );
        document.getElementById('randomEquipmentDiv').innerHTML =
          response.message;
      });
  }
}

async function randomBackground(backgrounds) {
  let html =
    "<h2>Equip a Random Background</h2><p>Don't know what to wear? Let the Random Numger Generator choose your background!</p>";
  html +=
    '<input type="button" id="equipRandomBackgroundButton" value="Equip random background">';
  html += '<p id="backgroundResponse"></p>';

  let div = document.createElement('div');
  div.innerHTML = html;
  div.classList.add('wrapper');
  div.setAttribute('id', 'equipRandomBackground');
  document.getElementById('main').appendChild(div);

  document
    .getElementById('equipRandomBackgroundButton')
    .addEventListener('click', async () => {
      let backgroundToEquip = randomElementFromArray(backgrounds);
      const response = await fetchAPI(
        `https://habitica.com/api/v3/user/unlock?path=background.${backgroundToEquip}`,
        post
      );
      document.getElementById('backgroundResponse').innerHTML = response.success
        ? `Equipped background ${backgroundToEquip}`
        : 'Something went wrong';
    });
}

function startRandomQuest(questsObj, userLevel) {
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

  let div = document.createElement('div');
  div.innerHTML = html;
  div.classList.add('wrapper');
  div.setAttribute('id', 'startRandomQuest');
  document.getElementById('main').appendChild(div);

  if (questsArr.length > 0) {
    document
      .getElementById('randomQuestButton')
      .addEventListener('click', async () => {
        let randomQuest = randomElementFromArray(questsArr);
        await fetchAPI(
          `https://habitica.com/api/v3/groups/party/quests/invite/${randomQuest}`,
          post
        );
        document.getElementById(
          'randomQuestResponse'
        ).innerText = `Invited party to quest: ${randomQuest}`;
        document.getElementById('randomQuestButton').style.display = 'none';
      });
  }
}

function equipRandomEquipment(gearOwned, allGear) {
  let html = '<h2>Random Costume or Battle Gear</h2>';
  html += "<p>Don't know what to wear? Let the RNG choose for you!</p>";
  html += '<p>Want to make it harder? Let RNG choose your equipment!</p>';
  html +=
    '<input type="button" id="randomBattleGear" value="Set your Battle Gear randomly">';
  html +=
    '<input type="button" id="randomCostume" value="Set your Costume randomly">';
  html += "<p id='randomEquipResponse'></p>";

  let div = document.createElement('div');
  div.innerHTML = html;
  div.classList.add('wrapper');
  document.getElementById('main').appendChild(div);

  async function equip(t) {
    let description = `New ${t}: `;
    let equippedKeys = [];
    let gearGroups = {};
    const equipper = async (type) => {
      let arr = gearGroups[type];
      let randomThing = randomElementFromArray(arr);
      await equipItem(t, randomThing);
      let equipped = { type, key: randomThing };
      return equipped;
    };
    for (let gear in gearOwned) {
      if (gearOwned[gear]) {
        const type = gear.match(/^[a-zA-Z]+/)[0];
        gearGroups[type] = gearGroups[type] || [];
        gearGroups[type].push(gear);
      }
    }
    const types = [
      'armor',
      'back',
      'body',
      'eyewear',
      'head',
      'headAccessory',
    ].filter((t) => gearGroups.hasOwnProperty(t));
    for (let type of types) {
      const equipped = await equipper(type);
      equippedKeys.push(equipped);
    }

    if (gearGroups.hasOwnProperty('weapon')) {
      const equippedWeapon = await await equipper('weapon');
      equippedKeys.push(equippedWeapon);
      if (
        !allGear[equippedWeapon.key].twoHanded &&
        gearGroups.hasOwnProperty('shield')
      ) {
        const equippedShield = await equipper('shield');
        equippedKeys.push(equippedShield);
      }
    } else if (gearGroups.hasOwnProperty('shield')) {
      const equipped = await equipper('shield');
      equippedKeys.push(equipped);
    }

    description +=
      '<ul><li>' +
      equippedKeys
        .map((obj) => `${obj.type}: ${allGear[obj.key].text}`)
        .join('</li><li>') +
      '</li></ul>';
    document.getElementById('randomEquipResponse').innerHTML = description;
  }

  document
    .getElementById('randomBattleGear')
    .addEventListener('click', () => equip('equipped'));
  document
    .getElementById('randomCostume')
    .addEventListener('click', () => equip('costume'));
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  build();
});

// listen for inputs info fields
// add validation
//check that the fields have the right number of characters inside (API and UUID are 36 characters long)

// it has only valid characters, so 0-9, a-f, and dash - — uppercase or lowercase
// Only allow to press the button if both are satisfied

document.querySelector('form').addEventListener('input', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  const api = document.getElementById('api-key').value;
  const uuid = document.getElementById('UUID').value;
  const button = document.querySelector('input[type="submit"]');
  if (
    api.length === 36 &&
    uuid.length === 36 &&
    api.match(/^[0-9a-f-]+$/i) &&
    uuid.match(/^[0-9a-f-]+$/i)
  ) {
    document.getElementById('error').innerText = '';
    button.disabled = false;
  } else {
    // add red text above the button saying "Please enter a valid API key and UUID"
    document.getElementById('error').innerText =
      'Please enter a valid API key and UUID';

    button.disabled = true;
  }
});

async function build() {
  let UUID = document.getElementById('UUID').value;
  let apiKey = document.getElementById('api-key').value;

  document.getElementById('main').innerHTML =
    '<form class="wrapper"><p>Loading..</p></div>';

  [headers['x-api-user'], headers['x-api-key']] = [UUID, apiKey];

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
  } = await fetchAPI('https://habitica.com/api/v3/user', get);

  const {
    success: partyDataWasFound,
    error,
    data: partyMembersArr,
  } = await fetchAPI(
    'https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true',
    get
  );

  const { data: availableEquipmentArr } = await fetchAPI(
    'https://habitica.com/api/v3/user/inventory/buy',
    get
  );

  const {
    data: {
      gear: { flat: allGear },
    },
  } = await fetchAPI(
    'https://habitica.com/api/v3/content' + '?language=en',
    get
  );

  document.getElementById('main').innerHTML = '';

  randomAnimals(mountsObj, petsObj);

  if (partyDataWasFound) {
    randomTransformationItem(specialObj, partyMembersArr);
    const {
      data: { quest },
    } = await fetchAPI('https://habitica.com/api/v3/groups/party', get);
    if (!quest.key) {
      startRandomQuest(questsObj, userLevel);
    }
  }

  randomBackground(Object.keys(backgroundsObj));

  buyRandomEquipment(goldOwned, availableEquipmentArr);

  equipRandomEquipment(gearObj, allGear);
}
