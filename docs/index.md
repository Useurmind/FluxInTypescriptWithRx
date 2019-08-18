# RFluxx

## Motivation

I wrote some blog posts that should cover the idea and motivation behind the framework:

- https://useurmind.de/RFluXX-Flux-in-Typescript-with-Rx/
- https://useurmind.de/RFluXX-Middleware/

## Core concepts

The core concepts that you need to understand to work with the framework are the following:

- __Stores__: Stores keep track of the state of the UI of your app. They are implemented as an observable and can be subscribed by your components. This subscription allows for up to date state being available in the components all the time.
- __Actions__: Actions are to be triggered by components whenever a state change is required. They are usually provided by stores but can also stand for themselves. When triggered an action event object must be provided.
- **Action Event**: Whenever an action is triggered we call this an action event. An action event is also the object that is provided as parameter when triggering an action. It transports information from components to the stores. 

## Advanced concepts

There are however some more advanced concepts that if understood can help you use the more interesting features of the framework.

- __Middleware__: The framework allows you to attach middleware to all actions that are executed. Middleware can be anything from logging to ignoring the action altogether.
- __Time Travel__: If the action pattern is applied correctly you can time travel and rewind the actions that the user performed when interacting with the UI.
    - __Action Events__:
    - __Replay__
    - 