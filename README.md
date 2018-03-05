Flux in Typescript with RxJS
============================

This repository contains a very small example of how to apply RxJS in a flux architecture.

This framework basically provides two classes:
- Commands which are observables
- Stores which are observables

A UI component (exemplary implemented with react) can bind to the stores which are observables of their state.

When a user interaction must be handled the UI components can call a command on the stores which in turn will update its state.

Build and Run
-----------------
After downloading the git repository do an

    npm update
    npm run build
    npm run run

An http server will now server the content of the example probably under 127.0.0.1:8080/index.html.
Check the output of the run command to see the served ips and ports.


License
-------

MIT, see [LICENSE](LICENSE.MD)
