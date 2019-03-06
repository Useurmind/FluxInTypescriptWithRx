import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IPageRequest } from "../../../src/PageCommunicationStore";
import { IPageStore } from "../../../src/PageStore";

export interface ISelectPageStoreState
{
    contextInfo: string;
    selectedString: string;
}

export interface ISelectPageStoreOptions extends IInjectedStoreOptions
{
    pageRequest: IPageRequest;
    pageStore: IPageStore;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the SelectPage.
 */
export interface ISelectPageStore extends IStore<ISelectPageStoreState> {
    setSelection: IAction<string>;
    cancel: IAction<any>;
    confirm: IAction<any>;
}

export class SelectPageStore extends Store<ISelectPageStoreState> implements ISelectPageStore
{
    public setSelection: IAction<string>;
    public cancel: IAction<any>;
    public confirm: IAction<any>;

    public constructor(private options: ISelectPageStoreOptions)
    {
        super({
            ...options,
            initialState: {
                contextInfo: options.pageRequest.data as string,
                selectedString: ""
            }
        });

        // create an action that is observable by the store and subscribe it
        this.cancel = this.createActionAndSubscribe<any>(_ =>
        {
            this.options.pageStore.cancel.trigger(this.state.selectedString);
        });

        this.confirm = this.createActionAndSubscribe<any>(_ =>
        {
            this.options.pageStore.complete.trigger(this.state.selectedString);
        });

        this.setSelection = this.createActionAndSubscribe<string>(selectedString =>
            {
                this.setState(({
                    ...this.state,
                    selectedString
                }));
            });
    }
}
