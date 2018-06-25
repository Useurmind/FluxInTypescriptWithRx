import * as React from "react";
import { IRouteLocation } from './RouterStore';


export interface IRouterContainerProps {
}

export interface IRouterContainerState {
    location: IRouteLocation;
}

export class RouterContainer extends React.Component<IRouterContainerProps, IRouterContainerState> {
    private subscription: Rx.Subscription;
    
    constructor(props: IRouterContainerProps) {
        super(props)

        this.state = {
            location: null
        };
    }

    public componentDidMount() {
        this.subscription = getRouterStore().subscribe(x => this.setState({
            ...this.state, 
            location:  x.location}));
    }

    public componentWillUnmount() {
        if(this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    public render(): any {
        return <SiteNodeComponent location={this.state.location}/>;
    }
}