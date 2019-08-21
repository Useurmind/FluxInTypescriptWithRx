# Testing Stores

Unit testing is a key area for every modern application framework. In RFluXX unit testing support is focused on the store class.

## Testing store initialization

Testing store initialization is pretty simple. You create your store and assert it's state.

```typescript
const store = new CounterStore({
  initialCount: 5
});

store.subscribe(state => {
  assert(state.counter).toBe(5);
});
```

Here you see a pretty common pattern: subscribe the store to get its state and assert it. The subscribe handler is usually executed the first time together with the subscribe call. That means you can use it as if it was not asynchronous.

## Testing actions

To test simple actions without backend calls you do basically the same. Create the store, call the action(s), and assert the state.

```typescript
const store = new CounterStore({
  initialCount: 5
});

store.increment.trigger(1);

store.subscribe(state => {
  assert(state.counter).toBe(6);
});
```

## Testing actions with backend calls

To test actions with backend calls effectively you need to mock the results of the backend calls.

Remember that your stores should do backend calls through an `IObservableFetcher`. You can simply use a fake for this interface and inject it into your tested store. RFluXX even provides a class for this the `FakeFetcher`.

```typescript
const fetcher = new FakeFetcher({
  // response stating the save was executed
  fixedResponse: new Response("true")
});

const store = new CounterStore({
  initialCount: 5,
  fetcher
});

// this action should call the backend to save the count
store.saveCount.trigger(null);

store.subscribe(state => {
  assert(state.isSaved).toBe(true);
});
```

If you need more flexibility with the response you can instead hand a `createResponse` handler to the `FakeFetcher`. There you can create a response based on the input to fetch.

```typescript
const fetcher = new FakeFetcher({
  createResponse: (requestInfo: RequestInfo, init?: RequestInit) => {
    // create response based on input to fetch
    return new Response();
  }
});
```

## Testing debounced actions