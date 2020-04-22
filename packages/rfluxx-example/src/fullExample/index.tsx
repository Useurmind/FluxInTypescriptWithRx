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
import { ContainerFactory as BoundPageContainerFactory} from "./BoundPage/ContainerFactory";
import { BoundPageBound } from './BoundPage/BoundPage';
import { MultiLanguagePage } from './Internationalization/MultiLanguagePage';
import { siteMapNode as selectPageSiteMapNode} from "./SelectPage/SiteMapNode";
import { siteMapNode as intraRoutingPageSiteMapNode} from "./IntraPageRouting/SiteMapNode";
import { siteMapNode as internationalizationPageSiteMapNode} from "./Internationalization/SiteMapNode";
import { siteMapNode as formPageSiteMapNode} from "./FormWithSelectPage/SiteMapNode";
import { siteMapNode as formDemoPageSiteMapNode} from "./FormDemo/SiteMapNode";
import { siteMapNode as endlessSequencePageSiteMapNode} from "./EndlessSequence/SiteMapNode";
import { siteMapNode as editPageSiteMapNode} from "./EditPage/SiteMapNode";
import { siteMapNode as boundPageSiteMapNode} from "./BoundPage/SiteMapNode";
import { siteMapNode as parametersInStoreSiteMapNode} from "./StoreUsesParameters/SiteMapNode";

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
        intraRoutingPageSiteMapNode,
        formPageSiteMapNode,
        selectPageSiteMapNode,
        editPageSiteMapNode,
        formDemoPageSiteMapNode,
        endlessSequencePageSiteMapNode,
        boundPageSiteMapNode,
        parametersInStoreSiteMapNode,
        internationalizationPageSiteMapNode
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
