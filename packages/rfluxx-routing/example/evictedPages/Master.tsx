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

                <div className="col-auto">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <RouterLink caption="home" path="/home" className="nav-link" />
                        </li>
                        <li className="nav-item">
                            <RouterLink caption="some span" path="/some/span" className="nav-link" />
                        </li>
                        <li className="nav-item">
                            <RouterLink caption="form with select" path="/form/with/select" className="nav-link" />
                        </li>
                        <li className="nav-item">
                            <RouterLink caption="edit page" path="/edit/page" className="nav-link" />
                        </li>
                        <li className="nav-item">
                            <RouterLink caption="endless sequence" path="/endlessSequence/1" className="nav-link" />
                        </li>
                    </ul>
                </div>

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
