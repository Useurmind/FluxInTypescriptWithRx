import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IPageRequest } from "../../../src/PageCommunication";
import { IRequestedPageStore } from "../../../src/PageCommunication/IRequestedPageStore";
import { IPageStore } from "../../../src/PageStore";

export interface ISelectPageStoreState
{
    contextInfo: string;
    selectedString: string;
}

export interface ISelectPageStoreOptions extends IInjectedStoreOptions
{
    pageStore: IPageStore;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the SelectPage.
 */
export interface ISelectPageStore extends IStore<ISelectPageStoreState>, IRequestedPageStore {
    setSelection: IAction<string>;
    cancel: IAction<any>;
    confirm: IAction<any>;
}

export class SelectPageStore extends Store<ISelectPageStoreState> implements ISelectPageStore
{
    public setPageRequest: IAction<IPageRequest>;
    public setSelection: IAction<string>;
    public cancel: IAction<any>;
    public confirm: IAction<any>;

    public constructor(private options: ISelectPageStoreOptions)
    {
        super({
            ...options,
            initialState: {
                contextInfo: "",
                selectedString: ""
            }
        });

        // subscribe this action defined via IRequestedPageStore to receive the page request object
        this.setPageRequest = this.createActionAndSubscribe<IPageRequest>(pageRequest => {
            this.setState({
                ...this.state,
                contextInfo: pageRequest.data as string
            });
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
