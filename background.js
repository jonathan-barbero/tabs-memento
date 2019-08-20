chrome.runtime.onInstalled.addListener(function() {
    console.log("installed");
    chrome.storage.local.set({'tabs.memento.mem': {}}, function() {
        console.log('Value is set to ');
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

chrome.runtime.onSuspend.addListener(function() {
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
});


chrome.tabs.onCreated.addListener(function(tab) {
    console.log(
        'tabs.onCreated -- window: ' + tab.windowId + ' tab: ' + tab.id +
        ' title: ' + tab.title + ' index ' + tab.index + ' url ' + tab.url);
});

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

chrome.tabs.onUpdated.addListener(function(tabId, props) {
    console.log(
        'tabs.onUpdated -- tab: ' + tabId + ' status ' + props.status +
        ' url ' + props.url);
});

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

chrome.tabs.onRemoved.addListener(function(tabId) {
    console.log('tabs.onRemoved -- tab: ' + tabId);
});