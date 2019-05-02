import * as React from "react";
import { IContainer } from "rfluxx";
import { Breadcrumb, IPageContextProps, IPageMasterProps, SideBar } from "rfluxx-routing";
import { CurrentPage } from "rfluxx-routing";
import { CurrentSiteMapNode } from "rfluxx-routing";
import { OpenPageList } from "rfluxx-routing";
import { withPageContext } from "rfluxx-routing";
import { IPageManagementStore } from "rfluxx-routing";
import { RouterLink } from "rfluxx-routing";
import { ISiteMapNode, ISiteMapStore } from "rfluxx-routing";

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
