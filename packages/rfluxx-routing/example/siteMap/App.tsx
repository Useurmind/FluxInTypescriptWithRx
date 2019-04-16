import * as React from "react";

import { ISiteMapNode, ISiteMapStore } from "../../src";
import { Breadcrumb } from "../../src";
import { CurrentSiteMapNode } from "../../src";
import { RouterLink } from "../../src";

export interface IAppProps
{
    siteMapStore: ISiteMapStore;
}

export interface IAppState
{
    currentSiteMapExpression: string;
}

export class App extends React.Component<IAppProps, IAppState> {

    constructor(props: any)
    {
        super(props);

        this.state = {
            currentSiteMapExpression: ""
        };
    }

    public componentDidMount(): void
    {
        this.props.siteMapStore.subscribe(s =>
        {
            let currentSiteMapExpression = "";
            if (s.siteMapNodeHit && s.siteMapNodeHit.siteMapNode)
            {
                currentSiteMapExpression = s.siteMapNodeHit.siteMapPath.map(x => x.caption).join(" > ");
            }

            this.setState({ currentSiteMapExpression });
        });
    }

    public render(): any
    {
        return <div>
            <Breadcrumb siteMapStore={this.props.siteMapStore}
                       renderPart={(sn: ISiteMapNode) => <span>... {sn.caption}</span>} /><br />
            <RouterLink caption="home" path="/home" /><br />
            <RouterLink caption="route1" path="/home/route1" /><br />
            <RouterLink caption="route2" path="/area1/route2" /><br />
            <RouterLink caption="route3" path="/home/route3" /><br />
            <span>Current route</span><br />
            <span>{this.state.currentSiteMapExpression}</span><br />
            <CurrentSiteMapNode siteMapStore={this.props.siteMapStore} />
        </div>;
    }
}
