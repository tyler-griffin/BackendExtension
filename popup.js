
const getBackendURI = () => {

    var meta = document.querySelectorAll("meta[name='cybernautic-editor-backend-uri']")
        meta = meta[meta.length - 1];
        
    return meta.getAttribute('content');

}

document.querySelectorAll('[data-go-to-backend]').forEach(elem => elem.addEventListener("click", () => {
    
    var button = elem;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        let currentUrl = tabs[0].url;

        currentUrl = currentUrl.replace("https://", "");
        currentUrl = currentUrl.replace("http://", "");
        currentUrl = currentUrl.replace(/\/+$/, "");

        let urlParts = currentUrl.split('/');

        let domain = urlParts[0];

        urlParts.shift();

        var path = urlParts.join("/");

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: getBackendURI
        }, (result) => {

            if(result[0].result != null) {
                path = result[0].result;
            }

            let modifiedUrl = "https://" + domain + "/backend";

            if(path != "") { modifiedUrl += "#/editor/" + path; }

            if(button.id == 'updateCurrentTab') {

                chrome.tabs.update(tabs[0].id, {url: modifiedUrl});

            } else if(button.id == 'openNewTab') {

                chrome.tabs.create({url: modifiedUrl});

            }

        });
        
    });

}));


