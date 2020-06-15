let UUID = null;
let apiKey = null;

document.getElementById('submit-api-key').onclick = function(){
    UUID = document.getElementById("UUID").value;
    apiKey = document.getElementById("api-key").value;
    console.log({UUID, apiKey})
};