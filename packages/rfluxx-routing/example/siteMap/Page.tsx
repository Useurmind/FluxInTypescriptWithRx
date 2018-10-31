import * as React from "react";
import * as Rx from "rxjs";

import { RouterLink } from "../../src/RouterLink";
import { ISiteMapStore } from "../../src/SiteMapStore";

export interface IPageProps
{
    siteMapStore: ISiteMapStore;
}

export interface IPageState
{
    currentSiteMapExpression: string;
}

export class Page extends React.Component<IPageProps, IPageState> {

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
            <RouterLink caption="home" path="/home" /><br />
            <RouterLink caption="route1" path="/home/route1" /><br />
            <RouterLink caption="route2" path="/area1/route2" /><br />
            <RouterLink caption="route3" path="/home/route3" /><br />
            <span>Current route</span><br />
            <span>{this.state.currentSiteMapExpression}</span><br />
        </div>;
    }
}
