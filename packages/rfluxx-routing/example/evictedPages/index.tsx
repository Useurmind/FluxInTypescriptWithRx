import * as React from "react";
import * as ReactDom from "react-dom";

import * as RfluxxRouting from "../../src";
import { withPageContext } from "../../src/PageContextProvider";
import { ISiteMapNode } from "../../src/SiteMapStore";

import { App } from "./App";
import { ContainerFactory } from "./ContainerFactory";
import { EditPage } from "./EditPage/EditPage";
import { EndlessSequencePage } from "./EndlessSequence/EndlessSequencePage";
import { FormPage } from "./FormWithSelectPage/FormPage";
import { HomePage } from "./HomePage";
import { ContainerFactory as SelectPageContainerFactory } from "./SelectPage/ContainerFactory";
import { SelectPage } from "./SelectPage/SelectPage";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
// tslint:disable-next-line:no-unused-expression
es5.nothing;
// tslint:disable-next-line:no-unused-expression
es6.nothing;

const siteMap: ISiteMapNode = {
    caption: "Home",
    routeExpression: "home",
    render: p => <HomePage />,
    children: [
        {
            caption: "Form with select page",
            routeExpression: "/form/with/select",
            render: p => withPageContext(<FormPage />)
        },
        {
            caption: "Select string",
            routeExpression: "/select/page",
            containerFactory: new SelectPageContainerFactory(),
            render: p => withPageContext(<SelectPage caption="Default"/>)
        },
        {
            caption: "Edit page",
            routeExpression: "/edit/page",
            render: p => withPageContext(<EditPage />)
        },
        {
            caption: "Endless sequence",
            routeExpression: "/endlessSequence/{sequenceNumber}",
            render: p => withPageContext(<EndlessSequencePage />)
        }
    ]
};

const containerFactory = new ContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory,
    targetNumberOpenPages: 5,
    rootPath: "evictedPages"
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore}
             pageManagementStore={globalStores.pageManagementStore} />,
        root);
});
