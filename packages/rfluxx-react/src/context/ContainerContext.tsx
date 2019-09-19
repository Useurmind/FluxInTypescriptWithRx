import * as React from "react";
import { IContainer } from "rfluxx";

/**
 * Props for { @see ContainerContextProvider } and also for a consumer bound via { @see withContainer }.
 */
export interface IContainerContextProviderProps
{    
    /**
     * The container is provided.
     */
    container?: IContainer;
}

/**
 * React context for rfluxx container.
 * Use this in any component that wants to consume the container.
 */
export const ContainerContext = React.createContext<IContainer>(null);

/**
 * Use this function to inject the { @see IContainerProviderProps } into the wrapped element.
 * @param component The element that is wrapped and should have the props injected.
 */
export function withContainer(component: React.ReactElement<any>): React.ReactElement<any>
{
    if (typeof(component.type) === "string")
    {
        // if the type is a string it is a simple tag
        // we should not inject page context in this case
        return component;
    }

    return <ContainerContext.Consumer>
        {(container: IContainer) => React.cloneElement(component, { container })}
    </ContainerContext.Consumer>;
}

/**
 * Provider for the rfluxx container context.
 * Uses the react context api to provide a container.
 */
export class ContainerContextProvider extends React.Component<IContainerContextProviderProps, {}>
{
    constructor(props: IContainerContextProviderProps)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        if (!this.props.container)
        {
            return null;
        }

        return <ContainerContext.Provider value={this.props.container}>
            {this.props.children}
        </ContainerContext.Provider>;
    }
}
