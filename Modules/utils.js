export const randomElementFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const fetchAPI = async (url, params) => {
  const response = await fetch(url, { headers, ...params });
  return response.json();
}

export const headers = {
  'x-client':
    "c073342f-4a65-4a13-9ffd-9e7fa5410d6b - Ieahleen's Habitican Randomizer",
};
export const get = { method: 'GET' };
export const post = { method: 'POST' };

export const equipItem = async (type, key) => {
  return await fetchAPI(
    `https://habitica.com/api/v3/user/equip/${type}/${key}`,
    post
  );
}

export const castSkill = async (spellId, targetId) => {
  let url = `https://habitica.com/api/v3/user/class/cast/${spellId}`;
  if (targetId) {
    url += '?targetId=' + targetId;
  }
  let response = await fetchAPI(url, post);
  return response;
}