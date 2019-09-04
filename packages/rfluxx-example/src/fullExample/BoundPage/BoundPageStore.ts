import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

/**
 * The state of the store { @see BoundPageStore }.
 */
export interface IBoundPageStoreState
{
    /**
     * A string value set by the example action @setString.
     */
    someString: string;
}

/**
 * The options to configure the store { @see BoundPageStore }.
 */
export interface IBoundPageStoreOptions
{
}

/**
 * The interface that exposes the commands of the store { @see BoundPageStore }.
 */
export interface IBoundPageStore extends IStore<IBoundPageStoreState>
{
    /**
     * Example action that sets a string in the store state
     */
    setString: IAction<string>;
}

/**
 * Store for the bound page example.
 */
export class BoundPageStore
    extends Store<IBoundPageStoreState> implements IBoundPageStore
{
    /**
     * @inheritdoc
     */
    public readonly setString: IAction<string>;

    constructor(private options: IBoundPageStoreOptions)
    {
        super({
            initialState: {
                someString: "This is a string coming from the bound pages store."
            }
        });

        this.setString = this.createActionAndSubscribe(x => this.onSetString(x));
    }

    private onSetString(someString: string)
    {
        this.setState({
            ...this.state,
            someString
        });
    }
}
