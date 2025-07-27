
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageTitle') {
    try {
      let title = document.title;
      
      const titleSelectors = [
        'h1[class*="conversation"]',
        '[data-testid="conversation-title"]',
        '.conversation-header h1',
        'h1:first-of-type',
        '.prose h1:first-of-type'
      ];
      
      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          title = element.textContent.trim();
          break;
        }
      }
      
      title = title
        .replace(/^ChatGPT\s*[-–—]?\s*/i, '')
        .replace(/\s*[-–—]\s*ChatGPT$/i, '')
        .trim();
      
      if (!title || title === 'ChatGPT' || title.length < 3) {
        const firstUserMessage = document.querySelector('[data-message-author-role="user"] .prose, .user-message .prose, [class*="user"] .markdown');
        if (firstUserMessage) {
          title = firstUserMessage.textContent.trim().substring(0, 50);
          if (title.length === 50) title += '...';
        }
      }
      
      if (!title || title.length < 3) {
        const now = new Date();
        title = `Conversation ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      }
      
      sendResponse({ title: title });
    } catch (error) {
      console.error('Error getting page title:', error);
      sendResponse({ title: `Conversation ${Date.now()}` });
    }
    return true; 
  }
});

function showSavedIndicator() {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10a37f;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: all 0.3s ease;
    transform: translateX(100%);
  `;
  indicator.textContent = '✅ Conversation saved!';
  
  document.body.appendChild(indicator);
  
  setTimeout(() => {
    indicator.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    indicator.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 300);
  }, 2500);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.conversations) {
    const currentURL = window.location.href;
    const newConversations = changes.conversations.newValue || [];
    const oldConversations = changes.conversations.oldValue || [];
    
    if (newConversations.length > oldConversations.length) {
      const hasCurrentURL = newConversations.some(conv => conv.url === currentURL);
      if (hasCurrentURL) {
        showSavedIndicator();
      }
    }
  }
});