# RFluxx

## Motivation

I wrote some blog posts that should cover the idea and motivation behind the framework:

- [https://useurmind.de/RFluXX-Flux-in-Typescript-with-Rx/](https://useurmind.de/RFluXX-Flux-in-Typescript-with-Rx/)
- [https://useurmind.de/RFluXX-Middleware/](https://useurmind.de/RFluXX-Middleware/)

## Core concepts

The core concepts that you need to understand to work with the framework are the following:

- __Stores__: Stores keep track of the state of the UI of your app. They are implemented as an observable and can be subscribed by your components. This subscription allows for up to date state being available in the components all the time.
- __Actions__: Actions are to be triggered by components whenever a state change is required. They are usually provided by stores but can also stand for themselves. When triggered an action event object must be provided.
- **Action Event**: Whenever an action is triggered we call this an action event. An action event is also the object that is provided as parameter when triggering an action. It transports information from components to the stores. 

## Framework overview

The framework currently contains the following sub packages:

| Package name | Description |
| --- | --- |
| rfluxx | The core library with stores, actions, dependency injection, and middleware support. |
| rfluxx-react | React integration for the core library for context and component subscription/binding logic. |
| rfluxx-routing | Routing support integrated with the rfluxx library completely based on the store infrastructure. |
| rfluxx-i18n | Internationalization package for rfluxx. |
| rfluxx-mui-theming | Integration with material-ui.com theming. |
| rfluxx-debug | A debug window for the rfluxx library. |