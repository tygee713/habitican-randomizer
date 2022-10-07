import { randomElementFromArray, castSkill } from "./utils.js";

export const randomTransformationItem = (specialObj, partyMembersArr, repeat = false) => {
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

    repCheckbox.addEventListener('change', function () {
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

        await castSkill(
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

