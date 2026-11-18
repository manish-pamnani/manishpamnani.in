---
title: "Chrome Extensions: Zero to Hero (Cape Strictly Prohibited) - 2026 Beginner Crash Course (Part 1)"
slug: "chrome-extensions-zero-to-hero-part-1"
date: 2026-11-05
description: "Build your first Chrome extension from scratch: a Manifest V3 text highlighter with a popup and content script, loaded and tested in Chrome in under 30 minutes."
---

Ever stared at your Chrome Browser, thinking, “Man, if only I could make you do exactly what I want”? Picture this: you’re scrolling through endless Chrome tabs, annoyed by extensive ads, wishing for a button to highlight key text on any webpage or download videos from niche platforms like X/Threads? Or maybe you’re a fellow developer like me, building no-code tools with the help of React? Well, welcome, fellow Code warriors; grab your favorite IDE because today we’re going from understanding the basics of Chrome Extensions to building and running your first creation in under 30 minutes. No prior training required, and definitely *no capes allowed*; they’d just get caught in your keyboard.

## Prerequisites

Before we jump in directly and give you your first line of code, you will need a few basic things to strengthen your understanding. No expensive tools or hard skills.

- **Your favorite IDE:** It can be Cursor, VS Code, or JetBrains whatever you like feel free to have it open (I know it’s an obvious one, but you’ve got to start from somewhere 🤷)
- **Chrome Browser:** Let me guess, you saw it coming already? Right.
- **Basic HTML and JS knowledge:** This is something that helps you speed up the process and helps you understand what we’re doing with the code that we are about to write.
- **A [Chrome Web Store account](https://developer.chrome.com/docs/webstore/register):** Optional for now. Costs $5 once. You would need to set it up once only to publish your Extension.

While it may look like it's a lot of stuff, believe me it isn’t. Once you get used to it, you will be spinning up the extensions faster than ever.

Create a new folder on your desktop. Name it `text-glow-extension` (or any weird name you’re thinking). Open it in the Code Editor. Now, you have an empty project waiting for you to sprinkle your magic on.

In the next section we will see how to make the `manifest.json` file (the main file that tells Chrome what your extension does).

## Step 1: Create manifest.json

The first file that we’re going to make is called [`manifest.json`](https://developer.chrome.com/docs/extensions/reference/manifest), which is also called the brain of your extension. It basically tells Chrome what your extension is about and what it does. To make it, just create a new file named `manifest.json` and copy this code into it:

```json
{
  "manifest_version": 3,
  "name": "Text Glow - Highlight Magic",
  "version": "1.0",
  "description": "Click to make selected text glow bright green!",
  "permissions": ["activeTab"],
  "action": {
    "default_popup": "popup.html"
  }
}
```

What exactly does this do?

- `manifest_version: 3` - Uses [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), the current version of Chrome’s extension rules
- `name` - Shows in Chrome’s extension menu
- [`permissions: ["activeTab"]`](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) - Lets it touch only the page you’re on (safe)
- [`action`](https://developer.chrome.com/docs/extensions/reference/api/action) - Creates a pop-up button when you click the extension icon

You’ll notice there are no icons in here yet. We’ll add them later, and we’re leaving them out on purpose: if the manifest points to image files that don’t exist, Chrome refuses to load the extension.

Save the file. Quick win. Setting up this file must be easy and perfect, as one wrong comma will break anything.

One more thing to note here is that, since this is a `.json` file, no comments are allowed therein.

Next up, we’ll build the pop-up button users see when they click your extension icon.

## Step 2: Build the Popup

The popup is what users see when they click your extension icon. It’s a small window with a button. Simple, efficient, and clean.

Simply, create two new files in your `text-glow-extension` folder:

First: `popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 200px;
      padding: 15px;
      font-family: Arial;
      text-align: center;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover { background: #45a049; }
    #status { margin-top: 10px; font-size: 14px; }
  </style>
</head>
<body>
  <h3>✨ Text Glow</h3>
  <button id="glowBtn">Make Text Glow!</button>
  <div id="status"></div>
  <script src="popup.js"></script>
</body>
</html>
```

`popup.js`:

```javascript
document.getElementById('glowBtn').addEventListener('click', () => {
  // Send message to content script on current tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "glow"}, (response) => {
      const status = document.getElementById('status');
      if (chrome.runtime.lastError) {
        status.textContent = 'Page blocked. Refresh the tab and try again';
        status.style.color = 'orange';
      } else if (!response.success) {
        status.textContent = 'Select some text first';
        status.style.color = 'orange';
      } else {
        status.textContent = 'Text glowing! ✨';
        status.style.color = 'green';
      }
    });
  });
});
```

What happens here?

- `popup.html` shows a green button with nice styling. The `<meta charset="utf-8">` line matters too: without it, the ✨ emoji shows up as garbled characters.
- `popup.js` sends a “glow” message to the active webpage when clicked
- Shows “Text glowing!” or an error message after clicking

Save both files. Your pop-up is ready to go.

There shouldn’t be any icons yet, but the button works perfectly. Next, we create the magic that actually highlights text on any webpage.

## Step 3: Content Script Magic

This is where the actual magic happens. The [content script](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) runs on the web pages. It finds selected text and makes it glow bright green (like a green lantern).

Create a new file named `content.js` in your `text-glow-extension` folder.

```javascript
// Wrap every selected piece of text in its own copy of the highlight span
function wrapTextNodes(range, highlight) {
  const { startContainer, startOffset, endContainer, endOffset } = range;
  const root = range.commonAncestorContainer;
  const nodes = [];

  if (root.nodeType === Node.TEXT_NODE) {
    nodes.push(root);
  } else {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const tag = node.parentElement.tagName;
      if (range.intersectsNode(node) && node.textContent.trim() && tag !== 'SCRIPT' && tag !== 'STYLE') {
        nodes.push(node);
      }
    }
  }

  for (const node of nodes) {
    const start = node === startContainer ? startOffset : 0;
    const end = node === endContainer ? endOffset : node.length;
    if (start >= end) continue;

    if (end < node.length) node.splitText(end);
    const piece = start > 0 ? node.splitText(start) : node;
    const span = highlight.cloneNode();
    piece.parentNode.insertBefore(span, piece);
    span.appendChild(piece);
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "glow") {
    // Get selected text
    const selection = window.getSelection();

    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);

      // Create highlight wrapper
      const highlight = document.createElement('span');
      highlight.style.cssText = `
        color: #000;
        background: linear-gradient(90deg, #ffeb3b, #4caf50, #ffeb3b);
        background-size: 200% 100%;
        animation: glow 2s ease-in-out infinite alternate;
        padding: 2px 4px;
        border-radius: 3px;
        box-shadow: 0 0 10px rgba(255, 235, 59, 0.8);
      `;

      // Add glowing animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes glow {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }
      `;
      document.head.appendChild(style);

      // Wrap selected text
      wrapTextNodes(range, highlight);
      sendResponse({success: true});
    } else {
      sendResponse({success: false});
    }
  }
});
```

That `wrapTextNodes` function looks like the scariest part, but the idea is simple. Real web pages split their text across lots of small elements (a bold word here, a link there), so a single selection often touches several of them. The browser’s built-in `range.surroundContents()` throws an error when that happens, which would make your extension fail on sites like Google. So instead, we walk through every piece of text in the selection and give each one its own glowing span.

Don’t forget! Update your `manifest.json`. Add this inside the JSON (after the `action` section), and remember to put a comma after the `action` section’s closing brace:

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }
]
```

What this does:

- Listens for a “glow” message from the pop-up button
- Grabs whatever text you highlighted on the page
- Wraps each piece of it in a glowing green/yellow animated span
- Works on ANY website (that’s the [`<all_urls>`](https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns) power)

Your folder now has:

- `manifest.json` (updated)
- `popup.html`
- `popup.js`
- `content.js`

Save everything. The brain, button, and magic are ready. Load it in Chrome and watch it glow!

## Step 4: Test in Chrome

Your first extension is now ready! Time to see it working in your Chrome Browser (and a couple of other supported ones). This should not take more than 2 minutes.

Here’s how you can set up your extensions step by step:

- Open the Chrome extensions page by typing `chrome://extensions` in your address bar and hitting Enter.
- Turn on the Developer mode option at the top right corner.
- Load your extension by clicking “Load unpacked”, finding your `text-glow-extension` folder, selecting it, and clicking “Select Folder”
- Find your extension by looking for “Text Glow - Highlight Magic” in the list. It will have no icon yet (we will fix it later)

Test it now by:

- Going to any webpage (like [google.com](https://google.com) or this blog) and selecting some text with your mouse. If the page was already open before you loaded the extension, refresh it first.
- Check your extension icon (pin yours by clicking on puzzle icon)
- Click the “Make Text Glow!” button
- Watch the text glow green with animation

If it works (which it should), then a popup should open saying “Text glowing!” and your text will sparkle (a lot, literally!)

If for some reason, you bump into some error, here are some of the common fixes you could try before filling up my comments section:

- **No popup?** Reload the extension while providing the necessary permissions
- **“Page blocked”?** Refresh the tab first, since pages opened before you loaded the extension don’t have the content script yet. If that doesn’t help, the page may not allow extensions (Chrome’s own `chrome://` pages and the Chrome Web Store don’t). Try on some neutral sites like [wikipedia.org](https://wikipedia.org)
- **“Select some text first”?** Make sure to select appropriate text BEFORE clicking the button.
- **Errors?** Right-click the extension icon -> “Inspect popup” -> check Console tab

**Pro tip:** Changes to files? Always click “Reload” on the extensions page. Instant update.

Hurray!! Your first extension has gone live (not literally)! It works on almost ANY website. No server. No build tools. Just pure magic.

In Part 2, we will transform this basic-looking extension to a professional one with icons and prepare it for the [Chrome Web Store](https://chromewebstore.google.com/).
