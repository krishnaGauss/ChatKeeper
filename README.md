# 💬 ChatKeeper

> **Save, organize, and access your favorite ChatGPT conversations with ease**

ChatKeeper is a powerful Chrome extension that allows you to bookmark and manage your ChatGPT conversations with custom names. Never lose track of important discussions again!

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?style=for-the-badge&logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=for-the-badge)](https://github.com/yourusername/chatkeeper)

## ✨ Features

- 🔖 **Save conversations** with custom, memorable names
- 🎯 **Smart naming** - Auto-suggests names based on conversation content
- ✏️ **Rename anytime** - Edit conversation names whenever you want  
- 🚀 **Quick access** - One-click to open any saved conversation
- 📱 **Modern UI** - Clean, ChatGPT-inspired interface
- 🔄 **Sync across devices** - Uses Chrome's sync storage
- 💾 **Local storage** - Your data stays private and secure
- ⚡ **Lightning fast** - Instant save and retrieval

## 📸 Screenshots

### Main Interface
![ChatKeeper Main Interface](public/screenshot1.png)

*Clean, modern interface for managing your conversations*

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore) *(Coming Soon)*
2. Click "Add to Chrome"
3. Confirm the installation
4. Navigate to any ChatGPT conversation and start saving!

### Manual Installation (Developer Mode)
1. **Download the extension**
   ```bash
   git clone https://github.com/krishnagauss/chatkeeper.git
   cd chatkeeper
   ```

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `chatkeeper` folder
   - The extension will appear in your toolbar

4. **Start using ChatKeeper**
   - Navigate to [chat.openai.com](https://chat.openai.com) or [chatgpt.com](https://chatgpt.com)
   - Click the ChatKeeper icon in your toolbar
   - Start saving conversations!

## 📖 How to Use

### Saving a Conversation
1. Open any ChatGPT conversation
2. Click the ChatKeeper extension icon
3. Enter a memorable name (or use the suggested one)
4. Click "Save Current"
5. ✅ Done! Your conversation is saved

### Managing Saved Conversations
- **Open**: Click the conversation name to open in a new tab
- **Rename**: Click the edit (✏️) button and enter a new name  
- **Delete**: Click the delete (🗑️) button to remove permanently

### Quick Tips
- 💡 The extension automatically suggests names based on the conversation content
- 🔄 Use the refresh button to reload the current page info
- 📊 The counter shows how many conversations you've saved
- 🎯 Conversations are sorted by save date (newest first)

## 🛠️ Technical Details

### Built With
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No external dependencies
- **Chrome Storage API** - Syncs across your devices
- **Content Scripts** - Smart page content extraction

### File Structure
```
chatkeeper/
├── manifest.json          # Extension configuration
├── popup.html            # Main interface
├── popup.js              # UI logic and functionality  
├── content.js            # Page content extraction
```

### Permissions
- `storage` - Save your conversations locally
- `activeTab` - Access current ChatGPT page
- `host_permissions` - Work on ChatGPT domains only

### Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Opera 74+
- ✅ Brave
- ❌ Firefox (Manifest V3 required)

### Development Setup
1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatkeeper.git
   cd chatkeeper
   ```

2. **Load in Chrome for testing**
   - Follow the manual installation steps above
   - Make your changes
   - Reload the extension in `chrome://extensions/`
   - Enable Developer mode from top-right corner
   - Load Unpack and select the destination folder for this repo


## 📝 Changelog

### v1.0.0 (2025-01-XX)
- 🎉 Initial release
- ✨ Save and rename ChatGPT conversations
- 🎨 Modern, responsive UI design
- 🔄 Chrome sync storage support
- 💾 Smart conversation naming
- 🚀 Quick access to saved conversations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🤖 Inspired by the amazing conversations happening on ChatGPT
- 🎨 UI design influenced by modern web application patterns
- 👥 Thanks to the open-source community for tools and inspiration

Having issues or questions?

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/krishnagauss/chatkeeper/issues)
- 🐦 **X**: [@krishnagauss](https://twitter.com/krishnagauss)

---

<div align="center">

**⭐ If ChatKeeper helped you organize your conversations, please give us a star!**

Made with ❤️ for the ChatGPT community

[⬆ Back to Top](#-chatkeeper)

</div>