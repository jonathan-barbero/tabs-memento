
var getMementos = function (callback) {
    chrome.storage.local.get(['tabsMementoMem'], function (result) {
        console.log('getMementos');
        console.log(result['tabsMementoMem']);
        if(!result['tabsMementoMem']) {
            var mementos = {};
            chrome.storage.local.set({tabsMementoMem: mementos});
            callback(mementos);
        } else {
            callback(result['tabsMementoMem']);
        }
    });
}
 
var clearLocalstorage = function () {
    chrome.storage.local.clear();
}

var setTabInMementos = function (tab) {
    
    if(!tab || !tab.id || !tab.url) {
        console.log('tab not stored, id:'+tab.id+' url:'+tab.url);
        return;
    }

    getMementos(function (mementos) {
        mementos[tab.id] = tab.url;

        chrome.storage.local.set({tabsMementoMem: mementos}, function() {
            console.log('mementos actualizados');
        });
    });
}

var deleteTabInMementosById = function (tabId) {
    
    if(!tabId) {
        console.log('tab Id empty');
        return;
    }

    getMementos(function (mementos) {
        delete mementos[tabId];

        chrome.storage.local.set({tabsMementoMem: mementos}, function() {
            console.log('Value is set');
        });
    });
}

chrome.runtime.onInstalled.addListener(function() {

    console.log("installed");
    chrome.storage.local.set({tabsMementoMem: {}}, function() {
        console.log('Value is set');
    });

    /*
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
      });

      chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
    
      */
});

chrome.runtime.onStartup.addListener(function() {
    console.log("startup");
    getMementos(function (mementos) {
        clearLocalstorage();
        for (var urlValue of mementos.values()) {
            chrome.tabs.create({url: urlValue, active: false}, setTabInMementos);
        }
    });
});

chrome.runtime.onSuspend.addListener(function() {
    console.log("Unloading.");

    chrome.tabs.getAll({populate: true}, function(window_list) {
        for(var i=0;i<window_list.length;i++) {
            for(tab in window_list[i].tabs) {
                console.log(tab.url);
                setTabInMementos(tab);
            }
        } 
    });
});


chrome.tabs.onCreated.addListener(function(tab) {
    console.log(
        'tabs.onCreated -- window: ' + tab.windowId + ' tab: ' + tab.id +
        ' title: ' + tab.title + ' index ' + tab.index + ' url ' + tab.url);
    setTabInMementos(tab);
});
/*
chrome.tabs.onAttached.addListener(function(tabId, props) {
    console.log(
        'tabs.onAttached -- window: ' + props.newWindowId + ' tab: ' + tabId +
        ' index ' + props.newPosition);
});

chrome.tabs.onMoved.addListener(function(tabId, props) {
    console.log(
        'tabs.onMoved -- window: ' + props.windowId + ' tab: ' + tabId +
        ' from ' + props.fromIndex + ' to ' +  props.toIndex);
});
*/
chrome.tabs.onUpdated.addListener(function(tabId, props, tab) {
    console.log(
        'tabs.onUpdated -- tab: ' + tabId + ' status ' + props.status +
        ' url ' + props.url);
    setTabInMementos(tab);
});
/*
chrome.tabs.onDetached.addListener(function(tabId, props) {
    console.log(
        'tabs.onDetached -- window: ' + props.oldWindowId + ' tab: ' + tabId +
        ' index ' + props.oldPosition);
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
    console.log(
        'tabs.onSelectionChanged -- window: ' + props.windowId + ' tab: ' +
        tabId);
});
*/
chrome.tabs.onRemoved.addListener(function(tabId) {
    console.log('tabs.onRemoved -- tab: ' + tabId);
    deleteTabInMementosById(tabId);
});
