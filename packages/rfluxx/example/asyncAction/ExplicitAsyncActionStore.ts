import * as Flux from "../../src";

import { IAsyncActionStore, IAsyncActionStoreState, IDataModel } from "./IAsyncActionStore";

class ExplicitAsyncActionStore extends Flux.Store<IAsyncActionStoreState> implements IAsyncActionStore {
    public readonly startSuccessfulDownload: Flux.IAction<any>;
    public readonly startFailingDownload: Flux.IAction<any>;
    private readonly downloadFailed: Flux.IAction<string>;
    private readonly downloadSucceeded: Flux.IAction<IDataModel>;

    constructor() {
        super({
            initialState: {
                dataModel: {
                    text: "nothing loaded yet"
                },
                error: null
            }
        });

        this.startSuccessfulDownload = this.createActionAndSubscribe<any>(_ => {
            this.fetchJson("data.json");
        });

        this.startFailingDownload  = this.createActionAndSubscribe<any>(_ => {
            this.fetchJson("nonexistent.json");
        });

        this.downloadSucceeded = this.createActionAndSubscribe<IDataModel>(dataModel => {
            this.setState({
                ...this.state,
                dataModel,
                error: null
            });
        });

        this.downloadFailed = this.createActionAndSubscribe<string>(error => {
            this.setState({
                ...this.state,
                dataModel: null,
                error
            });
        });
    }

    private fetchJson(fileName: string) {
        fetch(fileName)
            .then(
                r => {
                    if (r.status >= 200 && r.status < 300) {
                        return r.json();
                    } else {
                        this.downloadFailed.trigger(r.statusText);

                        return null;
                    }
                },
                error => this.downloadFailed.trigger(error)
            )
            .then(json => {
                if (!json) {
                    return;
                }

                this.downloadSucceeded.trigger(json);
            });
    }
}

// publish an instance of this store
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const explicitAsyncActionStore: IAsyncActionStore = new ExplicitAsyncActionStore();
