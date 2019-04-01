import * as React from "react";

import { IPageContextProps, PageContextProvider, withPageContext } from "./PageContextProvider";
import { IPageData } from "./Pages/IPageData";
import { SiteMapNode } from "./SiteMap/SiteMapNode";

/**
 * Props for a master template component that is used to defined
 * the surrounding UI of all pages.
 */
export interface IPageMasterProps extends IPageContextProps
{
    /**
     * The page component that should be rendered inside the master.
     */
    pageComponent?: React.ReactElement<any>;
}

/**
 * Props for { @see Page }.
 */
export interface IPageProps
{
    /**
     * The page that should be rendered.
     */
    page: IPageData;

    /**
     * Master template component that is used to defined
     * the surrounding UI of all pages.
     */
    pageMasterTemplate?: React.ReactElement<IPageMasterProps>;
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
        const pageComponent =
            <SiteMapNode siteMapNode={this.props.page.siteMapNode} routeParameters={this.props.page.routeParameters} />;

        let renderedElement = pageComponent;
        if (this.props.pageMasterTemplate)
        {
            renderedElement = withPageContext(React.cloneElement(this.props.pageMasterTemplate, { pageComponent }));
        }

        return <PageContextProvider container={this.props.page.container} >
            {renderedElement}
        </PageContextProvider>;
    }
}
