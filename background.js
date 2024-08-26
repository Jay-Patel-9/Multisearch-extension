// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createOrUpdateGroup') {
    console.log('Received message to create or update group with tab IDs:', message.tabIds);
    createOrUpdateGroup(message.tabIds);
  }
});

function createOrUpdateGroup(tabIds) {
  console.log('Attempting to create or update tab group with tab IDs:', tabIds);

  chrome.tabGroups.query({}, (groups) => {
    let existingGroup = groups.find(group => group.title === 'MultiSearch');
    
    if (existingGroup) {
      console.log('Group "MultiSearch" found with ID:', existingGroup.id);
      chrome.tabs.group({ groupId: existingGroup.id, tabIds: tabIds }, () => {
        console.log('Tabs added to existing group.');
      });
    } else {
      console.log('No existing group found. Creating a new group.');
      chrome.tabGroups.create({ title: 'MultiSearch' }, (group) => {
        console.log('Created new group with ID:', group.id);
        chrome.tabs.group({ groupId: group.id, tabIds: tabIds }, () => {
          console.log('Tabs added to new group.');
        });
      });
    }
  });
}

