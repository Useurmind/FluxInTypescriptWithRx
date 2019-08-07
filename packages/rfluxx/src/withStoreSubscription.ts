import * as React from "react";
import { IStore, StoreSubscription } from "rfluxx";
import { IPageContextProps } from "rfluxx-routing";

import { Subtract } from "./mapped-types";

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
export interface IInjectStoreProps<TStoreState> {
    /**
     * The store to subscribe.
     * Set either this or the @see storeRegistrationKey.
     */
    store: IStore<TStoreState>;
}

/**
 * Interface that describes how to resolve a store from a container.
 */
export interface IResolveStoreFromContainerProps<TStoreState> extends IPageContextProps {
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
}

function isStoreInjected<TStoreState>(props: IWithStoreSubscriptionProps<TStoreState>): props is IInjectStoreProps<TStoreState> {
    if ((props as IInjectStoreProps<TStoreState>).store) {
        return true;
    }

    return false;
}

function isStoreResolvedFromCotainer<TStoreState>(props: IWithStoreSubscriptionProps<TStoreState>): props is IResolveStoreFromContainerProps<TStoreState> {
    if ((props as IResolveStoreFromContainerProps<TStoreState>).storeRegistrationKey) {
        return true;
    }

    return false;
}

/**
 * Props for { @see WithStoreSubscription }
 */
export type IWithStoreSubscriptionProps<TStoreState> = IInjectStoreProps<TStoreState> | IResolveStoreFromContainerProps<TStoreState>;

/**
 * Higher Order Component (HOC) to subscribe a component to a store.
 * The state of the store will be injected as props into the wrapped component.
 * @param wrappedComponent The component that is wrapped and injected with the store state.
 */
export const subscribeStore = <TStoreState extends object>() =>
     <TProps extends TStoreState>(wrappedComponent: React.ComponentType<TProps>) =>
        subscribeStoreInternal<TStoreState, TProps>(wrappedComponent);

/**
 * Higher Order Component (HOC) to subscribe a component to a store.
 * The state of the store will be injected as props into the wrapped component.
 * You can choose which props should be injected through a select function.
 * @param wrappedComponent The component that is wrapped and injected with the store state.
 */
export const subscribeStoreSelect = <TStoreState extends object>() =>
        <TProps extends TInjectedProps, TInjectedProps extends object>(
            wrappedComponent: React.ComponentType<TProps>,
            selectProps: (state: TStoreState) => TInjectedProps) =>
        subscribeStoreSelectInternal<TStoreState, TProps, TInjectedProps>(wrappedComponent, selectProps);

/**
 * internal part of @subscribeStore
 */
export const subscribeStoreInternal = <TStoreState extends object, TProps extends TStoreState>(
    wrappedComponent: React.ComponentType<TProps>
) => subscribeStoreSelectInternal<TStoreState, TProps, TStoreState>(wrappedComponent, s => s);

/**
 * internal part of @subscribeStoreSelect
 */
export const subscribeStoreSelectInternal = <TStoreState extends object, TProps extends TInjectedProps, TInjectedProps extends object>(
        wrappedComponent: React.ComponentType<TProps>,
        selectProps: (state: TStoreState) => TInjectedProps
    ) =>
    class WithStoreSubscription
        extends React.Component<Subtract<TProps, TInjectedProps> & IWithStoreSubscriptionProps<TStoreState>,
                                IWithStoreSubscriptionState<TInjectedProps>> {
        /**
         * The subscription to the store.
         */
        public subscription: StoreSubscription<IStore<TStoreState>, TStoreState> = new StoreSubscription();

        constructor(props: Subtract<TProps, TInjectedProps> & IWithStoreSubscriptionProps<TStoreState>) {
            super(props);
            this.handleState = this.handleState.bind(this);
            this.state = {
              selectedProps: null
            };
        }

        public componentDidMount() {
            this.subscribe();
        }

        public componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        /**
         * Subscribe the store.
         */
        public subscribe() {
            let store: IStore<TStoreState> = null;
            if (isStoreInjected(this.props)) {
                store = this.props.store;
            } else if (isStoreResolvedFromCotainer(this.props)) {
                store = this.props.container.resolve<IStore<TStoreState>>(this.props.storeRegistrationKey, this.props.storeInstanceName);
            } else {
                throw new Error("Either store or storeRegistrationKey must be set when using subscribeStore wrapper component");
            }

            this.subscription.subscribeStore(store, this.handleState);
        }

        /**
         * Update the injected props from the store state.
         * @param state The state from the store.
         */
        public handleState(state: TStoreState): void {
            this.setState({
                selectedProps: selectProps(state)
            });
        }

        /**
         * Render the component.
         */
        public render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props

            return React.createElement(wrappedComponent, { ...this.props, ...this.state.selectedProps } as TProps);
        }
    };
