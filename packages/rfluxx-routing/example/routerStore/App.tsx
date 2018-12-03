import * as React from "react";
import * as Rx from "rxjs";

import { RouterLink } from "../../src/RouterLink";
import { routerStore } from "../../src/RouterStore";

export interface IAppState
{
    currentRouteName: string;
}

export class App extends React.Component<{}, IAppState> {

    constructor(props: any)
    {
        super(props);

        this.state = {
            currentRouteName: ""
        };
    }

    public componentDidMount()
    {
        routerStore.subscribe(s =>
        {
            let currentRouteName = "";
            if (s.currentHit && s.currentHit.route)
            {
                currentRouteName = s.currentHit.route.expression;
            }

            this.setState({ currentRouteName });
        });
    }

    public render(): any
    {
        return <div>
            <RouterLink caption="route1" path="route1" /><br />
            <RouterLink caption="route2" path="route2" /><br />
            <RouterLink caption="route3" path="sub/route3" /><br />
            <span>Current route</span><br />
            <span>{this.state.currentRouteName}</span><br />
        </div>;
    }
}
