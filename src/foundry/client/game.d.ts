import type { Socket } from 'socket.io-client';
import { ConfiguredDocumentClass, ConfiguredDocumentClassForName, DocumentConstructor } from '../../types/helperTypes';

declare global {
  /**
   * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
   * The singleton instance of the Game class is available as the global variable game.
   */
  class Game {
    /**
     * @param view      - The named view which is active for this game instance.
     * @param data      - An object of all the World data vended by the server when the client first connects
     * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
     * @param socket    - The open web-socket which should be used to transact game-state data
     */
    constructor(view: Game['view'], data: Game.ConstructorData, sessionId: Game['sessionId'], socket: Game['socket']);

    /**
     * The named view which is currently active.
     * Game views include: join, setup, players, license, game, stream
     */
    view: Game.View;

    /**
     * The object of world data passed from the server
     */
    data: Game.Data;

    /** The Release data for this version of Foundry */
    release: foundry.config.ReleaseData;

    /**
     * The id of the active World user, if any
     */
    userId: string | null;

    /**
     * The game World which is currently active
     */
    world: this['data']['world'];

    /**
     * The System which is used to power this game world
     */
    system: this['data']['system'];

    documentTypes?: this['data']['documentTypes'];
    template?: this['data']['template'];
    model?: this['data']['model'];

    /**
     * A Map of active modules which are currently enabled in this World
     * @remarks
     * - This is actually defined twice. The second time it has the documentation "A mapping of installed modules".
     * - This includes _all_ modules that are installed, not only those that are enabled.
     */
    modules: Map<string, this['data']['modules'][number]>;

    /**
     * A mapping of WorldCollection instances, one per primary Document type.
     */
    collections: foundry.utils.Collection<WorldCollection<DocumentConstructor, string>>;

    /**
     * A mapping of CompendiumCollection instances, one per Compendium pack.
     */
    packs: foundry.utils.Collection<CompendiumCollection<CompendiumCollection.Metadata>>;

    /**
     * Localization support
     */
    i18n: Localization;

    /**
     * The Keyboard Manager
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    keyboard: KeyboardManager | null;

    /**
     * The Mouse Manager
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    mouse: MouseManager | null;

    /**
     * The Gamepad Manager
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    gamepad: GamepadManager | null;

    /**
     * The New User Experience manager.
     */
    nue: NewUserExperience;

    /**
     * The user role permissions setting
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    permissions: Game.Permissions | null;

    /**
     * The client session id which is currently active
     */
    sessionId: string;

    /**
     * Client settings which are used to configure application behavior
     */
    settings: ClientSettings;

    /**
     * Client keybindings which are used to configure application behavior
     */
    keybindings: ClientKeybindings;

    /**
     * A reference to the open Socket.io connection
     */
    socket: io.Socket | null;

    /**
     * A singleton GameTime instance which manages the progression of time within the game world.
     */
    time: GameTime;

    /**
     * A singleton reference to the Canvas object which may be used.
     */
    canvas: Canvas;

    /**
     * A singleton instance of the Audio Helper class
     */
    audio: AudioHelper;

    /**
     * A singleton instance of the Video Helper class
     */
    video: VideoHelper;

    /**
     * Whether the Game is running in debug mode
     * @defaultValue `false`
     */
    debug: boolean;

    /**
     * A flag for whether texture assets for the game canvas are currently loading
     * @defaultValue `false`
     */
    loading: boolean;

    /**
     * A flag for whether the Game has successfully reached the "ready" hook
     * @defaultValue `false`
     */
    ready: boolean;

    /** Returns the current version of the Release, usable for comparisons using isNewerVersion */
    get version(): string;

    /**
     * Fetch World data and return a Game instance
     * @param view      - The named view being created
     * @param sessionId - The current sessionId of the connecting client
     * @returns A Promise which resolves to the created Game instance
     */
    static create(view: string, sessionId: string | null): Promise<Game>;

    /**
     * Establish a live connection to the game server through the socket.io URL
     * @param sessionId - The client session ID with which to establish the connection
     * @returns A promise which resolves to the connected socket, if successful
     */
    static connect(sessionId: string): Promise<io.Socket>;

    /**
     * Retrieve the cookies which are attached to the client session
     * @returns The session cookies
     */
    static getCookies(): Record<string, string>;

    /**
     * Request World data from server and return it
     * @param socket - The active socket connection
     * @param view   - The view for which data is being requested
     */
    static getData(socket: Socket, view: string): Promise<unknown>;

    /**
     * Request World data from server and return it
     */
    static getWorldData(socket: io.Socket): Promise<Game.Data>;

    /**
     * Get the current World status upon initial connection.
     */
    static getWorldStatus(socket: io.Socket): Promise<boolean>;

    /**
     * Configure package data that is currently enabled for this world
     */
    setupPackages(data: Game.Data): void;

    /**
     * Return the named scopes which can exist for packages.
     * Scopes are returned in the prioritization order that their content is loaded.
     * @returns An array of string package scopes
     */
    getPackageScopes(): string[];

    /**
     * Initialize the Game for the current window location
     */
    initialize(): void;

    /**
     * Display certain usability error messages which are likely to result in the player having a bad experience.
     */
    protected _displayUsabilityErrors(): void;

    /**
     * Shut down the currently active Game. Requires GameMaster user permission.
     */
    shutDown(): Promise<void>;

    /**
     * Fully set up the game state, initializing Documents, UI applications, and the Canvas
     */
    setupGame(): Promise<void>;

    /**
     * Initialize game state data by creating WorldCollection instances for every primary Document type
     */
    initializeDocuments(): void;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    users?: ConfiguredCollectionClassForName<'User'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    folders?: ConfiguredCollectionClassForName<'Folder'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    actors?: ConfiguredCollectionClassForName<'Actor'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    items?: ConfiguredCollectionClassForName<'Item'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    scenes?: ConfiguredCollectionClassForName<'Scene'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    combats?: ConfiguredCollectionClassForName<'Combat'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    journal?: ConfiguredCollectionClassForName<'JournalEntry'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    macros?: ConfiguredCollectionClassForName<'Macro'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    playlists?: ConfiguredCollectionClassForName<'Playlist'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    tables?: ConfiguredCollectionClassForName<'RollTable'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    cards?: ConfiguredCollectionClassForName<'Cards'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    messages?: ConfiguredCollectionClassForName<'ChatMessage'>;

    /**
     * Initialize the Compendium packs which are present within this Game
     * Create a Collection which maps each Compendium pack using it's collection ID
     */
    initializePacks(): Promise<this['packs']>;

    /**
     * Initialize the WebRTC implementation
     */
    initializeRTC(): Promise<boolean>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    webrtc?: AVMaster;

    /**
     * Initialize core UI elements
     */
    initializeUI(): void;

    /**
     * Initialize the game Canvas
     */
    initializeCanvas(): Promise<void>;

    /**
     * Ensure that necessary fonts have loaded and are ready for use
     * Enforce a maximum timeout in milliseconds.
     * Proceed with rendering after that point even if fonts are not yet available.
     * @param ms - The timeout to delay
     */
    protected _checkFontsReady(ms: number): Promise<void>;

    /**
     * Initialize Keyboard controls
     */
    initializeKeyboard(): void;

    /**
     * Initialize Mouse controls
     */
    initializeMouse(): void;

    /**
     * Initialize Gamepad controls
     */
    initializeGamepads(): void;

    /**
     * Register core game settings
     */
    registerSettings(): void;

    /**
     * Is the current session user authenticated as an application administrator?
     */
    get isAdmin(): boolean;

    /**
     * The currently connected User entity, or null if Users is not yet initialized
     */
    get user(): StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>> | null;

    /**
     * A convenience accessor for the currently viewed Combat encounter
     */
    get combat(): CombatEncounters['viewed'];

    /**
     * A state variable which tracks whether or not the game session is currently paused
     */
    get paused(): boolean;

    /**
     * A convenient reference to the currently active canvas tool
     */
    get activeTool(): string;

    /**
     * Toggle the pause state of the game
     * Trigger the `pauseGame` Hook when the paused state changes
     * @param pause - The desired pause state. When true, the game will be paused, when false the game will be un-paused.
     * @param push  - Push the pause state change to other connected clients? Requires an GM user.
     *                (default: `false`)
     */
    togglePause(pause: boolean, push?: boolean): void;

    /**
     * Open Character sheet for current token or controlled actor
     * @returns The ActorSheet which was toggled, or null if the User has no character
     */
    toggleCharacterSheet(): ActorSheet | null;

    /**
     * Log out of the game session by returning to the Join screen
     */
    logOut(): void;

    /**
     * Scale the base font size according to the user's settings.
     * @param index - Optionally supply a font size index to use, otherwise use the user's setting.
     *                Available font sizes, starting at index 1, are: 8, 10, 12, 14, 16, 18, 20, 24, 28, and 32.
     */
    scaleFonts(index?: number): void;

    /**
     * Activate Socket event listeners which are used to transact game state data with the server
     */
    activateSocketListeners(): void;

    /**
     * Activate Event Listeners which apply to every Game View
     */
    activateListeners(): void;

    /**
     * Support mousewheel control for range type input elements
     * @param event - A Mouse Wheel scroll event
     */
    protected static _handleMouseWheelInputChange(event: WheelEvent): void;

    /**
     * On left mouse clicks, check if the element is contained in a valid hyperlink and open it in a new tab.
     */
    protected _onClickHyperlink(event: MouseEvent): void;

    /**
     * Prevent starting a drag and drop workflow on elements within the document unless the element has the draggable
     * attribute explicitly defined or overrides the dragstart handler.
     * @param event - The initiating drag start event
     */
    protected _onPreventDragstart(event: DragEvent): boolean;

    /**
     * Disallow dragging of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDragover(event: DragEvent): void;

    /**
     * Disallow dropping of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDrop(event: DragEvent): void;

    /**
     * On a left-click event, remove any currently displayed inline roll tooltip
     * @param event - The mousedown pointer event
     */
    protected _onPointerDown(event: PointerEvent): void;

    /**
     * Fallback handling for mouse-up events which aren't handled further upstream.
     * @param event - The mouseup pointer event
     */
    protected _onPointerUp(event: PointerEvent): void;

    /**
     * Handle resizing of the game window by adjusting the canvas and repositioning active interface applications.
     * @param event - The window resize event which has occurred
     * @internal
     */
    protected _onWindowResize(event: UIEvent): void;

    /**
     * Handle window unload operations to clean up any data which may be pending a final save
     * @param event - The window unload event which is about to occur
     */
    protected _onWindowBeforeUnload(event: Event): Promise<void>;

    /**
     * Handle cases where the browser window loses focus to reset detection of currently pressed keys
     * @param event - The originating window.blur event
     */
    protected _onWindowBlur(event: FocusEvent): void;

    protected _onWindowPopState(event: PopStateEvent): void;

    /**
     * Initialize elements required for the current view
     */
    protected _initializeView(): Promise<void>;

    /**
     * Initialization steps for the primary Game view
     */
    protected _initializeGameView(): Promise<void>;

    /**
     * Initialization steps for the Stream helper view
     */
    protected _initializeStreamView(): Promise<void>;

    /**
     * @deprecated since v9 - Use initializeDocuments instead.
     */
    initializeEntities(): void;
  }

  namespace Game {
    interface Language {
      lang: string;
      name: string;
      path: string;
    }

    interface PackageData<T> {
      availability: number;
      data: T;
      esmodules: string[];
      id: string;
      languages: Language[];
      locked: boolean;
      packs: {
        absPath: string;
        /** @deprecated since V9 */
        entity: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
        label: string;
        name: string;
        package: string;
        path: string;
        private: boolean;
        system?: string;
        type: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
      }[];
      scripts: string[];
      styles: string[];
      type: 'world' | 'system' | 'module';
      unavailable: boolean;
    }

    interface ModuleData<T> extends PackageData<T> {
      active: boolean;
      path: string;
      type: 'module';
    }

    interface SystemData<T> extends PackageData<T> {
      _systemUpdateCheckTime: number;
      documentTypes: {
        [Key in
          | foundry.CONST.DOCUMENT_TYPES
          | 'ActiveEffect'
          | 'Adventure'
          | 'AmbientLight'
          | 'AmbientSound'
          | 'Card'
          | 'Combatant'
          | 'Drawing'
          | 'FogExploration'
          | 'MeasuredTemplate'
          | 'Note'
          | 'PlaylistSound'
          | 'Setting'
          | 'TableResult'
          | 'Tile'
          | 'Token'
          | 'Wall']: string[];
      };
      model: {
        Actor: Record<string, Record<string, unknown>>;
        Cards: Record<string, Record<string, unknown>>;
        Item: Record<string, Record<string, unknown>>;
      };
      path: string;
      template: {
        Actor?: {
          types: string[];
          templates?: Record<string, unknown>;
        } & Record<string, unknown>;
        Item?: {
          types: string[];
          templates?: Record<string, unknown>;
        } & Record<string, unknown>;
      };
      type: 'system';
    }

    interface WorldData<T> extends PackageData<T> {
      _systemUpdateCheckTime: number;
      type: 'world';
    }

    type Data = {
      activeUsers: string[];
      addresses: {
        local: string;
        remote?: string | undefined;
        remoteIsAccessible: boolean | null;
      };
      coreUpdate: {
        channel: unknown | null;
        couldReachWebsite: boolean;
        hasUpdate: boolean;
        slowResponse: boolean;
        version: unknown | null;
        willDisableModules: boolean;
      };
      files: {
        s3?: {
          endpoint: {
            protocol: string;
            host: string;
            port: number;
            hostname: string;
            pathname: string;
            path: string;
            href: string;
          };
          buckets: string[];
        } | null;
        storages: ('public' | 'data' | 's3')[];
      };
      modules: ModuleData<foundry.packages.BaseModule>[];
      options: {
        demo: boolean;
        language: string;
        port: number;
        routePrefix: string | null;
        updateChannel: string;
      };
      packs: {
        /** @deprecated since V9 */
        entity: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
        index: {
          _id: string;
          name: string;
          type: string;
        }[];
        label: string;
        name: string;
        package: string;
        path: string;
        private: boolean;
        system?: string;
        type: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
      }[];
      paused: boolean;
      release: {
        build: number;
        channel: 'Stable' | 'Testing' | 'Development' | 'Prototype';
        download: string;
        generation: string;
        notes: string;
        time: number;
      };
      system: System;
      systemUpdate: string | null;
      userId: string;
      /** @deprecated since V9 */
      version?: string;
      world: WorldData<foundry.packages.BaseWorld>;
    } & {
      [DocumentType in
        | foundry.CONST.DOCUMENT_TYPES
        | 'Setting' as ConfiguredDocumentClassForName<DocumentType>['metadata']['collection']]?: InstanceType<
        ConfiguredDocumentClassForName<DocumentType>
      >['data']['_source'][];
    } & Pick<SystemData<foundry.packages.BaseSystem['_source']>, 'documentTypes' | 'template' | 'model'>;

    type ConstructorData = Omit<Data, 'world' | 'system' | 'modules'> & {
      world: WorldData<foundry.packages.BaseWorld['_source']>;
      system: SystemData<foundry.packages.BaseSystem['_source']>;
      modules: ModuleData<foundry.packages.BaseModule['_source']>[];
    };

    type Permissions = {
      [Key in keyof typeof foundry.CONST.USER_PERMISSIONS]: foundry.CONST.USER_ROLES[];
    };

    type View = ValueOf<typeof foundry.CONST.GAME_VIEWS>;
  }

  /**
   * @defaultValue `undefined`
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let canvas: 'canvas' extends keyof LenientGlobalVariableTypes ? Canvas : Canvas | undefined;
}

type ConfiguredCollectionClassForName<Name extends foundry.CONST.DOCUMENT_TYPES> = InstanceType<
  CONFIG[Name]['collection']
>;
