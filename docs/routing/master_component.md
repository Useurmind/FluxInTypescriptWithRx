# Master component

Usually, apps have a common theme around the pages that are opened on different routes. We call this a master component.

Naturally, you would expect to have all the dependency injection and context management available in those master components.

The routing framework therefore makes master components a first class citizen that you can integrate into your app the same way as other pages.

## Master and dependency injection

The master component receives the same context as the page itself.

Therefore, the registrations required by the master component should be globally available.

## A simple master

```ts
// Receive the page to render as a prop
export interface IMasterProps extends IPageMasterProps
{
}

export interface IMasterState
{
}

export class Master extends React.Component<IMasterProps, IMasterState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        return <div>
     { this.props.pageComponent }
        </div>;
    }
}

```

## Applying a master

In your app root component you should set the master component as a prop of the current page.

```ts
public render(): any
{
    return <CurrentPage pageManagementStore={this.props.pageManagementStore}
        renderNoPage={() => <div>
            404: No page found on this url!</div>}
                    pageMasterTemplate={<Master />} />;
}
```