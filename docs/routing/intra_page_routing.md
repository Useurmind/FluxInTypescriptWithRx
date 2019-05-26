# Intra Page Routing

Pages are for managing state. They define an enclosed set of store that hold the state. At the same time they are assigned a route with which you can link to them. But inside a page there may also be the need to show different components depending on the parameters that are found in the route.

For this purpose rfluxx provides a set of routing helpers.

## Conditional Route Component

This component renders another component only when the given condition is true.

```ts
public render(): any
{
    return <div>
        Some stuff is always there.
        <ConditionalRouteComponent condition={params => params.getAsBool("showdeeproute") === true }>
            Show this only when the condition is true.
            Which means only show this when the route parameter `showdeeproute` is true.
        <ConditionalRouteComponent>
    </div>;
}
```

The parameters will still influence the pageid creation and by that how state is managed as normal.