import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { Observable } from "rxjs/Observable";

import { IFormStore, IFormStoreState, IUpdateDataFieldParams, updataDataField, validate } from "./IFormStore";
import { ValidateDataObject, ValidationErrors } from "./Validation";

/**
 * The options to configure the { @see LocalFormStore }
 */
export interface ILocalFormStoreOptions<TData> extends IInjectedStoreOptions
{
    /**
     * Initial data object to use for the form.
     */
    initialData: TData;

    /**
     * A function that validates the input fields.
     */
    validateData: ValidateDataObject<TData>;
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
    /**
     * inherited
     */
    public readonly updateDataField: IAction<IUpdateDataFieldParams>;

    constructor(private options: ILocalFormStoreOptions<TData>)
    {
        super({
            ...options,
            initialState: {
                data: options.initialData ? options.initialData : {} as TData,
                validationErrors: {} as ValidationErrors<TData>
            }
        });

        this.updateDataField = this.createActionAndSubscribe(p => this.onUpdateDataField(p));
    }

    private onUpdateDataField(params: IUpdateDataFieldParams): void
    {
        let newState = updataDataField(this.state, params.setDataField, params.value);
        newState = validate(newState, this.options.validateData);

        this.setState(newState);
    }
}
