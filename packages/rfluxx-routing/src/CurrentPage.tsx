import * as React from "react";
import * as Rx from "rxjs";

import { Page } from "./Page";
import { IPageManagementStore } from "./PageManagementStore";
import { IPageData } from "./Pages/IPageData";

/**
 * Props for { @see CurrentPage }.
 */
export interface ICurrentPageProps
{
    /**
     * The site map store that states the currently active site map node.
     */
    pageManagementStore: IPageManagementStore;

    /**
     * Function to render an element when no page is selected.
     */
    renderNoPage?: () => any;
}

/**
 * State for { @see CurrentPage }.
 */
export interface ICurrentPageState
{
    /**
     * The site map node that should be rendered.
     */
    currentPage: IPageData;
}

/**
 * The CurrentPage renders site map node that is active according to the site map store.
 */
export class CurrentPage extends React.Component<ICurrentPageProps, ICurrentPageState>
{
    private subscription: Rx.Subscription;

    constructor(props: ICurrentPageProps)
    {
        super(props);

        this.state = {
            currentPage: null
        };
    }

    /**
     * @inheritDoc
     */
    public componentDidMount()
    {
        this.subscription = this.props.pageManagementStore.subscribe(
            x => this.setState({
                ...this.state,
                currentPage:  x.currentPage
            }));
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount()
    {
        if (this.subscription)
        {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        const renderNoPage = this.props.renderNoPage ? this.props.renderNoPage : () => <div>No page active</div>;

        if (this.state.currentPage === null)
        {
            return renderNoPage();
        }

        return <Page page={this.state.currentPage} />;
    }
}
