import { randomElementFromArray, equipItem } from "./utils.js";

export const randomAnimals = (mountsObj, petsObj) => {
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






