import * as React from "react";
import { IContainer, IStore, StoreSubscription } from "rfluxx";

/**
 * State for { @see WithStoreSubscription }.
 */
export interface IWithStoreSubscriptionState<TInjectedProps extends object> {
    /**
     * The props selected from the state of the store.
     */
    selectedProps: TInjectedProps;
}

/**
 * Interface that describes how to directly inject a store via props.
 */
export interface IInjectStoreProps<TStore extends IStore<TStoreState>, TStoreState>
{
    /**
     * The store to subscribe.
     * Set either this or the @see storeRegistrationKey.
     */
    store: TStore;
}

/**
 * Interface that describes how to resolve a store from a container.
 */
export interface IResolveStoreFromContainerProps<TStore extends IStore<TStoreState>, TStoreState>
{
    /**
     * The name of the registered store in the container.
     * Ensure that the page context is available if you use this option.
     * Set either this or the @see store.
     */
    storeRegistrationKey: string;

    /**
     * Optionally you can specify an instance name to resolve different instances of the same store.
     */
    storeInstanceName?: string;

    /**
     * The container to resolve the store from.
     */
    container: IContainer;
}

function isStoreInjected<TStore extends IStore<TStoreState>, TStoreState>(
    props: IWithStoreSubscriptionProps<TStore, TStoreState>): props is IInjectStoreProps<TStore, TStoreState>
{
    if ((props as IInjectStoreProps<TStore, TStoreState>).store)
    {
        return true;
    }

    return false;
}

function isStoreResolvedFromCotainer<TStore extends IStore<TStoreState>, TStoreState>(
    props: IWithStoreSubscriptionProps<TStore, TStoreState>)
    : props is IResolveStoreFromContainerProps<TStore, TStoreState>
{
    if ((props as IResolveStoreFromContainerProps<TStore, TStoreState>).storeRegistrationKey)
    {
        return true;
    }

    return false;
}

/**
 * Props for { @see WithStoreSubscription }
 */
export type IWithStoreSubscriptionProps<TStore extends IStore<TStoreState>, TStoreState> =
    IInjectStoreProps<TStore, TStoreState> | IResolveStoreFromContainerProps<TStore, TStoreState>;

/**
 * Higher Order Component (HOC) to subscribe a component to a store.
 * The state of the store will be injected as props into the wrapped component.
 * @param wrappedComponent The component that is wrapped and injected with the store state.
 */
export const subscribeStore = <TStoreState extends object>() =>
     <TProps extends TStoreState>(wrappedComponent: React.ComponentType<TProps>) =>
        subscribeStoreInternal<IStore<TStoreState>, TStoreState, TProps>(wrappedComponent);

/**
 * Higher Order Component (HOC) to subscribe a component to a store.
 * The state of the store will be injected as props into the wrapped component.
 * You can choose which props should be injected through a select function.
 * @param wrappedComponent The component that is wrapped and injected with the store state.
 */
export const subscribeStoreSelect = <TStore extends IStore<TStoreState>, TStoreState extends object>() =>
        <TProps extends TInjectedProps, TInjectedProps extends object>(
            wrappedComponent: React.ComponentType<TProps>,
            selectProps: (state: TStoreState, store: TStore, outerProps: SubscribeStoreSelectProps<TProps, TInjectedProps, TStore, TStoreState>) => TInjectedProps) =>
        subscribeStoreSelectInternal<TStore, TStoreState, TProps, TInjectedProps>(wrappedComponent, selectProps);

/**
 * internal part of @subscribeStore
 */
export const subscribeStoreInternal =
    <TStore extends IStore<TStoreState>, TStoreState extends object, TProps extends TStoreState>(
        wrappedComponent: React.ComponentType<TProps>
    ) => subscribeStoreSelectInternal<TStore, TStoreState, TProps, TStoreState>(wrappedComponent, s => s);

/**
 * Return type for @subscribeStore
 */
export type SubscribeStoreReturnType = ReturnType<typeof subscribeStore>;

/**
 * Return type for @subscribeStoreSelect
 */
export type SubscribeStoreSelectReturnType =
    ReturnType<typeof subscribeStoreSelect>;

export type SubscribeStoreSelectProps<TWrappedProps, TInjectedProps, TStore extends IStore<TStoreState>, TStoreState> =
    Omit<TWrappedProps, keyof TInjectedProps> & IWithStoreSubscriptionProps<TStore, TStoreState>;

/**
 * internal part of @subscribeStoreSelect
 */
export const subscribeStoreSelectInternal =
    <TStore extends IStore<TStoreState>,
     TStoreState extends object,
     TProps extends TInjectedProps,
     TInjectedProps extends object>(
        wrappedComponent: React.ComponentType<TProps>,
        selectProps: (state: TStoreState, store: TStore, outerProps: SubscribeStoreSelectProps<TProps, TInjectedProps, TStore, TStoreState>) => TInjectedProps
    )
    : React.ComponentType<Omit<TProps, keyof TInjectedProps> & IWithStoreSubscriptionProps<TStore, TStoreState>> =>
    class WithStoreSubscription
        extends React.Component<SubscribeStoreSelectProps<TProps, TInjectedProps, TStore, TStoreState>,
                                IWithStoreSubscriptionState<TInjectedProps>>
    {
        /**
         * The subscription to the store.
         */
        public subscription: StoreSubscription<TStore, TStoreState> = new StoreSubscription();

        constructor(props: Omit<TProps, keyof TInjectedProps> & IWithStoreSubscriptionProps<TStore, TStoreState>)
        {
            super(props);
            this.handleState = this.handleState.bind(this);
            this.state = {
              selectedProps: null
            };
        }

        public componentDidMount()
        {
            this.subscribe();
        }

        public componentDidUpdate(
            oldProps: Omit<TProps, keyof TInjectedProps> & IWithStoreSubscriptionProps<TStore, TStoreState>)
        {
            if (isStoreInjected(this.props) && isStoreInjected(oldProps) && oldProps.store !== this.props.store)
            {
                this.subscribe();
            }
            else if (isStoreResolvedFromCotainer(this.props) &&
                     isStoreResolvedFromCotainer(oldProps) &&
                     oldProps.container !== this.props.container)
            {
                this.subscribe();
            }
        }

        public componentWillUnmount()
        {
            this.subscription.unsubscribe();
        }

        /**
         * Subscribe the store.
         */
        public subscribe()
        {
            let store: TStore = null;
            if (isStoreInjected(this.props))
            {
                store = this.props.store;
            }
            else if (isStoreResolvedFromCotainer(this.props))
            {
                store = this.props
                            .container
                            .resolve<TStore>(this.props.storeRegistrationKey, this.props.storeInstanceName);
            }
            else
            {
                throw new Error("Either store or storeRegistrationKey/container" +
                 " must be set when using subscribeStore wrapper component");
            }

            this.subscription.subscribeStore(store, state => this.handleState(state, store));
        }

        /**
         * Update the injected props from the store state.
         * @param state The state from the store.
         */
        public handleState(state: TStoreState, store: TStore): void
        {
            this.setState({
                selectedProps: selectProps(state, store, this.props as SubscribeStoreSelectProps<TProps, TInjectedProps, TStore, TStoreState>)
            });
        }

        /**
         * Render the component.
         */
        public render()
        {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props

            return React.createElement(wrappedComponent, { ...this.props, ...this.state.selectedProps } as TProps);
        }
    };
