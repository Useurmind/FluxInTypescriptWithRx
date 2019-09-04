import * as React from "react";
import { Subtract } from "utility-types";

import { IPageContextProps, PageContext } from ".";

/**
 * This can be used to statically bind a component type to the page context.
 * It should not be applied during render but rather once during declaration of a component type.
 * @param wrappedComponent The component type that should use the page context.
 */
export const usePageContext = <TProps extends IPageContextProps>(wrappedComponent: React.ComponentType<TProps>)
    : React.ComponentType<Subtract<TProps, IPageContextProps>> =>
    class UsePageContext
    extends React.Component<Subtract<TProps, IPageContextProps>, {}>
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
