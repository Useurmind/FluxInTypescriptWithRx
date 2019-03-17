import * as React from "react";

import { IPageContextProps } from "./PageContextProvider";
import { IPageManagementStore, IPageManagementStoreState } from "./PageManagementStore";
import { IPageData } from "./Pages/IPageData";
import { StoreSubscription } from "rfluxx";

/**
 * Props for { @see OpenPageList }.
 */
export interface IOpenPageListProps
{
    /**
     * the page management store to get the info about open pages from.
     */
    pageManagementStore: IPageManagementStore;
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
        this.subscription.subscribeStore(
            this.props.pageManagementStore,
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
