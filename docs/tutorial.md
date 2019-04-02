# Tutorial

## Setup an app

This tutorial assumes that you are comfortable with setting up a react app.

Once you have a react app setup you can start with this tutorial. See for example [this tutorial](https://levelup.gitconnected.com/typescript-and-react-using-create-react-app-a-step-by-step-guide-to-setting-up-your-first-app-6deda70843a4) for quickly setting up react with typescript.

We also have several examples for the different packages that can help to understand a working setup.

Once you have your app running you can add the rfluxx packages via:

    npm i --save rfluxx rfluxx-routing

## Integrating RFluXX routing

### Define the site map tree

The starting point of each react app is usually the index.tsx. To this startup code we will add the creation of the site map tree and the initialization of the rfluxx routing package.

Because the site map tree can become quite large it makes sense to extract it into one or several modules, e.g. `SiteMap.tsx`:

```typescript
import { withPageContext } from "rfluxx-routing/PageContextProvider";
import { ISiteMapNode } from "rfluxx-routing/SiteMapStore";

import { Home } from "./components/home";
import { Page1 } from "./components/page1";

export const siteMap: ISiteMapNode = {
    caption: "Home",
    routeExpression: "/home",
    render: p => withPageContext(<Home />),
    children: [
        {
            caption: "Page 1",
            routeExpression: "page1",
            containerFactory: new MyPage1ContainerFactory(),
            render: p => withPageContext(<Page1 />)
        },
        // ...
    ]
};
```

Let's examine the home site map node in more detail.

    caption: "Home",

Each node has a caption that is down in different places in the UI to the user, e.g. the breadcrumb. You could also use it as the title of your pages.

    routeExpression: "/home",

Every node also needs a route expression that defines which URLs should show this node. Routes starting with a slash e.g. `/home` are absolute and interpreted with regard to the base url of the app. Routes without a starting slash e.g. `page1` are combined with the route of the parent. In this case to get `/home/page1`.

The default initialization code of rfluxx assumes that the routes of nodes further down the tree are more specific ("longer") than the routes at the top of the tree. The routes further down the tree are matched before the routes at the top of the tree.

    containerFactory: new MyPage1ContainerFactory(),

Each page has the possibility to define it's own container factory. This reduces friction between pages as the registrations in one page can be changed without affecting another page. If no container factory is specified for a page the central factory is used. In any case a new container is created per page opened.

    render: p => withPageContext(<Home />),

In the render property we define which component should be rendered as the content of this site map node.

The `withPageContext` function injects additional props into components whose props extend/implement the `IPageContextProps` interface. The most important of those props is the `container` which can be used to resolve the different stores for this page.

    children: [
        {
            ...
        }
    ]

Finally the site map node can define children that are logically positioned beneath this site map node.

## Write a container factory

The container is used for dependency injection of required stores or other classes.

The framework provides an interface to integrate your container of choice but comes with a default container.

The page management needs to know how to create a container for your app if the need arises. Therefore, you must provide at least one central implementation of the `IPageContainerFactory` interface that creates a new container for any page that does not specify its own container factory.

`ContainerFactory.ts`:

```typescript
import { IContainer, SimpleContainer } from "rfluxx";

import { IGlobalComponents, IPageContainerFactory, SimplePageContainerFactoyBase } from "rfluxx-routing/IPageContainerFactory";

import { HomeStore } from "./stores/HomeStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(container: SimpleContainer, url: URL, routeParameters: RouteParameters): void
    {
        registerStore(
        container,
        c => new HomeStore({
            pageCommunicationStore: c.resolve("IPageCommunicationStore")
        })).as("IHomeStore");
    }
}
```

Let's discuss the details here.

    export class ContainerFactory extends SimplePageContainerFactoryBase

We extend the `SimplePageContainerFactoryBase` class which is a base implementation of a container factory that works with the `SimpleContainer` who comes with the rfluxx package.

    protected registerStores(container: SimpleContainer, url: URL, routeParameters: RouteParameters): void

You need to implement a single function that registers the required stores in the container.

It provides the following arguments:

- `container`: the container in which you can register your stores. It already comes with some stuff preregistered.
- `url`: this is the URL for which a page is loaded
- `routeParameters`: nap of parameters that were extracted from the route

```ts
registerStore(
    container,
    c => new HomeStore({
        pageCommunicationStore: c.resolve("IPageCommunicationStore")
    })).as("IHomeStore");
```

Here we register the `HomeStore` which implements the interface `IHomeStore`. It's good practice to use the interface as the key off the registration. 

We use the helper function `registerStore` which ensures injection of common dependencies into the stores (e.g. `IActionFactory` and `IObservableFetcher`). It also allows to register the store type multiple times by applying a postfix to the registration key if given. In case you apply such an additional postfix make sure to use `resolveStore` to get an instance of the store.

The home store has dependencies on two of the preregistered components in the container:

- `IPageCommunicationStore`: store used to communicate with other pages 

## Create app component

For the pages to show you need to design your app component in a proper way.

It needs to render the `CurrentPage` component that always shows the page that the current url leads to.

`App.tsx`:

```typescript
import * as React from "react";
import * as Rx from "rxjs";

import { Breadcrumb } from "../../src/Breadcrumb";
import { CurrentPage } from "../../src/CurrentPage";

export interface IAppProps
{
    siteMapStore: ISiteMapStore;
    pageManagementStore: IPageManagementStore;
}

export interface IAppState
{
}

export class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps)
    {
        super(props);

        this.state = {
           
        };
    }

    public render(): any
    {
        return <div>
            <Breadcrumb siteMapStore={this.props.siteMapStore}
                       renderPart={(sn: ISiteMapNode) => <span>... {sn.caption}</span>} /><br />
            <CurrentPage pageManagementStore={this.props.pageManagementStore} />
        </div>;
    }
}

```

This app renders the current page and the breadcrumb to this page. Naturally you can customize your app in any way you like.


## Initialize routing

The final step is to start up your app and configuring it to use rfluxx routing.

`index.tsx`

```typescript
import * as React from "react";
import * as ReactDom from "react-dom";

import * as RfluxxRouting from "rfluxx-routing";

import { App } from "./App";
import { siteMap } from "./SiteMap";
import { ContainerFactory } from "./ContainerFactory";

const containerFactory = new ContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory,
    targetNumberOpenPages: 5,
    rootPath: "/"
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore} pageManagementStore={globalStores.pageManagementStore} />,
        root);
});

```

That's it. We load the site map, create a container factory and init rfluxx routing with them.

Afterwards we start up the react app as usual.

## Disclaimer

I try to keep this up to date. But the code of the examples will always be more up to date.