import * as React from "react";
import { IContainer } from "rfluxx";

import { Breadcrumb, IPageContextProps, IPageMasterProps, SideBar } from "../../src";
import { CurrentPage } from "../../src";
import { CurrentSiteMapNode } from "../../src";
import { OpenPageList } from "../../src";
import { withPageContext } from "../../src";
import { IPageManagementStore } from "../../src";
import { RouterLink } from "../../src";
import { ISiteMapNode, ISiteMapStore } from "../../src";

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
        return <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <h1>Rfluxx Evicted Pages Example</h1>
                    {withPageContext(<Breadcrumb />)}
                </div>
            </div>

            <div className="row">
                {withPageContext(<SideBar />)}

                <div className="col">
                    { this.props.pageComponent }
                </div>

                <div className="col">
                    {withPageContext(<OpenPageList />)}
                </div>
            </div>
        </div>;
    }
}
