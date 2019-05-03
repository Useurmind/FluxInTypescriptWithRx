import { Observable } from "rxjs/Observable";
import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { IFormStore, IUpdateDataFieldParams, IFormStoreState, updataDataField } from "./IFormStore";

/**
 * The options to configure the { @see LocalFormStore }
 */
export interface ILocalFormStoreOptions<TData> extends IInjectedStoreOptions
{
    /**
     * Initial data object to use for the form.
     */
    initialData: TData;
}

/**
 * The state of the { @see LocalFormStore }
 */
export interface ILocalFormStoreState<TData> extends IFormStoreState<TData>
{
}

/**
 * Interface to interact with the { @see LocalFormStore }.
 */
export interface ILocalFormStore<TData> extends IStore<ILocalFormStoreState<TData>>, IFormStore<TData>
{
}

/**
 * This is a form store that saves the data in memory.
 */
export class LocalFormStore<TData>
    extends Store<ILocalFormStoreState<TData>>
    implements ILocalFormStore<TData>
{
    public readonly updateDataField: IAction<IUpdateDataFieldParams>;

    constructor(private options: ILocalFormStoreOptions<TData>)
    {
        super({
            ...options,
            initialState: {
                data: options.initialData,
                validationErrors: null as any,
            }
        });

        this.updateDataField = this.createActionAndSubscribe(p => this.onUpdateDataField(p));
    }

    private onUpdateDataField(params: IUpdateDataFieldParams): void
    {
        const newState = updataDataField(this.state, params.setDataField, params.value);

        this.setState(newState);
    }
}