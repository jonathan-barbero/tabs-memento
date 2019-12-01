// UI methods

let saveButton = document.getElementById('saveButton');

saveButton.onclick = function(element) {
    
    removeBadge();
    saveTabsIntoMemento();
};

let recoverButton = document.getElementById('recoverButton');

recoverButton.onclick = function(element) {
    
    removeBadge();
    loadMementoIntoTabs();
};