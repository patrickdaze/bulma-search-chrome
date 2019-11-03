'use strict';

const appId = document.getElementById('appId');
const appKey = document.getElementById('appKey');
const reset = document.getElementById('reset');
const save = document.getElementById('save');
const savedMessage = document.getElementById('savedMessage');

chrome.storage.sync.get(['appId', 'appKey'], (settings) => {
  if(typeof settings.appId === 'string' && settings.appId.length > 1) {
    appId.value = settings.appId;
  }
  
  if(typeof settings.appKey === 'string' && settings.appKey.length > 1) {
    appKey.value = settings.appKey;
  }
});

function flashSaved() {
  savedMessage.className = '';
  setTimeout(() => {
    savedMessage.className = 'hide';
  }, 700)
}

save.addEventListener('click', () => {
  chrome.storage.sync.set({
    appId: appId.value,
    appKey: appKey.value,
  });

  flashSaved();
});

reset.addEventListener('click', () => {
  appId.value = '';
  appKey.value = '';
  chrome.storage.sync.set({
    appId: null,
    appKey: null,
  });

  flashSaved();
});