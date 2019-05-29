import { IAction } from "../IAction";
import { IStore } from "../IStore";
import { IInjectedStoreOptions, Store } from "../Store";

/**
 * Options for the @see PullingStore.
 */
export interface IPullingStoreOptions<TState> extends IInjectedStoreOptions
{
    /**
     * The number of milliseconds to wait between each pull.
     */
    pullIntervalMs: number;

    /**
     * Pull the state from where ever it should come from.
     */
    pullState: () => TState;

    /**
     * Set this to turn of auto connecting the store on construction.
     * Call the connect action later on.
     */
    doNotAutoConnect?: boolean;
}

/**
 * Interface for the pulling store.
 */
export interface IPullingStore<TState> extends IStore<TState>
{
    /**
     * Start to pull from the data source.
     */
    connect: IAction<any>;

    /**
     * Stop pulling from the data source.
     */
    disconnect: IAction<any>;
}

/**
 * This store makes a simple data source into an observable store
 * by pulling its state from the source regularly.
 */
export class PullingStore<TState> extends Store<TState> implements IPullingStore<TState>
{
    /**
     * @inheritdoc
     */
    public readonly connect: IAction<any>;

    /**
     * @inheritdoc
     */
    public readonly disconnect: IAction<any>;

    /**
     * Interval number used to pull state periodically.
     */
    private interval: number = null;

    constructor(private options: IPullingStoreOptions<TState>)
    {
        super({
            ...options,
            initialState: {} as TState
        });

        if (!this.options.pullIntervalMs)
        {
            this.options.pullIntervalMs = 100;
        }

        this.connect = this.createActionAndSubscribe(_ => this.onConnect());
        this.disconnect = this.createActionAndSubscribe(_ => this.onDisconnect());

        if (!options.doNotAutoConnect)
        {
            this.connect.trigger(null);
        }
    }

    private onConnect()
    {
        window.clearInterval(this.interval);
        this.interval = window.setInterval(() => this.pullStateFromSource(), this.options.pullIntervalMs);
    }

    private onDisconnect()
    {
        window.clearInterval(this.interval);
    }

    private pullStateFromSource()
    {
        const newState = this.options.pullState();
        this.setState(newState);
    }
}
