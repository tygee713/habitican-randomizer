import { randomElementFromArray, fetchAPI, post } from "./utils.js";

export const buyRandomEquipment = (goldOwned, availableEquipmentArr) => {
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