import * as React from "react";
import { IContainer } from "rfluxx";

import { RouteParameters } from "./Routing/RouterStore";

/**
 * The props that are provided by the page context.
 */
export interface IPageContextProps
{
    /**
     * The container that holds the state of the page.
     */
    container?: IContainer | null;

    /**
     * The parameters extracted from the root.
     * Can also be resolved from the container.
     */
    routeParameters?: RouteParameters;
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

    /**
     * The parameters extracted from the root.
     * Can also be resolved from the container.
     */
    routeParameters: RouteParameters;
}

/**
 * React context for rfluxx pages.
 * Use this in any component that wants to consume the page context.
 */
export const PageContext = React.createContext<IPageContextProps>({
    container: null,
    routeParameters: null
});

/**
 * Use this function to inject the { @ IPageContextProps } into the wrapped element.
 * @param pageComponent The element that is wrapped and should have the props injected.
 */
export function withPageContext(pageComponent: React.ReactElement<any>): any
{
    if (typeof(pageComponent.type) === "string")
    {
        // if the type is a string it is a simple tag
        // we should not inject page context in this case
        return pageComponent;
    }

    return <PageContext.Consumer>
        {pageContext => React.cloneElement(pageComponent, pageContext)}
    </PageContext.Consumer>;
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
            container: this.props.container,
            routeParameters: this.props.routeParameters
        };

        return <PageContext.Provider value={pageProps}>
            {this.props.children}
        </PageContext.Provider>;
    }
}
