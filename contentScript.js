console.log("content");
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "push") {
            let code = document.getElementsByClassName("CodeMirror-code")[0].innerText.split("\n").reduce(function (accumulator, currentValue, currentIndex, array) {
                if (currentIndex % 2 !== 0) {
                    return accumulator + currentValue + '\n';
                } else {
                    return accumulator;
                }
            }, "");
            sendResponse({
                code,
                problem: window.document.title.split("-")[0].replace(/ /gi, "")
            });
        }

        if (request.message === "github") {
            sendResponse({
                success: "success"
            });
            if (!request.response.message) {
                swal("Good job!", request.response.content.html_url, "success");
            } else {
                swal("Error!", request.response.message, "error");
            }
        }

        if (request.message === "success") {
            sendResponse({
                success: "success"
            });
            swal("Good job!", "Change Saved", "success");
        }

        if (request.message === "empty") {
            sendResponse({
                error: "error"
            });
            swal("Error", "Empty Input", "error");
        }
    }
);


/*let code = document.getElementsByClassName("CodeMirror-code")[0].innerText.split("\n").reduce(function (accumulator, currentValue, currentIndex, array) {
    if (currentIndex % 2 != 0) {
        return accumulator + currentValue + '\n';
    } else {
        return accumulator;
    }
}, "");*/
