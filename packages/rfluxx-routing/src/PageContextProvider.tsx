import * as React from "react";
import * as Rx from "rxjs";

import { IContainer } from "rfluxx";

/**
 * The props that are provided by the page context.
 */
export interface IPageContextProps
{
    /**
     * The container that holds the state of the page.
     */
    container: IContainer;
}

/**
 * Props for { @see PageContextProvider }.
 */
export interface IPageProviderProps
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

/**
 * Provider for the rfluxx page context.
 * Uses the react context api to provide a context for each page.
 */
export class PageContextProvider extends React.Component<IPageProviderProps>
{
    constructor(props: IPageProviderProps)
    {
        super(props);

        this.state = {};
    }

    public render(): any
    {
      return <PageContext.Provider value={
          {
            container: this.props.container
          }}>
          {this.props.children}
      </PageContext.Provider>;
    }
}
