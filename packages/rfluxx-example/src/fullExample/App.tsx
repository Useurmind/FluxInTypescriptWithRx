
import DateFnsUtils from "@date-io/date-fns";
import { Theme } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as styles from "@material-ui/styles";
import * as React from "react";
import { IContainer } from "rfluxx";
import { Breadcrumb } from "rfluxx-routing";
import { ISiteMapNode, ISiteMapStore } from "rfluxx-routing";
import { CurrentSiteMapNode } from "rfluxx-routing";
import { OpenPageList } from "rfluxx-routing";
import { withPageContext } from "rfluxx-routing";
import { IPageManagementStore } from "rfluxx-routing";
import { RouterLink } from "rfluxx-routing";
import { CurrentPage } from "rfluxx-routing";

import { Master } from "./Master";

export interface IAppProps
{
    siteMapStore: ISiteMapStore;
    pageManagementStore: IPageManagementStore;
    theme: Theme;
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
        return <styles.ThemeProvider theme={this.props.theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <CurrentPage pageManagementStore={this.props.pageManagementStore}
                                    renderNoPage={() => <div className="container-fluid">
                                        404: No page found on this url!</div>}
                                    pageMasterTemplate={<Master />} />
            </MuiPickersUtilsProvider>
        </styles.ThemeProvider>;
    }
}
