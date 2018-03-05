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
    /** 
     * The state that the store will have before any commands are executed.
     */
    initialState: TState;

    /**
     * Optional parameter to execute a function when the store is first observed.
     */
    onInit?: () => void;
}

/**
 * A base class for all stores.
 */
export abstract class Store<TState> implements IStore<TState> {
    private initialized: boolean;
    private storeOptions: IStoreOptions<TState>;
    protected subject: Rx.BehaviorSubject<TState>;

    /**
     * Constructor for stores base clase.
     * @param options Options object to initialize the store with initial state. 
     */
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

    /**
     * Set the state to a fixed value.
     * @param nexState The new state object that should be applied.
     */
    protected setState(nextState: TState): void
    {
        if (nextState)
        {
            this.subject.next(nextState);
        }
    }

    /**
     * Update the state by taking the existing state and returning the new state.
     * @param transformState Function that takes the current state and returns the new state.
     */
    protected updateState(transformState: (currentState: TState) => TState): void
    {
        if (transformState)
        {
            let currentState = this.subject.getValue();

            let nextState = transformState(currentState);

            this.setState(nextState);
        }
    }
    
    /**
     * Create a command that you can observe and that others can execute.
     */
    protected createCommand<TParameter>(): Commands.IObservableCommand<TParameter>
    {
        return new Commands.Command<TParameter>();
    }

    /**
     * Create a command and subscribe it directly.
     * @param next Handler for command calls.
     */
    protected createCommandAndSubscribe<TParameter>(next: (data: TParameter) => void): Commands.ICommand<TParameter>
    {
        return this.createCommandAdvanced<TParameter>(command => command.subscribe(next));
    }

    /**
     * Create a command and configure observation of the command.
     * @param configure Handler that receives the command observable and subscribes it in any possible way.
     */
    protected createCommandAdvanced<TParameter>(configure: (commandObservable: Rx.Observable<TParameter>) => void):
        Commands.ICommand<TParameter>
    {

        let command = this.createCommand<TParameter>();

        configure(command.observe());

        return command;
    }
}