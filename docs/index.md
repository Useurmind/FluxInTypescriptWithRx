# RFluxx

## Motivation

I wrote some blog posts that should cover the idea and motivation behind the framework:

- https://useurmind.de/RFluXX-Flux-in-Typescript-with-Rx/
- https://useurmind.de/RFluXX-Middleware/

## Core concepts

The core concepts that you need to understand to work with the framework are the following:

- __Stores__: Stores keep track of the state of a part of the UI of your app. They are implemented as an observable that can be subscribed by components to be updated when the state changes.
- __Actions__: Actions are usually provided by stores (but they can also stand for themselves) to allow components to communicate with them. Actions should trigger all state changes in the stores and can be handed an argument to describe details of the action.
- **Action Event**: An action is an object that can be triggered. When an action is triggered we call this an action event.

## Advanced concepts

There are however some more advanced concepts that if understood can help you use the more interesting features of the framework.

- __Middleware__: The framework allows you to attach middleware to all actions that are executed. Middleware can be anything from logging to ignoring the action altogether.
- __Time Travel__: If the action pattern is applied correctly you can time travel and rewind the actions that the user performed when interacting with the UI.
    - __Action Events__:
    - __Replay__
    - 

## Creating stores

Stores are in some sense similar to react components. They have options to configure them from the outside (similar to props). They have state which they can change over time in response to action events.

They main differences to components are:

- changes to the state of the store can be subscribed by anyone (not just by themselves)
- they provide actions (or are bound to them) by which their state can be influenced from the outside
- and **most importantly** the lifecycle of a store can be managed in any way you desire (in contrast to the automatism by react)

To create a store you have to define at least three things:

- options
- state
- the store itself

**Example:**

    import * as rfluxx from "rfluxx";
    import * as rx from "rxjs";

    export interface MyStoreOptions 
        // extend rfluxx.IInjectedStoreOptions to be compatible with rfluxx store factory
        extends rfluxx.IInjectedStoreOptions
    {
        // fields that represent configuration of the store
    }

    export interface MyStoreState
    {
        // fields for the state managed by this store
    }

    // this interface should be used by the consumers of this store
    // it should contain fields for the actions of the store
    export interface IMyStore extends rfluxx.IStore<IMyStoreState>
    {
        // actions as fields
    }

    export class MyStore extends rfluxx.Store<MyStoreState>
    {
        constructor(private options: MyStoreOptions)
        {
            super({
                ...options,
                initialState: {
                    // set default state fields
                }
            });
        }
    }