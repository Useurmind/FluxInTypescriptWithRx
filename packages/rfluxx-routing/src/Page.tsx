import * as React from "react";
import * as Rx from "rxjs";

import { IPageContextProps, PageContextProvider } from "./PageContextProvider";
import { IPage } from "./PageManagementStore";
import { SiteMapNode } from "./SiteMapNode";

/**
 * Props for { @see Page }.
 */
export interface IPageProps
{
    /**
     * The page that should be rendered.
     */
    page: IPage;
}

/**
 * State for { @see Page }.
 */
export interface IPageState
{
}

/**
 * Component that renders a fixed site map node.
 */
export class Page extends React.Component<IPageProps, IPageState>
{
    constructor(props: IPageProps)
    {
        super(props);

        this.state = {};
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        return <PageContextProvider container={this.props.page.state.container} >
            <SiteMapNode siteMapNode={this.props.page.siteMapNode} routeParameters={this.props.page.routeParameters} />
        </PageContextProvider>;
    }
}
