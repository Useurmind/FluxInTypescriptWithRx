import * as React from "react";
import { router, RouterMode } from "./Router";

export interface IRouterLinkProps {
    caption?: string;
    path: string;
    className?: string;
}

export class RouterLink extends React.Component<IRouterLinkProps, {}> {
    constructor(props: IRouterLinkProps) {
        super(props)
    }

    private onLinkClicked(): boolean {
        router.navigate(this.props.path);
        return false;
    }

    public render(): any {
        const href = router.mode == RouterMode.Hash ? `#${this.props.path}` : this.props.path

        return <a onClick={() => {return this.onLinkClicked()}} className={this.props.className} href={href} >
            { this.props.caption && this.props.caption }
            { !this.props.caption && this.props.children }
        </a>
    }
}