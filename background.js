// Content scripts can't close tabs or notify, so timer.js asks this worker to.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg.timesUp || !sender.tab) return;
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/128.png',
    title: `Time's up on ${msg.site}`,
    message: `Your ${msg.limit} limit is up, so the tab was closed.`,
  });
  chrome.tabs.remove(sender.tab.id);
});
