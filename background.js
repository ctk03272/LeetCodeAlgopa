chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.clear(function () {
        let error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        console.log("Clear storage")
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'leetcode.com'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);

    });

    let contexts = ["editable"];
    for (let i = 0; i < contexts.length; i++) {
        let context = contexts[i];
        let title = `Push to Github`;
        let id = chrome.contextMenus.create(
            {
                "title": title, "contexts": [context],
                "id": "context" + context,
                "documentUrlPatterns": ["https://leetcode.com/problems/*"]
            }
        );
    }
    ;
});


// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The onClicked callback function.
let onClickHandler = function (info, tab) {
    /*    if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
            console.log("radio item " + info.menuItemId +
                " was clicked (previous checked state was " +
                info.wasChecked + ")");
        } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
            console.log(JSON.stringify(info));
            console.log("checkbox item " + info.menuItemId +
                " was clicked, state is now: " + info.checked +
                " (previous state was " + info.wasChecked + ")");

        } else {
            console.log("item " + info.menuItemId + " was clicked");
            console.log("info: " + JSON.stringify(info));
            console.log("tab: " + JSON.stringify(tab));
        }*/

    let Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

        // public method for encoding
        , encode: function (input) {
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            } // Whend

            return output;
        } // End Function encode


        // public method for decoding
        , decode: function (input) {
            let output = "";
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }

                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            } // Whend

            output = Base64._utf8_decode(output);

            return output;
        } // End Function decode


        // private method for UTF-8 encoding
        , _utf8_encode: function (string) {
            let utftext = "";
            string = string.replace(/\r\n/g, "\n");

            for (let n = 0; n < string.length; n++) {
                const c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            } // Next n

            return utftext;
        } // End Function _utf8_encode

        // private method for UTF-8 decoding
        , _utf8_decode: function (utftext) {
            let string = "";
            let i = 0;
            let c, c1, c2, c3;
            c = c1 = c2 = 0;

            while (i < utftext.length) {
                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            } // Whend

            return string;
        } // End Function _utf8_decode
    };

    let makeSendBody = (code, sha, commitMessage) => {
        const createMessage = {
            "message": commitMessage.message,
            "committer": {
                "name": commitMessage.committerName,
                "email": commitMessage.committerEmail
            },
            "content": Base64.encode(code)
        };
        const updateMessage = {
            ...createMessage,
            sha
        };
        if (sha) {
            return updateMessage;
        } else {
            return createMessage;
        }
    };

    let isEmptyString = (value) => {
        return value === "" || value === null || value === undefined;
    };

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "push"}, function (messageResponse) {
            chrome.storage.sync.get(null, function (data) {
                if ((Object.keys(data).length === 0 && data.constructor === Object) || Object.values(data).some((value) => isEmptyString(value))) {
                    chrome.tabs.sendMessage(tabs[0].id, {message: "empty"}, (messageResponse) => {
                        console.log(messageResponse.error)
                    });
                    return;
                }
                const urlElements = [data.url, data.owner, data.repo, 'contents', messageResponse.problem, data.fileName.concat('.java')];
                const url = urlElements.join('/');
                const commitMessage = {
                    message: data.message,
                    committerName: data.committerName,
                    committerEmail: data.committerEmail
                };
                fetch(url, {
                    method: 'GET', // or 'PUT'
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': 'token '.concat(data.oAuthToken)
                    }
                })
                    .then(res => res.json())
                    .then(response => {
                        let sha = response.sha;
                        fetch(url, {
                            method: 'PUT', // or 'PUT'
                            body: JSON.stringify(makeSendBody(messageResponse.code, sha, commitMessage)), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/vnd.github.v3+json',
                                'Authorization': 'token '.concat(data.oAuthToken)
                            }
                        })
                            .then(res => res.json())
                            .then(response => {
                                console.log('Success:', JSON.stringify(response));
                                chrome.tabs.sendMessage(tabs[0].id, {message: "github", response: response}, () => {
                                });
                            })
                            .catch(error => console.error('Error:', error));
                    })
                    .catch(error => {
                        fetch(url, {
                            method: 'PUT', // or 'PUT'
                            body: JSON.stringify(makeSendBody(messageResponse.code, "", commitMessage)), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/vnd.github.v3+json',
                                'Authorization': 'token '.concat(data.oAuthToken)
                            }
                        })
                            .then(res => res.json())
                            .then(response => {
                                console.log('Success:', JSON.stringify(response));
                                chrome.tabs.sendMessage(tabs[0].id, {message: "github", response: response}, () => {
                                });
                            })
                            .catch(error => console.error('Error:', error));
                    });
            });
        });
    });
};

// Set up context menu tree at install time.


chrome.contextMenus.onClicked.addListener(onClickHandler);

