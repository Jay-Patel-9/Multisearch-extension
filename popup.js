document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchQuery').value;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  if (query && checkboxes.length > 0) {
    const searchEngines = Array.from(checkboxes).map(cb => cb.value + encodeURIComponent(query));
    
    let tabIds = [];
    let tabsOpened = 0;

    // Create tabs and collect their IDs
    searchEngines.forEach((url) => {
      chrome.tabs.create({ url }, (tab) => {
        tabIds.push(tab.id);
        tabsOpened++;

        // When all tabs are created, send a message to the background script
        if (tabsOpened === searchEngines.length) {
          chrome.runtime.sendMessage({ action: 'createOrUpdateGroup', tabIds: tabIds });
        }
      });
    });
  } else {
    alert('Please enter a search term and select at least one search engine.');
  }
});

