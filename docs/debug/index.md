# Home

The `rfluxx-debug` package contains a debug window that can be used to analyze the behaviour of the rfluxx library.

Currently it supports showing data from several stores in the routing library.

## Setup

Adding the debug window is quite simple.

First install the rfluxx debug package via npm:

```
npm i --save rfluxx-debug
```

Then you need to register the stores required for the debug window in the global container factory:

```typescript
export class ContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        // your registrations 
        // ...

        registerRfluxxDebug(builder);
    }
}
```

Finally, add the debug window into your page master.

```typescriptreact
public render(): any
{
    return <div>
        { 
            // the rest of your master
            // ...
        }
        <DebugWindow storeRegistrationKey="IDebugWindowStore" />
    </div>;
}
```
This will render a button which can be used to open the debug window.
You can place it wherever you like.

## Notice

The debug window uses the material-ui library to render its contents.

## Production Build

In production builds you usually want to exclude/hide the debug window.

Hiding can be achieved by e.g. using the [webpack define plugin](https://webpack.js.org/plugins/define-plugin/) and setting a `PRODUCTION`. Use this variable to conditionally render the window.

```typescriptreact
// after your imports
declare var PRODUCTION;

// more stuff

public render(): any
{
    return <div>
        { 
            // the rest of your master
            // ...
        }

        { !PRODUCTION &&
            <DebugWindow storeRegistrationKey="IDebugWindowStore" />
        }
    </div>;
}
```