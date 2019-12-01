'use strict';

var setInitialBadge = function (badgeText) {
    chrome.browserAction.setBadgeText({text: badgeText});
    chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
}

var removeBadge = function () {
    chrome.browserAction.setBadgeText({text: ""});
}

var disableSaveButton = function () {
    let saveButton = document.getElementById("saveButton");
    saveButton.disabled = true;
}

var enableSaveButton = function () {
    let saveButton = document.getElementById("saveButton");
    saveButton.disabled = false;
}

var disableRecoverButton = function () {
    let recoverButton = document.getElementById("recoverButton");
    recoverButton.disabled = true;
}

var enableRecoverButton = function () {
    let recoverButton = document.getElementById("recoverButton");
    recoverButton.disabled = false;
}


var getMementos = function (callback) {
    chrome.storage.local.get(['tabsMementoMem'], function (result) {
 
        if(!result['tabsMementoMem']) {
            var mementos = new Set();
            chrome.storage.local.set({tabsMementoMem: mementos});
            callback(mementos);
        } else {
            callback(result['tabsMementoMem']);
        }
    });
}

var getOpenedUrls = function (windows) {

    var urls = new Set();

    var j = 0;
    for( j = 0; j< windows.length; j++) {
        var window = windows[j];

        var i = 0;
        for( i = 0; i< window.tabs.length; i++) {
            urls.add(window.tabs[i].url);
        }
    }

    return urls;
}

var loadMementoIntoTabs = function () {
    getMementos(function (mementos) {
        chrome.windows.getAll({populate:true},function(windows){

            var urls = getOpenedUrls(windows);
            mementos.forEach(function (urlValue) {
                if(!urls.has(urlValue)) {
                    console.log('opening '+urlValue);
                    chrome.tabs.create({url: urlValue, active: false});
                }
            });
        });
    });
}

var saveTabsIntoMemento = function () {

    console.log('saving urls to memento');

    chrome.windows.getAll({populate:true},function(windows){

        var urls = getOpenedUrls(windows);

        console.log('urls ' + urls.size);
        chrome.storage.local.set({tabsMementoMem: Array.from(urls)}, function() {
            console.log('urls saved');
        });
    });
}

 
var clearLocalstorage = function () {
    chrome.storage.local.clear();
}


chrome.runtime.onInstalled.addListener(function() {

    console.log("installed extension");
    chrome.storage.local.set({tabsMementoMem: []}, function() {
        console.log('Value is set');
    });
});

chrome.runtime.onStartup.addListener(function() {
    
    setInitialBadge("HEY");

    disableSaveButton();

    getMementos(function (mementos) {
        for (var urlValue of mementos.entries()) {
            chrome.tabs.create({url: urlValue, active: false}, setTabInMementos);
        }
    });
});
