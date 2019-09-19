import { createStyles, Theme, WithStyles, Select, MenuItem } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { subscribeStoreSelect } from "rfluxx-react";

import { IThemeStore, IThemeStoreState } from "./ThemeStore";

export const styles = (theme: Theme) => createStyles({
    select: {
    },
    selectIcon: {
    },
    selectItem: {        
    }
});

/**
 * State for { @ThemeChooser }
 */
export interface IThemeChooserState
{

}

/**
 * Props for { @ThemeChooser }
 */
export interface IThemeChooserProps
    extends WithStyles<typeof styles>
{
    /**
     * the currently active theme.
     */
    theme: string;

    /**
     * the available themes.
     */
    themes: string[];

    /**
     * A handler to set the value of the string prop.
     */
    setTheme: (evt: React.ChangeEvent<any>) => void;
}

/**
 * Component that allows to choose a language.
 */
export const ThemeChooser = withStyles(styles)(
    class extends React.Component<IThemeChooserProps, IThemeChooserState>
    {
        /**
         * Renders the component.
         */
        public render(): React.ReactNode
        {
            const { classes, theme, themes, setTheme, ...rest } = this.props;

            if (!theme)
            {
                return null;
            }

            return <Select value={ theme }
                            className={classes.select}
                            onChange={setTheme}
                            classes={{
                                icon: classes.selectIcon
                            }}>
                { themes && themes.map(t =>
                {
                    return <MenuItem value={t} className={classes.selectItem}>{t}</MenuItem>;
                })}
            </Select>;
        }
    }
);

// this code binds the component to the ThemeStore
// the actual instance of the ThemeStore is not yet given
export const ThemeChooserBound = subscribeStoreSelect<IThemeStore, IThemeStoreState>()(
    ThemeChooser,
    (storeState, store) => ({
        // bind the stores state to this components props
        theme: storeState.activeTheme,
        themes: storeState.availableThemes,
        setTheme: e => store.setTheme.trigger(e.target.value)
    })
);
