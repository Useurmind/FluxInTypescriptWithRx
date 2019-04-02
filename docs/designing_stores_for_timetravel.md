# Designing stores for time travel

There are some advanced but nevertheless crucial information that you should follow when creating stores that should allow time travel. Not following these guidelines will render correct time travel impossible.

Correct time travel relies on two important facts:

* **No side effects:** actions during time travel have no side effects
* **Action2State:** all state changes in stores are directly triggered by an action of the store

## No side effects

When time traveling you will replay action events multiple times. Therefore, it is important that the actions do not execute backend calls during a replay. 

First, the repeated backend calls would turn be results and change the timeline. Second you would induce changes into the backend database during time travel if any backend calls were made.

To avoid this we offer an `IObservableFetcher` interface that lets you do backend calls in a fetch manner. Only that you can subscribe these calls as any other rx observable.

During time travel the observable fetcher will not make any actual fetches. In fact he will not do anything at all (he returns an empty observable).

## Action2State

Simply speaking, when fetching stuff via `IObservableFetcher` call an action in the subscribe call. 

More completely, whenever an action is performed outside your current time travel context (your app or in case of rfluxx-routing your page) you need to capture the result with an action call which in turn updates your store state.