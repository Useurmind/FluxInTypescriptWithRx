import * as React from "react";

import { IPageContextProps, PageContext } from ".";

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