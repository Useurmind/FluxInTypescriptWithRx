import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { IPageContextProps } from "./PageContextProvider";
import { IPageManagementStore, IPageManagementStoreState } from "./PageManagementStore";
import { IPageData } from "./Pages/IPageData";

/**
 * Props for { @see OpenPageList }.
 */
export interface IOpenPageListProps extends IPageContextProps
{
    /**
     * the page management store to get the info about open pages from.
     * If not specified the component will try to retrieve the store from the container.
     */
    pageManagementStore?: IPageManagementStore;
}

/**
 * State for { @see OpenPageList }.
 */
export interface IOpenPageListState
{
    /**
     * The currently active page.
     */
    currentPage: IPageData;

    /**
     * The list of open pages that should be rendered.
     */
    openPages: IPageData[];
}

/**
 * Component that renders a fixed site map node.
 */
export class OpenPageList extends React.Component<IOpenPageListProps, IOpenPageListState>
{
    private subscription: StoreSubscription<IPageManagementStore, IPageManagementStoreState>
        = new StoreSubscription();

    constructor(props: IOpenPageListProps)
    {
        super(props);

        this.state = {
            currentPage: null,
            openPages: []
        };
    }

    public componentDidMount()
    {
        this.subscribeStore();
    }

    public componentDidUpdate(prevProps: IOpenPageListProps): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public subscribeStore()
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
            state =>
            {
                this.setState({
                    ...this.state,
                    currentPage: state.currentPage,
                    openPages: state.openPages
                });
            });
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        const currentPageId = this.state.currentPage ? this.state.currentPage.pageId : null;

        return <ul className="list-group">
            {
                this.state.openPages.map(p =>
                {
                    const isActivePage = p.pageId === currentPageId;
                    const className = isActivePage ? "list-group-item active" : "list-group-item";

                    return <li className={className} key={p.pageId}>
                        {p.pageId}
                    </li>;
                })
            }
        </ul>;
    }
}
