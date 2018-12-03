import * as React from "react";
import * as Rx from "rxjs";

export interface IHomePageProps
{
}

export interface IHomePageState
{
}

export class HomePage extends React.Component<IHomePageProps, IHomePageState> {
    constructor(props: any)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        return <div className="container-fluid">
            <h2>Home</h2>
            <p>
                The evicted pages rfluxx example home page.
            </p>
            <p>
                This page shows off features concerning state management.
            </p>
        </div>;
    }
}
