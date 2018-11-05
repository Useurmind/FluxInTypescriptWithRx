import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

/**
 * The options to configure the { @see PageManagementStore }
 */
export interface IPageManagementStoreOptions extends IInjectedStoreOptions
{
}

/**
 * The state of the { @see PageManagementStore }
 */
export interface IPageManagementStoreState
{
}

/**
 * Interface to interact with the { @see PageManagementStore }.
 */
export interface IPageManagementStore extends Rfluxx.IStore<IPageManagementStoreState>
{
}

/**
 * This store manages the state of open pages.
 */
export class PageManagementStore extends Rfluxx.Store<IPageManagementStoreState>
{
    /**
     * Interval number used to listen to url changes periodically.
     */
    private interval: number = null;

    constructor(private options: IPageManagementStoreOptions)
    {
        super({
            initialState: {
            }
        });
    }
}
