import * as React from "react";
import { subscribeStoreSelect } from "rfluxx";
import { Theme, createStyles, WithStyles, withStyles, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { ResourceTexts } from "./Resources.en";
import { Language, ResourceText } from "./Languages";
import { LanguageChooser } from "./LanguageChooser";

export const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @MultiLanguagePage }
 */
export interface IMultiLanguagePageState
{

}

/**
 * Props for { @MultiLanguagePage }
 */
export interface IMultiLanguagePageProps
    extends WithStyles<typeof styles>
{
}

/**
 * Component that shows a page with multi language texts.
 */
export const MultiLanguagePage = withStyles(styles)(
    class extends React.Component<IMultiLanguagePageProps, IMultiLanguagePageState>
    {
        /**
         * Renders the component.
         */
        public render(): React.ReactNode
        {
            const { classes, ...rest } = this.props;

            return <div className={classes.root}>
                <Typography variant="h3" gutterBottom>
                    <ResourceText getText={x => x.title} />
                </Typography>
                <Typography gutterBottom>
                    <ResourceText getText={x => x.description} />
                </Typography>

                <FormControl>
                    <InputLabel>
                        <ResourceText getText={x => x.select_language} />
                    </InputLabel>
                    <LanguageChooser storeRegistrationKey="IResourceStore" />
                </FormControl>
            </div>;
        }
    }
);

