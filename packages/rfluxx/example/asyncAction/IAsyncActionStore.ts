import { IStore, IAction } from "../../src";

export interface IDataModel {
    text: string;
}

export interface IAsyncActionStoreState {
    dataModel: IDataModel;
    error: string;
}

export interface IAsyncActionStore extends IStore<IAsyncActionStoreState> {
    startSuccessfulDownload: IAction<any>;
    startFailingDownload: IAction<any>;
}