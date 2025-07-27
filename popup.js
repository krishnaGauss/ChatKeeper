// DOM elements
const saveBtn = document.getElementById('saveBtn');
const refreshBtn = document.getElementById('refreshBtn');
const conversationName = document.getElementById('conversationName');
const conversationList = document.getElementById('conversationList');
const conversationCount = document.getElementById('conversationCount');
const currentPage = document.getElementById('currentPage');
const statusMessage = document.getElementById('statusMessage');
const notChatGPT = document.getElementById('notChatGPT');
const mainContent = document.getElementById('mainContent');

let currentTab = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await getCurrentTab();
  await loadConversations();
  setupEventListeners();
});

// Get current active tab
async function getCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    
    if (isChatGPTPage(tab.url)) {
      mainContent.style.display = 'block';
      notChatGPT.style.display = 'none';
      currentPage.textContent = `Current: ${tab.url}`;
      
      // Extract conversation ID and suggest a name
      const conversationId = extractConversationId(tab.url);
      if (conversationId) {
        // Try to get the page title for a better default name
        try {
          const result = await chrome.tabs.sendMessage(tab.id, { action: 'getPageTitle' });
          if (result && result.title) {
            conversationName.value = result.title.replace('ChatGPT', '').trim() || `Conversation ${Date.now()}`;
          }
        } catch (e) {
          conversationName.value = `Conversation ${Date.now()}`;
        }
      }
    } else {
      mainContent.style.display = 'none';
      notChatGPT.style.display = 'block';
    }
  } catch (error) {
    console.error('Error getting current tab:', error);
    showStatus('Error accessing current tab', 'error');
  }
}

// Check if URL is a ChatGPT page
function isChatGPTPage(url) {
  return url && (url.includes('chat.openai.com') || url.includes('chatgpt.com'));
}

// Extract conversation ID from URL
function extractConversationId(url) {
  const match = url.match(/\/c\/([a-f0-9-]+)/);
  return match ? match[1] : null;
}

// Setup event listeners
function setupEventListeners() {
  saveBtn.addEventListener('click', saveConversation);
  refreshBtn.addEventListener('click', () => {
    getCurrentTab();
    loadConversations();
  });
  
  conversationName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveConversation();
    }
  });
}

// Save current conversation
async function saveConversation() {
  if (!currentTab || !isChatGPTPage(currentTab.url)) {
    showStatus('Please navigate to a ChatGPT conversation', 'error');
    return;
  }

  const name = conversationName.value.trim();
  if (!name) {
    showStatus('Please enter a name for the conversation', 'error');
    conversationName.focus();
    return;
  }

  try {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span><span>Saving...</span>';

    // Get existing conversations
    const result = await chrome.storage.sync.get(['conversations']);
    const conversations = result.conversations || [];

    // Check if this URL is already saved
    const existingIndex = conversations.findIndex(conv => conv.url === currentTab.url);
    
    const conversation = {
      id: Date.now().toString(),
      name: name,
      url: currentTab.url,
      savedAt: new Date().toISOString(),
      conversationId: extractConversationId(currentTab.url)
    };

    if (existingIndex >= 0) {
      // Update existing conversation
      conversations[existingIndex] = { ...conversations[existingIndex], ...conversation };
      showStatus('Conversation updated successfully!', 'success');
    } else {
      // Add new conversation
      conversations.unshift(conversation);
      showStatus('Conversation saved successfully!', 'success');
    }

    // Save to storage
    await chrome.storage.sync.set({ conversations });
    
    // Reload the list
    await loadConversations();
    
    // Clear the input
    conversationName.value = '';

  } catch (error) {
    console.error('Error saving conversation:', error);
    showStatus('Error saving conversation', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>💾</span><span>Save Current</span>';
  }
}

// Load and display conversations
async function loadConversations() {
  try {
    const result = await chrome.storage.sync.get(['conversations']);
    const conversations = result.conversations || [];
    
    conversationCount.textContent = conversations.length;
    
    if (conversations.length === 0) {
      conversationList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <div class="empty-title">No conversations saved yet</div>
          <div class="empty-description">
            Save your first ChatGPT conversation to get started!<br>
            Perfect for keeping track of useful discussions.
          </div>
        </div>
      `;
      return;
    }

    conversationList.innerHTML = conversations.map(conv => `
      <div class="conversation-item" data-id="${conv.id}">
        <div class="conversation-info">
          <a href="${conv.url}" target="_blank" class="conversation-name" title="Open conversation">
            ${escapeHtml(conv.name)}
          </a>
          <div class="conversation-meta">
            <span class="conversation-date">${new Date(conv.savedAt).toLocaleDateString()}</span>
            <span class="conversation-url">${truncateUrl(conv.url, 35)}</span>
          </div>
        </div>
        <div class="conversation-actions">
          <button class="btn btn-secondary btn-edit" title="Rename" data-id="${conv.id}">✏️</button>
          <button class="btn btn-danger btn-delete" title="Delete" data-id="${conv.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    // Add event listeners for edit and delete buttons
    setupConversationActions();

  } catch (error) {
    console.error('Error loading conversations:', error);
    showStatus('Error loading conversations', 'error');
  }
}

// Setup conversation action buttons
function setupConversationActions() {
  // Edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const id = btn.getAttribute('data-id');
      const conversationItem = btn.closest('.conversation-item');
      const nameElement = conversationItem.querySelector('.conversation-name');
      const currentName = nameElement.textContent.trim();
      
      const newName = prompt('Enter new name:', currentName);
      if (newName && newName.trim() && newName.trim() !== currentName) {
        await renameConversation(id, newName.trim());
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const id = btn.getAttribute('data-id');
      const conversationItem = btn.closest('.conversation-item');
      const name = conversationItem.querySelector('.conversation-name').textContent.trim();
      
      if (confirm(`Delete "${name}"?`)) {
        await deleteConversation(id);
      }
    });
  });
}

// Rename conversation
async function renameConversation(id, newName) {
  try {
    const result = await chrome.storage.sync.get(['conversations']);
    const conversations = result.conversations || [];
    
    const index = conversations.findIndex(conv => conv.id === id);
    if (index >= 0) {
      conversations[index].name = newName;
      await chrome.storage.sync.set({ conversations });
      await loadConversations();
      showStatus('Conversation renamed successfully!', 'success');
    }
  } catch (error) {
    console.error('Error renaming conversation:', error);
    showStatus('Error renaming conversation', 'error');
  }
}

// Delete conversation
async function deleteConversation(id) {
  try {
    const result = await chrome.storage.sync.get(['conversations']);
    const conversations = result.conversations || [];
    
    const filtered = conversations.filter(conv => conv.id !== id);
    await chrome.storage.sync.set({ conversations: filtered });
    await loadConversations();
    showStatus('Conversation deleted', 'success');
  } catch (error) {
    console.error('Error deleting conversation:', error);
    showStatus('Error deleting conversation', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
  setTimeout(() => {
    if (statusMessage.innerHTML.includes(message)) {
      statusMessage.innerHTML = '';
    }
  }, 3000);
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncateUrl(url, maxLength = 50) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}