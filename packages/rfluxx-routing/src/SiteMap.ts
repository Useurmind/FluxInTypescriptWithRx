import { IInjectedStoreOptions, Store, IAction } from 'rfluxx';

export class Window {

}

/**
 * Constructor options for the { @see WindowManagementStore }.
 */
export interface WindowManagementStoreOptions extends IInjectedStoreOptions {

}

/**
 * State for the { @see WindowManagementStore }.
 */
export interface WindowManagementStoreState {
    /**
     * The window that is currently active and shown to the user.
     */
    activeWindow: Window | null;

    /**
     * The windows that are currently open and tracked.
     */
    openWindows: Window[];
}

/**
 * Interface for interacting with the window management store.
 */
export interface IWindowManagementStore {

}

/**
 * This store is responsible for keeping track of all open windows and opening, switching, 
 * eand closing windows.
 */
export class WindowManagementStore extends Store<WindowManagementStoreState> {
    /**
     * Create a new instance.
     */
    constructor(private options: WindowManagementStoreOptions) {
        super({
            initialState: {
                activeWindow: null,
                openWindows: []
            }
        });
        
    }
}