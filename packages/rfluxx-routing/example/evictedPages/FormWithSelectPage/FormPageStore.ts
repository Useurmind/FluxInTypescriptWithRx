import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IPageStore } from "../../../src/PageStore";

export interface IFormPageStoreState
{
    selectedString: string;
}

export interface IFormPageStoreOptions extends IInjectedStoreOptions
{
    pageStore: IPageStore;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the FormPage.
 */
export interface IFormPageStore extends IStore<IFormPageStoreState> {
    selectString: IAction<any>;
}

export class FormPageStore extends Store<IFormPageStoreState> implements IFormPageStore
{
    public selectString: IAction<any>;

    private setSelectedString: IAction<string>;

    public constructor(private options: IFormPageStoreOptions)
    {
        super({
            ...options,
            initialState: {
                selectedString: ""
            }
        });

        // create an action that is observable by the store and subscribe it
        this.selectString = this.createActionAndSubscribe<number>(increment =>
        {
            this.options
                .pageStore
                .requestPageWithResult("/select/page", "heys its me the form please give me some string")
                .subscribe(result =>
                {
                    this.setSelectedString.trigger(result.data);
                });
        }, { name: "selectString" });

        this.setSelectedString = this.createActionAndSubscribe<string>(value => {
            this.setState({
                ...this.state,
                selectedString: value
            });
        }, { name: "setSelectedString" });
    }
}
