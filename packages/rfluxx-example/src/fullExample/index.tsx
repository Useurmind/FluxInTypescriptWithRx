import * as React from "react";
import * as ReactDom from "react-dom";
import * as RfluxxRouting from "rfluxx-routing";
import { ISiteMapNode, withPageContext } from "rfluxx-routing";

import { App } from "./App";
import "./bootstrap";
import { ContainerFactory } from "./ContainerFactory";
import { EditPage } from "./EditPage/EditPage";
import { EditPageCaption } from "./EditPage/EditPageCaption";
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
            caption: p => <span>Some span</span>,
            routeExpression: "some/span",
            render: p => <span>Some text in a span</span>,
            showInSidebar: "/home/some/span#fancy"
        },
        {
            caption: p => <span>Form with select page</span>,
            routeExpression: "/form/with/select",
            render: p => <FormPage />
        },
        {
            caption: p => <span style={{color : "red"}}>Select string</span>,
            routeExpression: "/select/page/",
            containerFactory: new SelectPageContainerFactory(),
            render: p => <SelectPage caption="Default"/>,
            showInSidebar: false
        },
        {
            caption: p => <EditPageCaption />,
            routeExpression: "edit/page/",
            render: p => <EditPage />
        },
        {
            caption: "Endless sequence",
            routeExpression: "/endlessSequence/{sequenceNumber}/",
            render: p => <EndlessSequencePage />,
            showInSidebar: new Map([["sequenceNumber", "1"]])
        }
    ]
};

const containerFactory = new ContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory,
    targetNumberOpenPages: 5,
    rootPath: "/fullExample/"
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore}
             pageManagementStore={globalStores.pageManagementStore} />,
        root);
});
