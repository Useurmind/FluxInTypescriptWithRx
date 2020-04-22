# Using Route Parameters

In the previous section you saw how to define route parameters. Naturally you want to use them in your pages to configure them.

You have the following possibilities to use the values from the route parameters in the url.

## Using Site Map Node Parameters

When specifying your site map node, you have the possibility to directly use the route parameters in the function that creates the page.

```typescriptreact
export const siteMapNode: ISiteMapNode = {
    caption: "My site map node with route parameters",
    routeExpression: "/path/to/site/{id}",
    containerFactory: new ContainerFactory(),
    render: p => <span>This page is for object with id {p.get("id")}</span>
};
```

Here we use the route parameter argument of the factory method for the site map node to retrieve the id parameter from the route.

## Consuming Page Context

TODO

## Consume from stores

You can retrieve an Observable for the route parameters from the container and inject it via store options. Subscribing it will deliver the latest route parameters whenever one of them changed.

__ContainerFactory.ts__
```typescript
export class ContainerFactory extends SiteMapNodeContainerFactoryBase
{
    protected registerStores(builder: ISiteMapNodeContainerBuilder): void
    {
        registerStore(builder, "IMyStore", (c, injOpt) => MyStore(injOpt({
            routeParameters: c.resolve("RouteParametersStream")
        })));
    }
}
```

In the store you can subscribe it to know whenever a route parameter changes:

__MyStore.ts__
```typescript
export interface IMyStoreOptions
    extends IInjectedStoreOptions
{
    /**
     * Route parameters of the page.
     */
    routeParameters: Observable<RouteParameters>
}

export const MyStore = (options: IMyStoreOptions) => {
    const initialState = {
        // ...
    };

    const [state, setState, store] = useStore<IJobLogSourceStoreState>(initialState);

    options.routeParameters.subscribe(p => {
        // retrieve the parameter value
        const id = p.getAsInt("id");

        // do something with the parameter value
        setState({
            ...state.value,
            id
        });
    })
}
```

