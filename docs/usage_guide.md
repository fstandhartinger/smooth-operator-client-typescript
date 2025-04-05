# Installation and Usage Guide for the Smooth Operator Agent Tools TypeScript Library

## Installation

### Using npm

```bash
npm install smooth-operator-agent-tools
```

### Using Yarn

```bash
yarn add smooth-operator-agent-tools
```

This will install the library and its dependencies. The server executable will be automatically downloaded and managed when you first initialize the client or call `startServer()`.

## Basic Usage

### Initializing the Client

```typescript
import { SmoothOperatorClient, MechanismType } from 'smooth-operator-agent-tools';
import { ActionResponse, ScreenshotResponse, OverviewResponse, WindowDetailInfosDTO, SimpleResponse, CSharpCodeResponse, ChromeTabDetails, ChromeScriptResponse } from 'smooth-operator-agent-tools/dist/models/models'; // Adjust path if needed

async function main() {
    // Initialize the client with your API key
    // Get API key for free at https://screengrasp.com/api.html
    const client = new SmoothOperatorClient('YOUR_API_KEY');

    try {
        // Start the server (automatically downloads/installs if needed)
        await client.startServer();
        console.log('Server started.');

        // Use the client here...
        // Example: Get system overview
        const overview: OverviewResponse = await client.system.getOverview();
        console.log(`Got overview. Focused window: ${overview?.focusInfo?.focusedElementParentWindow?.title}`);

    } catch (error: any) {
        console.error(`An error occurred: ${error.message}`);
    } finally {
        // Stop the server and dispose of the client
        await client.dispose();
        console.log('Client disposed and server stopped.');
    }
}

main();
```

The `dispose()` method automatically calls `stopServer()`.

### Taking Screenshots

```typescript
// Take a screenshot - returns image data
try {
    const screenshot: ScreenshotResponse = await client.screenshot.take();
    if (screenshot.success) {
        // Access the screenshot data
        const imageBase64: string = screenshot.imageBase64;
        console.log(`Screenshot taken successfully at ${screenshot.timestamp}. Base64 length: ${imageBase64.length}`);
        // Note: To get bytes, you'd decode the base64 string:
        // const imageBuffer = Buffer.from(imageBase64, 'base64');
        // console.log(`Byte length: ${imageBuffer.length}`);
    } else {
        console.log(`Failed to take screenshot: ${screenshot.message}`);
    }
} catch (error: any) {
    console.error(`Error taking screenshot: ${error.message}`);
}
```

### Mouse Operations

```typescript
// Click at coordinates
let response: ActionResponse = await client.mouse.click(500, 300);
console.log(`Click success: ${response.success}`);

// Right-click at coordinates
response = await client.mouse.rightClick(500, 300);
console.log(`Right-click success: ${response.success}`);

// Double-click at coordinates
response = await client.mouse.doubleClick(500, 300);
console.log(`Double-click success: ${response.success}`);

// Drag from one position to another
response = await client.mouse.drag(100, 100, 200, 200);
console.log(`Drag success: ${response.success}`);

// Scroll at coordinates
response = await client.mouse.scroll(500, 300, 5); // Scroll down 5 clicks
console.log(`Scroll down success: ${response.success}`);

response = await client.mouse.scroll(500, 300, -5); // Scroll up 5 clicks
console.log(`Scroll up success: ${response.success}`);
```

### AI-Powered UI Interaction (Mouse)

```typescript
// Find and click a UI element by description
response = await client.mouse.clickByDescription('the Submit button');
console.log(`Click by description success: ${response.success} - ${response.message}`);

// Find and right-click a UI element by description
response = await client.mouse.rightClickByDescription('the Context menu icon');
console.log(`Right-click by description success: ${response.success} - ${response.message}`);

// Find and double-click a UI element by description
response = await client.mouse.doubleClickByDescription('the File icon');
console.log(`Double-click by description success: ${response.success} - ${response.message}`);

// Drag from one element to another by description
response = await client.mouse.dragByDescription('the invoice pdf file', 'the "invoices" folder');
console.log(`Drag by description success: ${response.success} - ${response.message}`);
```

### Keyboard Operations

```typescript
// Type text
response = await client.keyboard.type('Hello, world!');
console.log(`Type success: ${response.success}`);

// Press a key combination
response = await client.keyboard.press('Ctrl+C');
console.log(`Press Ctrl+C success: ${response.success}`);
response = await client.keyboard.press('Alt+F4');
console.log(`Press Alt+F4 success: ${response.success}`);

// Type text in a UI element (identified by description)
response = await client.keyboard.typeAtElement('the Username field', 'user123');
console.log(`Type at element success: ${response.success} - ${response.message}`);
```

### Chrome Browser Control

```typescript
// Open Chrome browser to a specific URL
const openResponse: SimpleResponse = await client.chrome.openChrome('https://www.example.com');
console.log(`Open Chrome success: ${openResponse.success}`);

// Navigate to a different URL
const navigateResponse: ActionResponse = await client.chrome.navigate('https://www.google.com');
console.log(`Navigate success: ${navigateResponse.success}`);

// Get information about the current tab
// Can be used to find likely interactable elements in the page
// Marks all html elements with robust CSS selectors for use
// in functions like clickElement() or simulateInput()
// Response can also be passed to LLM to pick the right selector
const tabDetails: ChromeTabDetails = await client.chrome.explainCurrentTab();
console.log(`Explained tab: ${tabDetails.title}. Found ${tabDetails.elements?.length} elements.`);
// Example: Find the selector for the search button (hypothetical)
// const searchButtonSelector = tabDetails.elements?.find(el => el["innerText"]?.includes("Search"))?.cssSelector;

// Click an element using CSS selector (replace with actual selector)
const firstElementSelector = tabDetails.elements?.[0]?.cssSelector;
if (firstElementSelector) {
    const clickElementResponse: ActionResponse = await client.chrome.clickElement(firstElementSelector);
    console.log(`Click element success: ${clickElementResponse.success}`);
}

// Input text into a form field (replace with actual selector)
const secondElementSelector = tabDetails.elements?.[1]?.cssSelector;
if (secondElementSelector) {
    const inputResponse: ActionResponse = await client.chrome.simulateInput(secondElementSelector, 'search query');
    console.log(`Simulate input success: ${inputResponse.success}`);
}

// Execute JavaScript
const scriptResponse: ChromeScriptResponse = await client.chrome.executeScript('return document.title;');
if (scriptResponse.success) {
    console.log(`Executed script. Result: ${scriptResponse.result}`);
}

// Generate and execute JavaScript based on a description
const genScriptResponse: ChromeScriptResponse = await client.chrome.generateAndExecuteScript('Extract all links from the page');
if (genScriptResponse.success) {
    console.log(`Generated and executed script. Result: ${genScriptResponse.result}`);
}
```

### System Operations

```typescript
// Get system overview
// Contains list of windows, available apps on the system,
// detailed infos about the currently focused ui element and window.
// Can be used as a source of ui element ids for use in automation functions
// like invoke() (=click) or setValue().
// Can be used as a source of window ids for getWindowDetails(windowId).
// Consider sending the JSON serialized form of this result to a LLM, together
// with a task description, the form is chosen to be LLM friendly, the LLM
// should be able to find the relevant ui element ids and windows ids like that.
const overview: OverviewResponse = await client.system.getOverview();
console.log(`System overview obtained. Found ${overview?.windows?.length} windows.`);

// Open an application (e.g., Notepad)
const openAppResponse: SimpleResponse = await client.system.openApplication('notepad');
console.log(`Open Notepad success: ${openAppResponse.success}`);

// Get window details - contains the ui automation tree of elements.
// Consider using the response in a LLM prompt.
const windowId: string | undefined = overview?.windows?.[0]?.id; // Get ID of the first window
if (windowId) {
    const windowDetails: WindowDetailInfosDTO = await client.system.getWindowDetails(windowId);
    console.log(`Got details for window ID ${windowId}. Root element: ${windowDetails?.userInterfaceElements?.name}`);
    // You can serialize windowDetails to JSON using JSON.stringify(windowDetails)
    // Note: The default toJSON for ControlDTO omits parent to avoid cycles.
    // console.log(JSON.stringify(windowDetails, null, 2));
}
```

### Windows Automation

```typescript
// Need an element ID first, e.g., from getOverview or getWindowDetails
const overviewForAutomation: OverviewResponse = await client.system.getOverview();
const targetElement = overviewForAutomation?.focusInfo?.focusedElement; // Example: Use focused element
const elementId: string | undefined = targetElement?.id;
const windowIdForAutomation: string | undefined = overviewForAutomation?.focusInfo?.focusedElementParentWindow?.id;

if (elementId) {
    // Click (Invoke) a UI element by its ID
    if (targetElement?.supportsInvoke) {
        const invokeResponse: SimpleResponse = await client.automation.invoke(elementId);
        console.log(`Invoke element success: ${invokeResponse.success}`);
    }

    // Type text in a UI element by its ID
    if (targetElement?.supportsSetValue) {
        const setValueResponse: SimpleResponse = await client.automation.setValue(elementId, 'some text');
        console.log(`Set value success: ${setValueResponse.success}`);
    }
}

if (windowIdForAutomation) {
    // Bring a window to the front
    const bringToFrontResponse: SimpleResponse = await client.automation.bringToFront(windowIdForAutomation);
    console.log(`Bring to front success: ${bringToFrontResponse.success}`);
}
```

### Code Execution

```typescript
// Execute specific C# code
const execResponse: CSharpCodeResponse = await client.code.executeCSharp('return System.DateTime.Now.ToString();');
if (execResponse.success) {
    console.log(`Executed C#. Result: ${execResponse.result}`);
}

// Generate and execute C# code based on a description - example 1
const genExecResponse1: CSharpCodeResponse = await client.code.generateAndExecuteCSharp('Calculate the factorial of 5');
if (genExecResponse1.success) {
    console.log(`Generated/Executed Factorial. Result: ${genExecResponse1.result}`);
}

// Generate and execute C# code based on a description - example 2
const genExecResponse2: CSharpCodeResponse = await client.code.generateAndExecuteCSharp('Return content of the biggest file in folder C:\\temp');
if (genExecResponse2.success) {
    console.log(`Generated/Executed Find Biggest File. Result: ${genExecResponse2.result}`);
} else {
    console.error(`Failed Generate/Execute Find Biggest File: ${genExecResponse2.message}`);
}

// Generate and execute C# code based on a description - example 3
const genExecResponse3: CSharpCodeResponse = await client.code.generateAndExecuteCSharp('Connect to Outlook via Interop and return subject and date of the latest email from \'test@example.com\'');
if (genExecResponse3.success) {
    console.log(`Generated/Executed Outlook Email. Result: ${genExecResponse3.result}`);
} else {
     console.error(`Failed Generate/Execute Outlook Email: ${genExecResponse3.message}`);
}
```

## Advanced Usage

### Using Different AI Mechanisms

For AI-vision powered operations (e.g., `clickByDescription`), you can specify different AI mechanisms provided by ScreenGrasp.com:

```typescript
// Use a different AI mechanism (e.g., OpenAI's model)
const clickDescResponse: ActionResponse = await client.mouse.clickByDescription(
    'the Submit button',
    MechanismType.OpenAIComputerUse // Specify the desired mechanism
);
console.log(`Click by description (OpenAI) success: ${clickDescResponse.success} - ${clickDescResponse.message}`);
```

Refer to the `MechanismType` enum in `smooth-operator-agent-tools/dist/models/models` for available options.

### Converting Responses to JSON - Use LLMs to Analyze

Most response model classes have a `toJSON()` method. You can use `JSON.stringify()` to convert these objects to a formatted JSON string. This is highly recommended for passing state information to Large Language Models (LLMs) for analysis or decision-making.

```typescript
// Get a response, e.g., system overview
const overview: OverviewResponse = await client.system.getOverview();

// Convert to JSON string (using the custom toJSON methods)
// Note: ControlDTO.toJSON deliberately omits parent to avoid circular references.
const jsonStr = JSON.stringify(overview, null, 2); // 2-space indentation

// Use the JSON string (e.g., pass it to a language model)
if (jsonStr) {
    console.log('\n--- System Overview JSON ---');
    console.log(jsonStr);
    console.log('--- End System Overview JSON ---\n');

    // Example prompt idea for an LLM:
    // const prompt = `Given the following system overview:\n${jsonStr}\n\nIdentify the element ID of the 'Save' button in the focused window.`;
    // Send prompt to LLM API...
}
```

It is a recommended pattern to use these JSON strings with LLMs to analyze the current system or application state.

For example, you can prompt GPT-4o to extract the CSS selector of "the UI element that can be clicked to submit the form" by providing a textual instruction and the JSON string from `JSON.stringify(await client.chrome.explainCurrentTab())` in a prompt.

Use the LLM's JSON mode (or structured output feature) if available to ensure it answers in a format you can easily parse in your TypeScript code.

## Platform Support

- **Windows**: Full support for all features.