import { randomElementFromArray, fetchAPI, post } from "./utils.js";

export const randomBackground = async (backgrounds) => {
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