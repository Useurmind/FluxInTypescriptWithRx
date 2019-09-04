# Reducers

The reducer pattern comes from the redux library. A guide can be found [here](https://redux.js.org/basics/reducers).

It is an interesting pattern and can offer benefits in many situations. You should therefore know it and consider applying it.

## Reducers explained

Reducers are just functions that should have no side effects. The input of a reducer is at least the current state of your store. The output is the state that should be applied to your store.

You can add any other input to your reducer that is required.

**Example**
```typescript
function increment(state: ICounterState) : ICounterState
{
  return {
    ...state,
    counter: state.counter + 1
  };
}
```

## No side effects

A reducer should be a pure function. Therefore, it should not have any side effects. This makes it very testable, reusable and straight forward to implement and apply.

A side effect when implementing a store mostly means making backend calls or changing the state of the store.