// import * as React from "react";
// import { IStore, subscribeStore, subscribeStoreSelect, SubscribeStoreReturnType, SubscribeStoreSelectReturnType } from "rfluxx";
// import { Subtract } from "utility-types";

// import { IPageContextProps } from "../PageContextProvider";

// /**
//  * Higher Order Component (HOC) to subscribe a component to a store.
//  * This is the version of the HOC from the ROUTING framework. In addition this injects the container from the page.
//  * The state of the store will be injected as props into the wrapped component.
//  * @param wrappedComponent The component that is wrapped and injected with the store state.
//  */
// export const subscribeStoreRouted = <TStoreState extends object>() =>
//      <TProps extends TStoreState>(wrappedComponent: React.ComponentType<TProps>)
//         : SubscribeStoreReturnType =>
//         subscribeStore<TStoreState>()<TProps>(wrappedComponent);

// /**
//  * Higher Order Component (HOC) to subscribe a component to a store.
//  * This is the version of the HOC from the ROUTING framework. In addition this injects the container from the page.
//  * The state of the store will be injected as props into the wrapped component.
//  * You can choose which props should be injected through a select function.
//  * @param wrappedComponent The component that is wrapped and injected with the store state.
//  */
// export const subscribeStoreSelectRouted = <TStore extends IStore<TStoreState>, TStoreState extends object>() =>
//         <TProps extends TInjectedProps, TInjectedProps extends object>(
//             wrappedComponent: React.ComponentType<TProps>,
//             selectProps: (state: TStoreState, store: TStore) => TInjectedProps)
//             : SubscribeStoreSelectReturnType =>
//             subscribeStoreSelect<TStore, TStoreState>()<TProps, TInjectedProps>(wrappedComponent, selectProps);
