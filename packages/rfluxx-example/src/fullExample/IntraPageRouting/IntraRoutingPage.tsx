import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { IPageContextProps, PageContext, ConditionalRouteComponent } from "rfluxx-routing";
import { RouterLink } from "rfluxx-routing";

export interface IIntraRoutingPageProps extends IPageContextProps
{
}

export interface IIntraRoutingPageState
{
}

export class IntraRoutingPage extends React.Component<IIntraRoutingPageProps, IIntraRoutingPageState>
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
            <h2>Intra Page Routing</h2>
            <p>
                This page shows how you can apply routes to determine components shown in a page.
            </p>
            <p>
                This content is always shown.
            </p>

            <div style={{display: "flex", flexDirection: "column"}}>
                <RouterLink caption="Hide more stuff" path={`/intraPageRouting`} />
                <RouterLink caption="Show some more stuff" path={`/intraPageRouting?moreStuff=true`} />
                <RouterLink caption="Show some more different stuff" path={`/intraPageRouting?moreDifferentStuff=true`} />
                <RouterLink caption="Show all stuff" path={`/intraPageRouting?moreStuff=true&moreDifferentStuff=true`} />
            </div>

            <ConditionalRouteComponent parameterName="moreStuff" parameterValue="true">
                <p>This is some <b>MORE</b> stuff only shown when moreStuff is set to true</p>
            </ConditionalRouteComponent>
            <ConditionalRouteComponent condition={p => p.getAsBool("moreDifferentStuff") === true}>
                <p>This is some more <b>DIFFERENT</b> stuff only shown when moreDifferentStuff is set to true</p>
            </ConditionalRouteComponent>
        </div>;
    }
}
