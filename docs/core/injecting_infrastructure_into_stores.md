# Inject infrastructure into stores

Most stores will need to create actions and fetch data from a backend. For this purpose the rfluxx library provides some infrastructure that integrates with the main functions of the library. Using it is optional. But it is required to leverage the more advanced possiblities of the framework.

## The correct example

**NOTE: This is valid for the core library. For the routing library this differs slightly! **

Without giving any details we will first show the correct example. This is a short form of everything that follows below.
We are applying the rfluxx initialization api here. It provides an entrypoint into rfluxx to completely configure it.

```typescript
import { init as rfluxx_init } from "rfluxx";

const container = rfluxx_init()
    // here we are telling rfluxx to provide a container
    .useContainer(builder =>
    {
        // this function should contain all your registration logic

        // register your middleware in the container
        builder.register<IMyMiddleware>(c => new MyMiddleware({
            // ... options
        })).in("IActionMiddleware[]");

        // register your store
        registerStore(builder, "IMyStore", (c, injOpt) => new MyStore(injOpt({
            someOption: // ...
        })));
    })
    // the following calls register the infrastructure of rfluxx
    //.useFetcher()        // optional as useTimeTravel will automatically include this
    //.useActionFactory()  // optional as useTimeTravel will automatically include this
    .useTimeTravel({        
        // the true makes the time traveler available 
        // on the window as property "timeTraveler"
        // and the event log as property "eventLog"
        registerInWindow: true
    })
    // build the container from the previously configured content
    .build();
```

You can see a very small call to `injOpt` which is a short form for inject options. This function will take care to inject the action factory and observable fetcher into your stores options.

For this to work you need to implement the options and the constructor of your store as follows:

```typescript
// the options interface should extend IInjectedStoreOptions
export interface IMyStoreOptions extends IInjectedStoreOptions
{
}

export class MyStore // ...
{
    constructor(options: IMyStoreOptions) {
        // call the constructor of the base class and hand down all options
        super({
            ...options
        })
    }
}
``` 

As you can see the store implementation does not require much extension. You just extend the `IInjectedStoreOptions` interface which contains properties for an action factory and a fetcher. The options then need to be passed down to the constructor of the base class.

After this you can use the fetcher and create actions in your store that will be bound to all the infrastructure, e.g. middleware, provided by the rfluxx library.

## Middleware & the action factory

### No action factory

Actions are created by factories. If you do not specify an action factory to be used the `SimpleActionFactory` will be used. This action factory doesn't do anything except creating the actions. However, if you want to apply middleware the actions created in this way will not be seen by the middleware.

```typescript
// register your middleware in the container
builder.register<IMyMiddleware>(c => new MyMiddleware({
    // ... options
})).in("IActionMiddleware[]");

// register your store
builder.register<IMyStore>(c => new MyStore({
    // no action factory specified during creation
    someOption: // ...
}))
```

If you use this store all actions created by the store will not be visible to the registered middleware.

### The default action factory

You could do the following to fix this:

```typescript
// register your middleware in the container
builder.register<IMyMiddleware>(c => new MyMiddleware({
    // ... options
})).in("IActionMiddleware[]");

// register the action factory and dependencies
registerDefaultActionFactory(builder);


// register your store
builder.register<IMyStore>(c => new MyStore({
    // no action factory specified during creation
    someOption: // ...,
    actionFactory: c.resolve<IActionFactory>("IActionFactory")
}))
```

If you hand down the options to the constructor of the base class of the store, all action calls will be seen by the registered middleware.

```typescript
export interface IMyStoreOptions {
    // the action factory as option for the store
    actionFactory: IActionFactory
}

export class MyStore // ...
{
    constructor(options: IMyStoreOptions) {
        super({
            ...options
        })
    }
}
``` 

### Observable fetcher

Fetching stuff from a server is a pretty important task for a store. To be compatible with time travel however you need to take care of not fetching during time travel. This is implemented by the class `ObservableFetcher`. By default a fetcher is used that is not registered to any infrastructure. To change this you can take a similar approach as above.

```typescript
// register the observable fetcher and dependencies
registerObservableFetcher(builder);

// register your store
builder.register<IMyStore>(c => new MyStore({
    // no action factory specified during creation
    someOption: // ...,
    actionFactory: c.resolve<IActionFactory>("IActionFactory"),
    fetcher:  c.resolve<IObservableFetcher>("IObservableFetcher")
}))
```

If you already implemented the constructor of your store in the same way as above, everything will be handed down to the base class of the store.

From then on you can use the fetcher inside your store to do backend calls.

```typescript
this.fetch("http://my.backend.com//some/path")
    .subscribe(
        result => { /* ... */ },
        error => { /* ... */ },
        () => { /* ... */ }
    )
```