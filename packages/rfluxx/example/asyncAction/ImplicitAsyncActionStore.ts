import * as Flux from "../../src";

import { IAsyncActionStore, IAsyncActionStoreState, IDataModel } from "./IAsyncActionStore";

class ImplicitAsyncActionStore extends Flux.Store<IAsyncActionStoreState> implements IAsyncActionStore {
    public readonly startSuccessfulDownload: Flux.IAction<any>;
    public readonly startFailingDownload: Flux.IAction<any>;

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
    }

    private fetchJson(fileName: string) {
        fetch(fileName)
            .then(
                r => {
                    if (r.status >= 200 && r.status < 300) {
                        return r.json();
                    } else {
                        this.setState({
                            ...this.state,
                            dataModel: null,
                            error: r.statusText
                        });

                        return null;
                    }
                },
                error => this.setState({
                    ...this.state,
                    dataModel: null,
                    error
                }))
            .then(json => {
                if (!json) {
                    return;
                }

                this.setState({
                    ...this.state,
                    dataModel: json,
                    error: null
                });
            });
    }
}

// publish an instance of this store
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const implicitAsyncActionStore: IAsyncActionStore = new ImplicitAsyncActionStore();
