# Smooth Operator Agent Tools - TypeScript Library

This is the official TypeScript library implementation for Smooth Operator Agent Tools, a state-of-the-art toolkit for programmers developing Computer Use Agents on Windows systems.

## Overview

The Smooth Operator Agent Tools are a powerful toolkit that handles the complex tasks of interacting with the Windows Automation Tree and Playwright browser control, while providing advanced AI functions such as identifying UI elements through screenshots and textual descriptions.

This TypeScript library provides a convenient wrapper around the Smooth Operator Tools Server API, allowing you to easily integrate these capabilities into your Node.js applications.

## Installation

```bash
npm install smooth-operator-agent-tools
```

Or using Yarn:

```bash
yarn add smooth-operator-agent-tools
```

## Prerequisites

### Google Chrome

The Smooth Operator Agent Tools library requires Google Chrome (or a compatible Chromium-based browser) to be installed on the system for browser automation features to work.

## Usage

```typescript
import { SmoothOperatorClient } from 'smooth-operator-agent-tools';

// Initialize the client with your API key, get it for free at https://screengrasp.com/api.html
const client = new SmoothOperatorClient('YOUR_API_KEY');

// Start the Server - this takes a moment (especially the first time)
await client.startServer();

// Take a screenshot
const screenshot = await client.screenshot.take();

// Get system overview
const overview = await client.system.getOverview();

// Perform a mouse click
await client.mouse.click(500, 300);

// Find and click a UI element by description
await client.mouse.clickByDescription('Submit button');

// Type text
await client.keyboard.type('Hello, world!');

// Control Chrome browser
await client.chrome.openChrome('https://www.example.com');
await client.chrome.getDom();

// Clean up when done
client.dispose();
```

## Features

- **Screenshot and Analysis**: Capture screenshots and analyze UI elements
- **Mouse Control**: Precise mouse operations using coordinates or AI-powered element detection
- **Keyboard Input**: Type text and send key combinations
- **Chrome Browser Control**: Navigate, interact with elements, and execute JavaScript
- **Windows Automation**: Interact with Windows applications and UI elements
- **System Operations**: Open applications and manage system state
- **Server Management**: Automatically handles the Smooth Operator Server executable

## Platform Support

- **Windows**: Full support for all features

## Documentation

For detailed API documentation, visit:

*   **[Usage Guide](docs/usage_guide.md):** Detailed examples and explanations for common use cases.
*   **[Example Project](https://github.com/fstandhartinger/smooth-operator-example-typescript):** Download, follow step by step instructions and have your first automation running in mintes.
*   **[Documentation](https://smooth-operator.online/agent-tools-api-docs/toolserverdocs):** Detailed documentation of all the API endpoints of the server that is doing the work internally.


## License

This project is licensed under the MIT License - see the LICENSE file for details.
