import * as React from "react";

import { RouterMode, routerStore } from "../Routing/RouterStore";

/**
 * Props for { @see RouterLink }.
 */
export interface IRouterLinkProps {
    /**
     * The caption to show for the link.
     */
    caption?: string | React.ReactNode;

    /**
     * The path to which the link should navigate (also include search and hash if required).
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
export class RouterLink extends React.Component<IRouterLinkProps, {}>
{
    constructor(props: IRouterLinkProps)
    {
        super(props);
    }

    public onLinkClicked(e: any): boolean
    {
        routerStore.navigateToPath.trigger(this.props.path);
        e.preventDefault();
        return false;
    }

    public render(): any
    {
        const href = routerStore.getHref(this.props.path);

        return <a onClick={e => this.onLinkClicked(e)} className={this.props.className} href={href} >
            { this.props.caption && this.props.caption }
            { !this.props.caption && this.props.children }
        </a>;
    }
}
