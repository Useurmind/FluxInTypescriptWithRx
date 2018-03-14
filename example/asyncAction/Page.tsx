import * as Rx from "rxjs";
import * as React from "react";
import { implicitAsyncActionStore } from "./ImplicitAsyncActionStore";
import { explicitAsyncActionStore } from "./ExplicitAsyncActionStore";
import { AsyncAction } from "./AsyncAction";

export class Page extends React.Component<{}, {}> {

    constructor(props: any){
        super(props);
    }

    public render(): any {
        return <div>
            <h1>Hello Async Action</h1>
            <AsyncAction  label="Implicit actions" store={implicitAsyncActionStore} />
            <AsyncAction  label="Explicit actions" store={explicitAsyncActionStore} />
        </div>;
    }
}