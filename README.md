RFluxx - Flux in Typescript with RxJS
============================

Framework that implements the Flux pattern applied in many React apps using RxJS.

This framework basically provides two classes:
- Commands which are observables
- Stores which are observables

A UI component (exemplary implemented with react) can bind to the stores which are observables of their state.

When a user interaction must be handled the UI components can call a command on the stores which in turn will update its state.

## Install

    npm i rfluxx

## Docs

Start [here](/docs/index.md)

## Build and Run

In root:

    lerna bootstrap

In packages/rfluxx:

    npm run lint  // to execute tslint
    npm run test  // to execute karma
    npm run start

## License

MIT, see [LICENSE](LICENSE.MD)
