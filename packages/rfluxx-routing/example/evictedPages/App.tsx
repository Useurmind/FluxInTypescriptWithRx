import * as React from "react";
import { IContainer } from "rfluxx";

import { Breadcrumb } from "../../src";
import { CurrentPage } from "../../src";
import { CurrentSiteMapNode } from "../../src";
import { OpenPageList } from "../../src";
import { withPageContext } from "../../src";
import { IPageManagementStore } from "../../src";
import { RouterLink } from "../../src";
import { ISiteMapNode, ISiteMapStore } from "../../src";

import { Master } from "./Master";

export interface IAppProps
{
    siteMapStore: ISiteMapStore;
    pageManagementStore: IPageManagementStore;
}

export interface IAppState
{
}

export class App extends React.Component<IAppProps, IAppState> {

    constructor(props: any)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        return <CurrentPage pageManagementStore={this.props.pageManagementStore}
                            renderNoPage={() => <div className="container-fluid">
                                404: No page found on this url!</div>}
                            pageMasterTemplate={<Master />} />;
    }
}
