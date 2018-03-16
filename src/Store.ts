import * as Rx from "rxjs/Rx";
import { IAction } from "./IAction";
import { IObservableAction } from "./IObservableAction";
import { Action } from "./Action";
import { IStore } from "./IStore";
import { IActionFactory } from './ActionFactory/IActionFactory';
import { SimpleActionFactory } from './ActionFactory/SimpleActionFactory';
import { IActionMetadata } from './ActionFactory/IActionMetadata';
import { IResetMyState } from './IResetMyState';
import { IObservableFetcher } from './Fetch/IObservableFetcher';
import { ObservableFetcher } from './Fetch/ObservableFetcher';


/**
 * Options to configure a generic store.
 */
export interface IStoreOptions<TState>
{
    /** 
     * The state that the store will have before any actions are executed.
     */
    initialState: TState;

    /**
     * Optional parameter to execute a function when the store is first observed.
     */
    onInit?: () => void;

    /**
     * Action factory used to create actions.
     * By default the { @see SimpleActionFactory } is used.
     */
    actionFactory?: IActionFactory;

    /** 
     * Utility class to allow fetching 
     */
    fetcher?: IObservableFetcher;
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
        this.storeOptions = {
            ...options,
            actionFactory: options.actionFactory ? options.actionFactory : new SimpleActionFactory(),
            fetcher: options.fetcher ? options.fetcher : new ObservableFetcher()
        };
    }

    /**
     * Get the state of this store.
     */
    protected get state(): TState {
        return this.subject.getValue();
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
     * {@inheritdoc }
     */
    public resetState(): void {
        this.setState(this.storeOptions.initialState);
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
     * Provides fetching capabilities that are compatible with the replay functionality.
     */
    protected fetch(requestInfo: RequestInfo, init?: RequestInit): Rx.Observable<Response> {
        return this.storeOptions.fetcher.fetch(requestInfo, init);
    }
    
    /**
     * Create an action that you can observe and that others can execute.
     */
    protected createAction<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent>
    {
        return this.storeOptions.actionFactory.create<TActionEvent>(actionMetadata);
    }

    /**
     * Create an action and subscribe it directly.
     * @param next Handler for action events.
     */
    protected createActionAndSubscribe<TActionEvent>(next: (data: TActionEvent) => void, actionMetadata?: IActionMetadata): IAction<TActionEvent>
    {
        return this.createActionAdvanced<TActionEvent>(action => action.subscribe(next), actionMetadata);
    }

    /**
     * Create an action and configure observation of the action.
     * @param configure Handler that receives the action observable and subscribes it in any possible way.
     */
    protected createActionAdvanced<TActionEvent>(configure: (actionObservable: Rx.Observable<TActionEvent>) => void, actionMetadata?: IActionMetadata):
        IAction<TActionEvent>
    {
        let action = this.createAction<TActionEvent>(actionMetadata);

        configure(action.observe());

        return action;
    }
}