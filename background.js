chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.includes('medium.com') && details.url.includes('/edit')) {
    // Execute the content script in the new page
    console.log('Injecting content script');

    // execute main.js
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['tooltip.js']
    });
  }
});
