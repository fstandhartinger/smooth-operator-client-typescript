/**
 * Type definitions for Smooth Operator Agent Tools
 */

/**
 * Specifies the mechanism to use for AI-based UI element interaction.
 */
export enum MechanismType {
  ScreenGrasp2 = "screengrasp2",
  ScreenGrasp2Low = "screengrasp2-low",
  ScreenGraspMedium = "screengrasp-medium",
  ScreenGraspHigh = "screengrasp-high",
  LLabs = "llabs",
  AnthropicComputerUse = "anthropic-computer-use",
  OpenAIComputerUse = "openai-computer-use",
  Qwen25Vl72b = "qwen25-vl-72b"
}

/**
 * Strategy to use when an existing Chrome instance is already running with the same user profile.
 * Mirrors the C# enum.
 */
export enum ExistingChromeInstanceStrategy {
  /** Throw an error if an existing Chrome instance is using the same user profile. */
  ThrowError = 0,
  /** Force close any existing Chrome instances before starting a new one. */
  ForceClose = 1,
  /** Start a Playwright-managed Chrome without using the user profile. */
  StartWithoutUserProfile = 2
}


// Define a type for the plain object returned by ControlDTO.toJSON
type ControlDTOPlain = {
  id: string;
  name: string | null;
  creationDate: string;
  controlType: string | null;
  supportsSetValue: boolean | null;
  supportsInvoke: boolean | null;
  currentValue: string | null;
  children: (ControlDTOPlain | null)[] | null;
  isSmoothOperator: boolean;
};

/**
 * Response from the screenshot endpoint
 */
export class ScreenshotResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Base64-encoded image data */
  imageBase64: string;
  /** Timestamp of when the screenshot was taken (ISO 8601 format) */
  timestamp: string;
  /** Message describing the result */
  message: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    success: boolean;
    imageBase64: string;
    timestamp: string;
    message?: string | null;
  }) {
    this.success = data.success;
    this.imageBase64 = data.imageBase64;
    this.timestamp = data.timestamp;
    this.message = data.message ?? null;
  }

  /** Raw image bytes */
  get imageBytes(): Buffer {
      return Buffer.from(this.imageBase64, 'base64');
  }

  /** Mime type of the image */
  get imageMimeType(): string {
      // Assuming JPEG as per C# comment, though this could be dynamic in future
      return "image/jpeg";
  }

  toJSON(): any {
    return {
      success: this.success,
      imageBase64: this.imageBase64,
      timestamp: this.timestamp,
      message: this.message,
    };
  }
}

/**
 * Represents a point on the screen with X and Y coordinates
 */
export class Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;

  constructor(data: { x: number; y: number }) {
    this.x = data.x;
    this.y = data.y;
  }

  toJSON(): any {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

/**
 * Generic response for action endpoints
 */
export class ActionResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Message describing the result */
  message: string | null; // Match C# non-optional string (can be null)
  /** Additional result data (if applicable), typically a string for simple results, can be a json string for more complex results */
  resultValue: string | null; // Added property

  constructor(data: {
    success: boolean;
    message?: string | null;
    resultValue?: string | null; // Added to constructor
  }) {
    this.success = data.success;
    this.message = data.message ?? null;
    this.resultValue = data.resultValue ?? null; // Initialize new property
  }

  toJSON(): any {
    return {
      success: this.success,
      message: this.message,
      resultValue: this.resultValue, // Added to JSON output
    };
  }
}

/**
 * Response from the ScreenGrasp2 endpoint (find-ui-element-by-description)
 */
export class ScreenGrasp2Response extends ActionResponse {
  /** X coordinate of the found element (if applicable) */
  x: number | null; // Match C# int?
  /** Y coordinate of the found element (if applicable) */
  y: number | null; // Match C# int?
  /** Status message from the underlying service */
  status: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    success: boolean;
    message?: string | null;
    x?: number | null;
    y?: number | null;
    status?: string | null;
  }) {
    super({ success: data.success, message: data.message });
    this.x = data.x ?? null;
    this.y = data.y ?? null;
    this.status = data.status ?? null;
  }

  // Override toJSON to include specific properties
  toJSON(): any {
    return {
      ...super.toJSON(),
      x: this.x,
      y: this.y,
      status: this.status,
    };
  }
}

/**
 * Information about a Chrome browser tab
 */
export class ChromeTab {
  /** Tab ID */
  id: string;
  /** Tab title */
  title: string;
  /** Tab URL */
  url: string;
  /** Whether the tab is active */
  isActive: boolean;

  constructor(data: {
    id: string;
    title: string;
    url: string;
    isActive: boolean;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.isActive = data.isActive;
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      isActive: this.isActive,
    };
  }
}

/**
 * Detailed information about a Chrome tab
 */
export class ChromeTabDetails {
  /** Current tab title */
  currentTabTitle: string;
  /** Current tab index */
  currentTabIndex: number;
  /** Most relevant elements in the current Chrome tab */
  currentChromeTabMostRelevantElements: ChromeElementInfo[];
  /** Other Chrome instances */
  chromeInstances: ChromeOverview[];
  /** Optional note */
  note: string | null;

  constructor(data: {
    currentTabTitle: string;
    currentTabIndex: number;
    currentChromeTabMostRelevantElements: ChromeElementInfo[];
    chromeInstances: ChromeOverview[];
    note?: string | null;
  }) {
    this.currentTabTitle = data.currentTabTitle;
    this.currentTabIndex = data.currentTabIndex;
    this.currentChromeTabMostRelevantElements = data.currentChromeTabMostRelevantElements;
    this.chromeInstances = data.chromeInstances;
    this.note = data.note ?? null;
  }

  toJSON(): any {
    return {
      currentTabTitle: this.currentTabTitle,
      currentTabIndex: this.currentTabIndex,
      currentChromeTabMostRelevantElements: this.currentChromeTabMostRelevantElements?.map(e => e.toJSON ? e.toJSON() : e),
      chromeInstances: this.chromeInstances?.map(i => i.toJSON ? i.toJSON() : i),
      note: this.note,
    };
  }
}

/**
 * Response from Chrome script execution
 */
export class ChromeScriptResponse extends ActionResponse {
  /** Result of the script execution */
  result: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    success: boolean;
    message?: string | null;
    result?: string | null;
  }) {
    super({ success: data.success, message: data.message });
    this.result = data.result ?? null;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      result: this.result,
    };
  }
}

/**
 * Response from C# code execution
 */
export class CSharpCodeResponse extends ActionResponse {
  /** Result of the code execution */
  result: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    success: boolean;
    message?: string | null;
    data?: Record<string, any> | null;
    result?: string | null;
  }) {
    super({ success: data.success, message: data.message });
    this.result = data.result ?? null;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      result: this.result,
    };
  }
}

/**
 * Simple response with a message
 */
export class SimpleResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Message describing the result */
  message: string | null; // Match C# non-optional string (can be null)
  /** Internal message (not usually exposed to users) */
  internalMessage: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    success?: boolean;
    message?: string | null;
    internalMessage?: string | null;
  }) {
    this.success = data.success ?? true;
    this.message = data.message ?? null;
    this.internalMessage = data.internalMessage ?? null;
  }

  toJSON(): any {
    return {
      success: this.success,
      message: this.message,
      internalMessage: this.internalMessage,
    };
  }
}

/**
 * Information about a desktop icon
 */
export class DesktopIconDTO {
  /** Icon name */
  name: string;
  /** Path to the icon's target */
  path: string;

  constructor(data: { name: string; path: string }) {
    this.name = data.name;
    this.path = data.path;
  }

  toJSON(): any {
    return {
      name: this.name,
      path: this.path,
    };
  }
}

/**
 * Information about a taskbar icon
 */
export class TaskbarIconDTO {
  /** Icon name */
  name: string;
  /** Path to the icon's target */
  path: string;

  constructor(data: { name: string; path: string }) {
    this.name = data.name;
    this.path = data.path;
  }

  toJSON(): any {
    return {
      name: this.name,
      path: this.path,
    };
  }
}

/**
 * Information about an installed program
 */
export class InstalledProgramDTO {
  /** Program name */
  name: string;
  /** Path to the executable */
  executablePath: string;

  constructor(data: { name: string; executablePath: string }) {
    this.name = data.name;
    this.executablePath = data.executablePath;
  }

  toJSON(): any {
    return {
      name: this.name,
      executablePath: this.executablePath,
    };
  }
}

/**
 * Information about a UI control
 */
// Note: We deliberately exclude recursive properties and parent from toJSON
export class ControlDTO {
  /** Control ID */
  id: string;
  /** Control name */
  name: string | null; // Match C# non-optional string (can be null)
  /** Creation date (ISO 8601 format) */
  creationDate: string;
  /** Control type */
  controlType: string | null; // Match C# non-optional string (can be null)
  /** Whether the control supports setting a value */
  supportsSetValue: boolean | null; // Match C# bool?
  /** Whether the control supports invoking */
  supportsInvoke: boolean | null; // Match C# bool?
  /** Current value of the control */
  currentValue: string | null; // Match C# non-optional string (can be null)
  /** Child controls */
  children: ControlDTO[] | null; // Match C# non-optional List (can be null)
  /** Parent control */
  parent: ControlDTO | null; // Match C# non-optional ControlDTO (can be null)
  // Recursive properties removed from direct members
  /** Whether this is a Smooth Operator control */
  isSmoothOperator: boolean; // Match C# non-optional bool

  constructor(data: {
    id: string;
    creationDate: string;
    isSmoothOperator: boolean;
    name?: string | null;
    controlType?: string | null;
    supportsSetValue?: boolean | null;
    supportsInvoke?: boolean | null;
    currentValue?: string | null;
    children?: ControlDTO[] | null;
    parent?: ControlDTO | null; // Parent is needed for recursive properties
  }) {
    this.id = data.id;
    this.name = data.name ?? null;
    this.creationDate = data.creationDate;
    this.controlType = data.controlType ?? null;
    this.supportsSetValue = data.supportsSetValue ?? null;
    this.supportsInvoke = data.supportsInvoke ?? null;
    this.currentValue = data.currentValue ?? null;
    // Reconstruct children as ControlDTO instances if they exist
    this.children = data.children ? data.children.map(cData => new ControlDTO(cData)) : null;
    // IMPORTANT: Avoid creating a new parent instance here to prevent infinite loops
    // The parent should ideally be assigned after creation if needed for navigation,
    // but the raw data shouldn't contain nested parent ControlDTOs.
    this.parent = data.parent ?? null;
    this.isSmoothOperator = data.isSmoothOperator;

    // Set parent for children after construction
    if (this.children) {
        this.children.forEach(child => child.parent = this);
    }
  }

  /** Recursively get all descendant controls. */
  get childrenRecursive(): ControlDTO[] {
    const descendants: ControlDTO[] = [];
    if (!this.children) {
      return descendants;
    }
    for (const child of this.children) {
      if (child) { // Check if child is not null
        descendants.push(child);
        descendants.push(...child.childrenRecursive); // Recursive call
      }
    }
    return descendants;
  }

  /** Get all ancestor controls. */
  get parentsRecursive(): ControlDTO[] {
    const ancestors: ControlDTO[] = [];
    let current = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent; // Move up the hierarchy
    }
    return ancestors;
  }

  /** Find the closest ancestor control that is a Window. */
  get parentWindow(): ControlDTO | null {
    let current = this.parent;
    while (current) {
      if (current.controlType === "Window") {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  // We don't need allChildrenRecursive or allParentsRecursive as separate properties;
  // the getters above compute them on demand.

  /** Custom serialization to avoid circular references and large payloads */
  toJSON(): ControlDTOPlain {
    // Explicitly list properties to include, excluding 'parent' and computed getters
    return {
      id: this.id,
      name: this.name,
      creationDate: this.creationDate,
      controlType: this.controlType,
      supportsSetValue: this.supportsSetValue,
      supportsInvoke: this.supportsInvoke,
      currentValue: this.currentValue,
      // Serialize children, but ensure they also use toJSON to avoid parent recursion
      children: this.children?.map((child): ControlDTOPlain | null => child?.toJSON ? child.toJSON() : child) ?? null,
      isSmoothOperator: this.isSmoothOperator,
    };
  }
}

/**
 * Information about a window
 */
export class WindowInfoDTO {
  /** Window ID */
  id: string;
  /** Window title */
  title: string | null;
  /** Path to the executable */
  executablePath: string | null;
  /** Whether the window is in the foreground */
  isForeground: boolean | null;
  /** Process name */
  processName: string | null;
  /** Whether the window is minimized */
  isMinimized: boolean | null;
  /** Detailed information (if requested) */
  detailInfos: WindowDetailResponse | null;

  constructor(data: {
    id: string;
    title?: string | null;
    executablePath?: string | null;
    isForeground?: boolean | null;
    processName?: string | null;
    isMinimized?: boolean | null;
    detailInfos?: WindowDetailResponse | null;
  }) {
    this.id = data.id;
    this.title = data.title ?? null;
    this.executablePath = data.executablePath ?? null;
    this.isForeground = data.isForeground ?? null;
    this.processName = data.processName ?? null;
    this.isMinimized = data.isMinimized ?? null;
    // Reconstruct detailInfos if present
    this.detailInfos = data.detailInfos ? new WindowDetailResponse(data.detailInfos) : null;
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      executablePath: this.executablePath,
      isForeground: this.isForeground,
      processName: this.processName,
      isMinimized: this.isMinimized,
      // Serialize detailInfos if it exists
      detailInfos: this.detailInfos?.toJSON ? this.detailInfos.toJSON() : this.detailInfos,
    };
  }
}

/**
 * Wrapper for WindowDetailInfosDTO, potentially from older API versions
 */
export class WindowDetailResponse {
  /** Detailed information */
  details: WindowDetailInfosDTO | null; // Match C# non-optional WindowDetailInfosDTO (can be null)
  /** Message describing the result */
  message: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    details?: WindowDetailInfosDTO | null;
    message?: string | null;
  }) {
    // Reconstruct details if present
    this.details = data.details ? new WindowDetailInfosDTO(data.details) : null;
    this.message = data.message ?? null;
  }

  toJSON(): any {
    return {
      // Serialize details if it exists
      details: this.details?.toJSON ? this.details.toJSON() : this.details,
      message: this.message,
    };
  }
}

/**
 * Detailed UI automation information for a window
 */
export class WindowDetailInfosDTO {
  /** Note about the details */
  note: string | null; // Match C# non-optional string (can be null)
  /** Information about the window */
  window: WindowInfoDTO | null; // Match C# non-optional WindowInfoDTO (can be null)
  /** Root UI element */
  userInterfaceElements: ControlDTO | null; // Match C# non-optional ControlDTO (can be null)

  constructor(data: {
    note?: string | null;
    window?: WindowInfoDTO | null;
    userInterfaceElements?: ControlDTO | null;
  }) {
    this.note = data.note ?? null;
    // Reconstruct window and userInterfaceElements if present
    this.window = data.window ? new WindowInfoDTO(data.window) : null;
    this.userInterfaceElements = data.userInterfaceElements ? new ControlDTO(data.userInterfaceElements) : null;
  }

  toJSON(): any {
    return {
      note: this.note,
      // Serialize window and userInterfaceElements if they exist
      window: this.window?.toJSON ? this.window.toJSON() : this.window,
      userInterfaceElements: this.userInterfaceElements?.toJSON ? this.userInterfaceElements.toJSON() : this.userInterfaceElements,
    };
  }
}

/**
 * Overview information about a single Chrome instance
 */
export class ChromeOverview {
  /** Instance ID */
  instanceId: string;
  /** List of tabs */
  tabs: TabData[];
  /** Last update time (ISO 8601 format) */
  lastUpdate: string;

  constructor(data: {
    instanceId: string;
    tabs: TabData[];
    lastUpdate: string;
  }) {
    this.instanceId = data.instanceId;
    // Reconstruct tabs as TabData instances
    this.tabs = data.tabs.map(tData => new TabData(tData));
    this.lastUpdate = data.lastUpdate;
  }

  toJSON(): any {
    return {
      instanceId: this.instanceId,
      // Serialize tabs
      tabs: this.tabs.map(tab => tab.toJSON()),
      lastUpdate: this.lastUpdate,
    };
  }
}

/**
 * Data for a single tab within a Chrome instance
 */
export class TabData {
  /** Tab ID */
  id: string;
  /** Tab URL */
  url: string;
  /** Whether the tab is active */
  isActive: boolean;
  /** HTML content (if requested) */
  html: string | null; // Match C# non-optional string (can be null)
  /** Text content (if requested) */
  text: string | null; // Match C# non-optional string (can be null)
  /** ID string (seems redundant?) */
  idString: string | null; // Match C# non-optional string (can be null)
  /** Tab number */
  tabNr: number; // Match C# non-optional int

  constructor(data: {
    id: string;
    url: string;
    isActive: boolean;
    tabNr: number;
    html?: string | null;
    text?: string | null;
    idString?: string | null;
  }) {
    this.id = data.id;
    this.url = data.url;
    this.isActive = data.isActive;
    this.html = data.html ?? null;
    this.text = data.text ?? null;
    this.idString = data.idString ?? null;
    this.tabNr = data.tabNr;
  }

  toJSON(): any {
    return {
      id: this.id,
      url: this.url,
      isActive: this.isActive,
      html: this.html,
      text: this.text,
      idString: this.idString,
      tabNr: this.tabNr,
    };
  }
}

/**
 * Information about the currently focused element
 */
export class FocusInformation {
  /** Focused UI element */
  focusedElement: ControlDTO | null; // Match C# non-optional ControlDTO (can be null)
  /** Parent window of the focused element */
  focusedElementParentWindow: WindowInfoDTO | null; // Match C# non-optional WindowInfoDTO (can be null)
  /** Other relevant elements in the same window */
  someOtherElementsInSameWindowThatMightBeRelevant: ControlDTO[] | null; // Match C# non-optional List (can be null)
  /** Relevant elements in the current Chrome tab */
  currentChromeTabMostRelevantElements: ChromeElementInfo[] | null; // Match C# non-optional List (can be null)
  /** Whether the focus is within Chrome */
  isChrome: boolean; // Match C# non-optional bool
  /** Note about the focus */
  note: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    isChrome: boolean;
    focusedElement?: ControlDTO | null;
    focusedElementParentWindow?: WindowInfoDTO | null;
    someOtherElementsInSameWindowThatMightBeRelevant?: ControlDTO[] | null;
    currentChromeTabMostRelevantElements?: ChromeElementInfo[] | null;
    note?: string | null;
  }) {
    // Reconstruct complex types
    this.focusedElement = data.focusedElement ? new ControlDTO(data.focusedElement) : null;
    this.focusedElementParentWindow = data.focusedElementParentWindow ? new WindowInfoDTO(data.focusedElementParentWindow) : null;
    this.someOtherElementsInSameWindowThatMightBeRelevant = data.someOtherElementsInSameWindowThatMightBeRelevant
      ? data.someOtherElementsInSameWindowThatMightBeRelevant.map(cData => new ControlDTO(cData))
      : null;
    this.currentChromeTabMostRelevantElements = data.currentChromeTabMostRelevantElements
      ? data.currentChromeTabMostRelevantElements.map(eData => new ChromeElementInfo(eData))
      : null;
    this.isChrome = data.isChrome;
    this.note = data.note ?? null;
  }

  toJSON(): any {
    return {
      // Serialize complex types if they exist
      focusedElement: this.focusedElement?.toJSON ? this.focusedElement.toJSON() : this.focusedElement,
      focusedElementParentWindow: this.focusedElementParentWindow?.toJSON ? this.focusedElementParentWindow.toJSON() : this.focusedElementParentWindow,
      someOtherElementsInSameWindowThatMightBeRelevant: this.someOtherElementsInSameWindowThatMightBeRelevant?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      currentChromeTabMostRelevantElements: this.currentChromeTabMostRelevantElements?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      isChrome: this.isChrome,
      note: this.note,
    };
  }
}

/**
 * Detailed information about an element within a Chrome tab
 */
export class ChromeElementInfo {
  /** Smooth Operator ID */
  smoothOpId: string | null; // Match C# non-optional string (can be null)
  /** HTML tag name */
  tagName: string | null; // Match C# non-optional string (can be null)
  /** CSS selector */
  cssSelector: string | null; // Match C# non-optional string (can be null)
  /** Inner text */
  innerText: string | null; // Match C# non-optional string (can be null)
  /** Whether the element is visible */
  isVisible: boolean | null; // Match C# bool?
  /** Relevance score */
  score: number | null; // Match C# float?
  /** ARIA role */
  role: string | null; // Match C# non-optional string (can be null)
  /** Element value */
  value: string | null; // Match C# non-optional string (can be null)
  /** Element type attribute */
  type: string | null; // Match C# non-optional string (can be null)
  /** Element name attribute */
  name: string | null; // Match C# non-optional string (can be null)
  /** Element class attribute */
  className: string | null; // Match C# non-optional string (can be null)
  /** Semantic meaning */
  semantic: string | null; // Match C# non-optional string (can be null)
  /** Data attributes */
  dataAttributes: string | null; // Match C# non-optional string (can be null)
  /** Truncated HTML */
  truncatedHtml: string | null; // Match C# non-optional string (can be null)
  /** Bounding rectangle [x, y, width, height] */
  boundingRect: number[] | null; // Match C# non-optional List<int> (can be null)
  /** Center point */
  centerPoint: Point | null; // Match C# non-optional Point (can be null)

  constructor(data: {
    smoothOpId?: string | null;
    tagName?: string | null;
    cssSelector?: string | null;
    innerText?: string | null;
    isVisible?: boolean | null;
    score?: number | null;
    role?: string | null;
    value?: string | null;
    type?: string | null;
    name?: string | null;
    className?: string | null;
    semantic?: string | null;
    dataAttributes?: string | null;
    truncatedHtml?: string | null;
    boundingRect?: number[] | null;
    centerPoint?: Point | null;
  }) {
    this.smoothOpId = data.smoothOpId ?? null;
    this.tagName = data.tagName ?? null;
    this.cssSelector = data.cssSelector ?? null;
    this.innerText = data.innerText ?? null;
    this.isVisible = data.isVisible ?? null;
    this.score = data.score ?? null;
    this.role = data.role ?? null;
    this.value = data.value ?? null;
    this.type = data.type ?? null;
    this.name = data.name ?? null;
    this.className = data.className ?? null;
    this.semantic = data.semantic ?? null;
    this.dataAttributes = data.dataAttributes ?? null;
    this.truncatedHtml = data.truncatedHtml ?? null;
    this.boundingRect = data.boundingRect ?? null;
    // Reconstruct centerPoint if present
    this.centerPoint = data.centerPoint ? new Point(data.centerPoint) : null;
  }

  toJSON(): any {
    return {
      smoothOpId: this.smoothOpId,
      tagName: this.tagName,
      cssSelector: this.cssSelector,
      innerText: this.innerText,
      isVisible: this.isVisible,
      score: this.score,
      role: this.role,
      value: this.value,
      type: this.type,
      name: this.name,
      className: this.className,
      semantic: this.semantic,
      dataAttributes: this.dataAttributes,
      truncatedHtml: this.truncatedHtml,
      boundingRect: this.boundingRect,
      // Serialize centerPoint if it exists
      centerPoint: this.centerPoint?.toJSON ? this.centerPoint.toJSON() : this.centerPoint,
    };
  }
}

/**
 * Response from the system overview endpoint
 */
export class OverviewResponse {
  /** List of open windows */
  windows: WindowInfoDTO[] | null; // Match C# non-optional List (can be null)
  /** Information about the focused element */
  focusInfo: FocusInformation | null; // Match C# non-optional FocusInformation (can be null)
  /** List of Chrome instances */
  chromeInstances: ChromeOverview[] | null; // Match C# non-optional List (can be null)
  /** List of taskbar icons */
  taskbarIcons: TaskbarIconDTO[] | null; // Match C# non-optional List (can be null)
  /** List of desktop icons */
  desktopIcons: DesktopIconDTO[] | null; // Match C# non-optional List (can be null)
  /** List of installed programs */
  installedPrograms: InstalledProgramDTO[] | null; // Match C# non-optional List (can be null)
  /** Important note */
  importantNote: string | null; // Match C# non-optional string (can be null)

  constructor(data: {
    windows?: WindowInfoDTO[] | null;
    focusInfo?: FocusInformation | null;
    chromeInstances?: ChromeOverview[] | null;
    taskbarIcons?: TaskbarIconDTO[] | null;
    desktopIcons?: DesktopIconDTO[] | null;
    installedPrograms?: InstalledProgramDTO[] | null;
    importantNote?: string | null;
  }) {
    // Reconstruct complex lists
    this.windows = data.windows ? data.windows.map(wData => new WindowInfoDTO(wData)) : null;
    this.focusInfo = data.focusInfo ? new FocusInformation(data.focusInfo) : null;
    this.chromeInstances = data.chromeInstances ? data.chromeInstances.map(cData => new ChromeOverview(cData)) : null;
    this.taskbarIcons = data.taskbarIcons ? data.taskbarIcons.map(tData => new TaskbarIconDTO(tData)) : null;
    this.desktopIcons = data.desktopIcons ? data.desktopIcons.map(dData => new DesktopIconDTO(dData)) : null;
    this.installedPrograms = data.installedPrograms ? data.installedPrograms.map(pData => new InstalledProgramDTO(pData)) : null;
    this.importantNote = data.importantNote ?? null;
  }

  toJSON(): any {
    return {
      // Serialize complex lists if they exist
      windows: this.windows?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      focusInfo: this.focusInfo?.toJSON ? this.focusInfo.toJSON() : this.focusInfo,
      chromeInstances: this.chromeInstances?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      taskbarIcons: this.taskbarIcons?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      desktopIcons: this.desktopIcons?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      installedPrograms: this.installedPrograms?.map(el => el.toJSON ? el.toJSON() : el) ?? null,
      importantNote: this.importantNote,
    };
  }
}
