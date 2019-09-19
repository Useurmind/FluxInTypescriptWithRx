# Container Context

This package provides a react context for a dependency injection container. It holds a container instance that can be used in components to retrieve stores.

## Setting up the context

First you need to add the container provider to the outer most place starting from which the container should be available. This could be your app component.

```typescriptreact
import { ContainerContextProvider } from "rfluxx-react";

// ....

    public render(): any
    {
        return <ContainerContextProvider container={this.props.container}>
           { /* your components */ }
        </ContainerContextProvider>;
    }

// ...
```

__NOTE:__ If you use the RFluXX routing framework you do not need to do this.

For creating a container see [Container](../core/container.md).

## Consuming the context

There is a difference in consuming the context. For functional components you use the new react hook api. For class components you need to wrap them in a function call (HOC). As functional components and hooks are much easier to use I recommend to use them for binding to stores.

### Class components

Class components that want to consume the container context should implement a prop called `container` of type `IContainer`.

```typescript
import { IContainer } from "rfluxx";

export interface IMyComponentProps
{
    container: IContainer;
}
```

Usually you would not implement this property by yourself. Instead you would bind the component directly to a store from the container (see [Bind via HOC](binding_via_hoc.md)).

This prop can then be filled via a HOC.

```typescriptreact
public render(): any
{
    return <div>
        { /* ... */ }
        { withContainer(<MyComponent />) }
        { /* ... */ }
    </div>
}
```

### Functional components

Functional components do not need any setup. You just use the hooks described in [Bind via Hooks](binding_via_hooks.md).
