import * as React from "react";

import { IContainer } from "rfluxx";

/**
 * The props that are provided by the page context.
 */
export interface IPageContextProps
{
    /**
     * The container that holds the state of the page.
     */
    container?: IContainer | null;
}

/**
 * Props for { @see PageContextProvider } and also for a consumer bound via { @see bindToPageContext }.
 */
export interface IPageContextProviderProps
{
    /**
     * The container that holds the state of the page.
     */
    container: IContainer;
}

/**
 * React context for rfluxx pages.
 * Use this in any component that wants to consume the page context.
 */
export const PageContext = React.createContext<IPageContextProps>({
    container: null
});

export function withPageContext(pageComponent: React.ReactElement<any>): any
{
    return <PageContext.Consumer>
        {pageContext => React.cloneElement(pageComponent, pageContext)}
    </PageContext.Consumer>;
}

export function withPageContextForList(pageComponents: Array<React.ReactElement<any>>): any
{
    return pageComponents.map(x => withPageContext(x));
}

/**
 * State for { @see PageContextProvider }.
 */
export interface IPageContextProviderState
{
    /**
     * The props that should be provided as context.
     */
    pageProps: IPageContextProps;
}

/**
 * Provider for the rfluxx page context.
 * Uses the react context api to provide a context for each page.
 */
export class PageContextProvider extends React.Component<IPageContextProviderProps, IPageContextProviderState>
{
    constructor(props: IPageContextProviderProps)
    {
        super(props);

        this.state = {
            pageProps: {
                // container: props.container
            }
        };
    }

    // public componentDidUpdate(prevProps: IPageContextProviderProps): void
    // {
    //     if (prevProps.container !== this.props.container)
    //     {
    //         this.setState({
    //             pageProps: {
    //                 container: this.props.container
    //             }
    //         });
    //     }
    // }

    public render(): any
    {
        if (!this.props.container)
        {
            return null;
        }

        const pageProps: IPageContextProps = {
            container: this.props.container
        };

        return <PageContext.Provider value={pageProps}>
            {this.props.children}
        </PageContext.Provider>;
    }
}
