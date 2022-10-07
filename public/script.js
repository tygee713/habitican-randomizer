'use strict';

import { randomAnimals } from "./Modules/randomAnimals.js";
import { randomTransformationItem } from "./Modules/randomTransformationItem.js";
import { buyRandomEquipment } from "./Modules/buyRandomEquipment.js";
import { randomBackground } from "./Modules/randomBackground.js";
import { equipRandomEquipment } from "./Modules/equipRandomEquipment.js";
import { startRandomQuest } from "./Modules/startRandomQuest.js";
import { fetchAPI, headers, get } from "./Modules/utils.js";

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

  [headers['x-api-user'], headers['x-api-key']] = [UUID, apiKey];

  const user = await fetchAPI('https://habitica.com/api/v3/user', get);

  if (user.success !== true) {
    document.getElementById('error-message').innerHTML = 'Wrong UUID or API Key';
    return;
  }

  document.getElementById('main').innerHTML =
    '<form class="wrapper"><p>Loading..</p></div>';
  const {
    data: {
      items: {
        mounts: mountsObj,
        pets: petsObj,
        special: specialObj,
        quests: questsObj,
        gear: { owned: gearObj },
      },
      stats: { gp: goldOwned },
      purchased: { background: backgroundsObj },
    },
  } = user;

  const {
    success: partyDataWasFound,
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
      startRandomQuest(questsObj);
    }
  }

  randomBackground(Object.keys(backgroundsObj));

  buyRandomEquipment(goldOwned, availableEquipmentArr);

  equipRandomEquipment(gearObj, allGear);
}
