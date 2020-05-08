/*
chrome.storage.sync.get(null, function(data) {
    console.dir(data);
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});
*/
ownerInput = document.getElementById('owner');
repoInput = document.getElementById('repo');
oAuthTokenInput = document.getElementById('oAuth');
fileNameInput = document.getElementById('fileName');
messageInput = document.getElementById('message');
committerNameInput = document.getElementById('committerName');
committerEmailInput = document.getElementById('committerEmail');

chrome.storage.sync.get(null, function (data) {
    ownerInput.value = data.owner ? data.owner : "";
    repoInput.value = data.repo ? data.repo : "";
    oAuthTokenInput.value = data.oAuthToken ? data.oAuthToken : "";
    fileNameInput.value = data.fileName ? data.fileName : "";
    messageInput.value = data.message ? data.message : "";
    committerNameInput.value = data.committerName ? data.committerName : "";
    committerEmailInput.value = data.committerEmail ? data.committerEmail : "";
});

let saveButton = document.getElementById('save');
let tempButton = document.getElementById('temp');

tempButton.addEventListener('click',function(){
    ownerInput.value='ctk03272';
    repoInput.value='LeetCode';
    oAuthTokenInput.value='7a31cd384d7faae0b5f770d39359dd34ed31b573';
    fileNameInput.value='ctk0327';
    messageInput.value='commit~~';
    committerNameInput.value='ctk0327';
    committerEmailInput.value='ctk0327@naver.com';
    this.style.display='none';
});

saveButton.addEventListener('click', () => {
    let owner = ownerInput.value;
    let repo = repoInput.value;
    let oAuthToken = oAuthTokenInput.value;
    let fileName = fileNameInput.value;
    let message = messageInput.value;
    let committerName = committerNameInput.value;
    let committerEmail = committerEmailInput.value;

    chrome.storage.sync.set({
        url: 'https://api.github.com/repos',
        owner,
        repo,
        oAuthToken,
        fileName,
        message,
        committerName,
        committerEmail
    }, function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "success"}, (response) => {
                console.log(response);
            });
        });
        console.log("Setting storage");
    });
});

