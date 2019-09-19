import * as React from "react";
import { IContainer } from "rfluxx";
import { RouteParameters } from "./Routing";

/**
 * Same as @see IPageContextProviderProps
 */
export type IPageContextProps = IPageContextProviderProps;

/**
 * Props for { @see PageContextProvider } and also for a consumer bound via { @see withPageContext }.
 */
export interface IPageContextProviderProps
{    
    /**
     * The container of the page.
     */
    container?: IContainer;

    /**
     * The route parameters for the current page.
     */
    routeParameters?: RouteParameters | null;
}

/**
 * React context for rfluxx container.
 * Use this in any component that wants to consume the container.
 */
export const PageContext = React.createContext<IPageContextProviderProps>(null);

/**
 * Use this function to inject the { @see IPageContextProviderProps } into the wrapped element.
 * @param component The element that is wrapped and should have the props injected.
 */
export function withPageContext(component: React.ReactElement<any>): React.ReactElement<any>
{
    if (typeof(component.type) === "string")
    {
        // if the type is a string it is a simple tag
        // we should not inject page context in this case
        return component;
    }

    return <PageContext.Consumer>
        {(props: IPageContextProviderProps) => React.cloneElement(component, props)}
    </PageContext.Consumer>;
}

/**
 * This can be used to statically bind a component type to the page context.
 * It should not be applied during render but rather once during declaration of a component type.
 * @param wrappedComponent The component type that should use the page context.
 */
export const usePageContext = <TProps extends IPageContextProps>(wrappedComponent: React.ComponentType<TProps>)
    : React.ComponentType<Omit<TProps, keyof IPageContextProps>> =>
    class UsePageContext
    extends React.Component<Omit<TProps, keyof IPageContextProps>, {}>
    {
        /**
         * render the component
         */
        public render(): React.ReactNode
        {
            return React.createElement(
                PageContext.Consumer,
                null,
                pageContext => React.createElement(wrappedComponent, { ...this.props, ...pageContext }));
        }
    };


// interface testProps extends IPageContextProps
// {
//     asd: string
// }

// class testComp extends React.Component<testProps, {}>
// {

// }

// usePageContext(testComp)

// type testType = Omit<testProps, keyof IPageContextProps>;

/**
 * Provider for the rfluxx container context.
 * Uses the react context api to provide a container.
 */
export class PageContextProvider extends React.Component<IPageContextProviderProps, {}>
{
    constructor(props: IPageContextProviderProps)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        return <PageContext.Provider value={this.props}>
            {this.props.children}
        </PageContext.Provider>;
    }
}
