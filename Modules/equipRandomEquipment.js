import { randomElementFromArray, equipItem } from "./utils.js";

export const equipRandomEquipment = (gearOwned, allGear) => {
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

