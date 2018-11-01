import * as React from "react";
import { routerStore, RouterMode } from "./RouterStore";

/**
 * Props for { @see RouterLink }.
 */
export interface IRouterLinkProps {
    /**
     * The caption to show for the link.
     */
    caption?: string;

    /**
     * The path fragment to which the link should navigate.
     */
    path: string;

    /**
     * The css class name to apply to the link.
     */
    className?: string;
}

/**
 * A router link can be used to integrate the navigation to another page of this app
 * via the integrated routing mechanism.
 * Uses { @see RouterStore } to navigate to the path.
 */
export class RouterLink extends React.Component<IRouterLinkProps, {}> {
    constructor(props: IRouterLinkProps) {
        super(props)
    }

    private onLinkClicked(e: any): boolean {
        routerStore.navigateTo.trigger(this.props.path);
        e.preventDefault();
        return false;
    }

    public render(): any {
        const href = routerStore.getHref(this.props.path);

        return <a onClick={(e) => {return this.onLinkClicked(e)}} className={this.props.className} href={href} >
            { this.props.caption && this.props.caption }
            { !this.props.caption && this.props.children }
        </a>
    }
}