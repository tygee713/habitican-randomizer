import { randomElementFromArray, fetchAPI, post } from "./utils.js";

export const startRandomQuest = (questsObj) => {
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