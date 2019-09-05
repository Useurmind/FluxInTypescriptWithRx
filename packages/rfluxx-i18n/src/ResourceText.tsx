import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { IResourceStore, IResourceStoreState } from "./ResourceStore";
import { IPageContextProps, usePageContext } from "rfluxx-routing";

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
const ResourceTextInt = class <TResourceText> extends React.Component<IResourceTextProps<TResourceText>, IResourceTextState>
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
            if (oldProps.getText !== this.props.getText)
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

            // force unsubscribe to get current text
            this.subscription.unsubscribe();
            this.subscription.subscribeStore(resourceStore, state =>
            {
                const newText = this.props.getText(state.activeResources);

                if(this.state.text !== newText)
                {
                    if (!newText)
                    {
                        throw new Error(`The resource text ${this.props.getText} was not defined in the language ${state.activeLanguage.key}`);
                    }

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

/**
 * This function can be used to create your own resource text class.
 * @example
 * const MyResourceText: React.ComponentType<IResourceTextProps<MyResourceTexts>> = ResourceText<MyResourceTexts>();
 */
export const CreateResourceTextComponent = function<TResourceText>(): React.ComponentType<IResourceTextProps<TResourceText>>
{
    return usePageContext(ResourceTextInt);
};
