import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { IPageMasterProps, Page } from "./Page";
import { IPageContextProps } from "./PageContextProvider";
import { IPageManagementStore, IPageManagementStoreState } from "./PageManagementStore";
import { IPageData } from "./Pages/IPageData";

/**
 * Props for { @see CurrentPage }.
 */
export interface ICurrentPageProps extends IPageContextProps
{
    /**
     * The site map store that states the currently active site map node.
     * If not given the component will try to retrieve the store from the container.
     */
    pageManagementStore?: IPageManagementStore;

    /**
     * Master template component that is used to defined
     * the surrounding UI of all pages.
     */
    pageMasterTemplate?: React.ReactElement<IPageMasterProps>;

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
    private subscription: StoreSubscription<IPageManagementStore, IPageManagementStoreState>
        = new StoreSubscription();

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
        const store = this.props.pageManagementStore
                        ? this.props.pageManagementStore
                        : this.props.container.resolve<IPageManagementStore>("IPageManagementStore");

        if (!store)
        {
            throw Error("The site map store in the breadcrumb was neither given through the props"
                        + " nor was a container passed to the props.");
        }

        this.subscription.subscribeStore(
            store,
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
        this.subscription.unsubscribe();
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

        return <Page page={this.state.currentPage}
                     pageMasterTemplate={this.props.pageMasterTemplate} />;
    }
}
