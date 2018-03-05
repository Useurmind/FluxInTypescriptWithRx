import * as Rx from "rxjs/Rx";
import * as Commands from "./Command";

/**
 * Interface for a store.
 */
export interface IStore<TState>
{
    /**
     * Observe the store to subscribe it afterwards with advanced options.
     * Use subscribe for less verbosity.
     * @returns {}
     */
    observe(): Rx.Observable<TState>;

    /**
     * Subscribe state changes of the store.
     * @next The subscription handler that handles changes to the state.
     * @returns The subscription to cancel the subscription.
     */
    subscribe(next: (state: TState) => void): Rx.Subscription;
}

/**
 * Options to configure a generic store.
 */
export interface IStoreOptions<TState>
{
    initialState: TState;

    onInit?: () => void;
}

/**
 * A base class for all stores.
 */
export abstract class Store<TState> implements IStore<TState> {
    private initialized: boolean;
    private storeOptions: IStoreOptions<TState>;
    protected subject: Rx.BehaviorSubject<TState>;

    constructor(options: IStoreOptions<TState>)
    {
        this.subject = new Rx.BehaviorSubject<TState>(options.initialState);
        this.initialized = false;
        this.storeOptions = options;
    }

    /**
     * {@inheritdoc }
     */
    public observe(): Rx.Observable<TState>
    {
        if (this.initialized === false)
        {
            if (this.storeOptions.onInit)
            {
                this.storeOptions.onInit();
            }

            this.initialized = true;
        }

        return this.subject;
    }

    /**
     * {@inheritdoc }
     */
    public subscribe(next: (state: TState) => void): Rx.Subscription
    {
        return this.observe().subscribe(next);
    }

    protected setState(nextState: TState): void
    {
        if (nextState)
        {
            this.subject.next(nextState);
        }
    }

    protected updateState(transformState: (currentState: TState) => TState): void
    {
        if (transformState)
        {
            let currentState = this.subject.getValue();

            let nextState = transformState(currentState);

            this.setState(nextState);
        }
    }
    
    protected createCommand<TParameter>(): Commands.IObservableCommand<TParameter>
    {
        return new Commands.Command<TParameter>();
    }

    protected createCommandAndSubscribe<TParameter>(next: (data: TParameter) => void): Commands.ICommand<TParameter>
    {
        return this.createCommandAdvanced<TParameter>(command => command.subscribe(next));
    }

    protected createCommandAdvanced<TParameter>(configure: (commandObservable: Rx.Observable<TParameter>) => void):
        Commands.ICommand<TParameter>
    {

        let command = this.createCommand<TParameter>();

        configure(command.observe());

        return command;
    }
}