import { createMuiTheme } from "@material-ui/core";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as RfluxxRouting from "rfluxx-routing";
import { ISiteMapNode, withPageContext } from "rfluxx-routing";

import { App } from "./App";
import { ContainerFactory } from "./ContainerFactory";
import { EditPage } from "./EditPage/EditPage";
import { EditPageCaption } from "./EditPage/EditPageCaption";
import { EndlessSequencePage } from "./EndlessSequence/EndlessSequencePage";
import { ContainerFactory as FormDemoPageContainerFactory } from "./FormDemo/ContainerFactory";
import { FormDemoPage } from "./FormDemo/FormDemoPage";
import { FormPage } from "./FormWithSelectPage/FormPage";
import { HomePage } from "./HomePage";
import { IntraRoutingPage } from "./IntraPageRouting/IntraRoutingPage";
import { ContainerFactory as SelectPageContainerFactory } from "./SelectPage/ContainerFactory";
import { ContainerFactory as BoundPageContainerFactory} from "./BoundPage/ContainerFactory";
import { SelectPage } from "./SelectPage/SelectPage";
import { BoundPageBound } from './BoundPage/BoundPage';
import { MultiLanguagePage } from './Internationalization/MultiLanguagePage';

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
            caption: p => <span>Intra page routing</span>,
            routeExpression: "/intraPageRouting?moreStuff={*}&moreDifferentStuff={*}",
            render: p => <IntraRoutingPage />,
            showInSidebar: new Map([["moreStuff", "false"], ["moreDifferentStuff", "false"]])
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
            caption: "Form Demo",
            routeExpression: "form/demo/",
            containerFactory: new FormDemoPageContainerFactory(),
            render: p => <FormDemoPage />
        },
        {
            caption: "Endless sequence",
            routeExpression: "/endlessSequence/{sequenceNumber}/",
            render: p => <EndlessSequencePage />,
            showInSidebar: new Map([["sequenceNumber", "1"]])
        },
        {
            caption: "Bound page",
            routeExpression: "/boundPage",
            containerFactory: new BoundPageContainerFactory(),
            render: p => <BoundPageBound storeRegistrationKey="IBoundPageStore" />
        },
        {
            caption: "Internationalization",
            routeExpression: "/internationalization",
            render: p => <MultiLanguagePage />
        }
    ]
};

const containerFactory = new ContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory,
    targetNumberOpenPages: 5,
    rootPath: "/"
});

const theme = createMuiTheme();

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore}
             pageManagementStore={globalStores.pageManagementStore}
             theme={theme} />,
        root);
});
