import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IPageRequest } from "../../../src";
import { IRequestedPageStore } from "../../../src";
import { IPageStore } from "../../../src";

export interface ISelectPageStoreInput
{
    contextInfo: string;
}

export interface ISelectPageStoreOutput
{
    selectedString: string;
}

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
    public readonly setPageRequest: IAction<IPageRequest>;
    public readonly setSelection: IAction<string>;
    public readonly cancel: IAction<any>;
    public readonly confirm: IAction<any>;

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
            const input = pageRequest.data as ISelectPageStoreInput;
            this.setState({
                ...this.state,
                contextInfo: input.contextInfo
            });
        });

        // create an action that is observable by the store and subscribe it
        this.cancel = this.createActionAndSubscribe<any>(_ =>
        {
            const result: ISelectPageStoreOutput = {
                selectedString: this.state.selectedString
            };
            this.options.pageStore.cancel.trigger(result);
        });

        this.confirm = this.createActionAndSubscribe<any>(_ =>
        {
            const result: ISelectPageStoreOutput = {
                selectedString: this.state.selectedString
            };

            this.options.pageStore.complete.trigger(result);
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
