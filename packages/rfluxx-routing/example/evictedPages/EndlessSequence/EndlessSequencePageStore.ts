import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IPageStore } from "../../../src/PageStore";

export interface IEndlessSequencePageStoreState
{
    sequenceNumber: number;
}

export interface IEndlessSequencePageStoreOptions extends IInjectedStoreOptions
{
    pageStore: IPageStore;

    sequenceNumber: number;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the EndlessSequencePage.
 */
export interface IEndlessSequencePageStore extends IStore<IEndlessSequencePageStoreState> {
    selectString: IAction<any>;
}

export class EndlessSequencePageStore extends Store<IEndlessSequencePageStoreState> implements IEndlessSequencePageStore
{
    public selectString: IAction<any>;

    public constructor(private options: IEndlessSequencePageStoreOptions)
    {
        super({
            ...options,
            initialState: {
                sequenceNumber: options.sequenceNumber
            }
        });
    }
}
