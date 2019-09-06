import { Theme } from "@material-ui/core";
import * as mui_styles from "@material-ui/styles";
import * as React from "react";
import { subscribeStoreSelect } from "rfluxx";
import { IPageMasterProps, withPageContext } from "rfluxx-routing";

import { IThemeStore, IThemeStoreState } from "./ThemeStore";

/**
 * State for { @ThemedMaster }
 */
export interface IThemedMasterState
{

}

/**
 * Props for { @ThemedMaster }
 */
export interface IThemedMasterProps
    extends IPageMasterProps
{
    /**
     * The theme that should be applied.
     */
    theme: Theme;

    /**
     * Method to create a theme from a theme name.
     */
    createTheme: (themeName: string) => Theme;
}

/**
 * Component that is meant to wrap the master component to apply the currently selected theme.
 * .
 */
export const ThemedMaster = class extends React.Component<IThemedMasterProps, IThemedMasterState>
{
    /**
     * Renders the component.
     */
    public render(): React.ReactNode
    {
        if (!this.props.theme)
        {
            return null;
        }

        return <mui_styles.ThemeProvider theme={this.props.theme}>
            { React.Children.map(this.props.children, (child => React.cloneElement(child as any, this.props))) }
        </mui_styles.ThemeProvider>;
    }
};

/**
 * This component is already bound to the theme store.
 */
export const ThemedMasterBound = subscribeStoreSelect<IThemeStore, IThemeStoreState>()<IThemedMasterProps, { theme: Theme }>(
    ThemedMaster,
    (storeState, store, props) => ({
        theme: props.createTheme(storeState.activeTheme as any)
    })
);
