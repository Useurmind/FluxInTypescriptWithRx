import { Theme } from "@material-ui/core";
import * as styles from "@material-ui/styles";
import * as React from "react";
<% if (includeTheming) { %>
import { ThemedMaster } from "rfluxx-mui-theming";
<% } %>
import { ISiteMapStore } from "rfluxx-routing";
import { IPageManagementStore } from "rfluxx-routing";
import { CurrentPage } from "rfluxx-routing";

import { Master } from "./Master";

<% if (includeTheming) { %>
import { createTheme } from "./theming/Theme";
<% } %>

export interface IAppProps
{
    siteMapStore: ISiteMapStore;
    pageManagementStore: IPageManagementStore;
    <% if (!includeTheming) { %>
    theme: Theme;
    <% } %>
}

export interface IAppState
{
}

export class App extends React.Component<IAppProps, IAppState> {

    constructor(props: any)
    {
        super(props);

        this.state = {
        };
    }

    public render(): any
    {
        return (
            <% if (!includeTheming) { %>
            <styles.ThemeProvider theme={this.props.theme}>
            <% } %>
            <CurrentPage pageManagementStore={this.props.pageManagementStore}
                        renderNoPage={() => <div className="container-fluid">
                            404: No page found on this url!</div>}
                        pageMasterTemplate={
                            <% if (includeTheming) { %>
                            <ThemedMasterBound storeRegistrationKey="IThemeStore"
                                                createTheme={createTheme}>
                            <% } %>
                            <Master />
                            <% if (includeTheming) { %>
                            </ThemedMasterBound>
                            <% } %>
                        } />
            <% if (!includeTheming) { %>
            </styles.ThemeProvider>
            <% } %>
        );
    }
}
