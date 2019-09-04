import { createStyles, Theme, WithStyles } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { subscribeStoreSelect, StoreSubscription } from "rfluxx";

import { IResourceStore, IResourceStoreState } from "./ResourceStore";
import { IPageContextProps, withPageContext, usePageContext } from 'rfluxx-routing';

export const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @ResourceText }
 */
export interface IResourceTextState
{
    /**
     * The text to show.
     */
    text: string;
}

/**
 * Props for { @ResourceText }
 */
export interface IResourceTextProps<TResourceText>
    extends IPageContextProps
{
    /**
     * A getter for the text of the resource.
     */
    getText: (resources: TResourceText) => string;
}

/**
 * Component that shows a resource text.
 */
const ResourceTextInt = withStyles(styles)(
    class <TResourceText> extends React.Component<IResourceTextProps<TResourceText>, IResourceTextState>
    {
        /**
         * The subscription to the store.
         */
        public subscription: StoreSubscription<IResourceStore<TResourceText>, IResourceStoreState<TResourceText>> = new StoreSubscription();

        /**
         *
         */
        constructor(props: IResourceTextProps<TResourceText>) {
            super(props);

            this.state = {
                text: "dummy"
            };
        }

        public componentDidMount()
        {
            this.subscribe();
        }

        public componentDidUpdate(oldProps: IResourceTextProps<TResourceText>)
        {
            if(oldProps.getText !== this.props.getText)
            {
                this.subscribe();
            }
        }

        public componentWillUnmount()
        {
            this.subscription.unsubscribe();
        }

        public subscribe() {
            const resourceStore = this.props.container.resolve<IResourceStore<TResourceText>>("IResourceStore");

            this.subscription.subscribeStore(resourceStore, state => {
                const newText = this.props.getText(state.activeResources);

                if(this.state.text !== newText) {
                    this.setState({
                        ...this.state,
                        text: newText
                    });
                }
            });
        }

        /**
         * Renders the component.
         */
        public render(): React.ReactNode
        {
            return this.state.text;
        }
    }
);

export const ResourceText = function<TResourceText>()
{
    return usePageContext(ResourceTextInt<TResourceText>);
};
