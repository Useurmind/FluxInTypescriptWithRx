import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { Observable } from "rxjs/Observable";

import { IFormStore, IFormStoreState, IUpdateDataFieldParams, updataDataField, validate } from "./IFormStore";
import { ValidateDataObject, ValidationErrors } from "./Validation";

/**
 * Type of error that should be delivered when loading of the initial data fails.
 */
export type LoadErrorResult = string | string[];

/**
 * When data is saved to the backend deliver this type of object when an error occurs.
 */
export type SaveErrorResult<TData> = string | string[] | ValidationErrors<TData> | IComplexSaveErrorResult<TData>;

/**
 * Interface for more complex save errors.
 */
export interface IComplexSaveErrorResult<TData>
{
    /**
     * Global form errors not specific to a single form field.
     */
    globalErrors: string | string[] | null;

    /**
     * Validation errors for possibly each field.
     */
    validationErrors: ValidationErrors<TData>;
}

/**
 * The options to configure the { @see LocalFormStore }
 */
export interface ILocalFormStoreOptions<TData> extends IInjectedStoreOptions
{
    /**
     * Load the data from the server.
     * Also used for refreshing the data in the form.
     * On error you should return qan { @see LoadErrorResult }.
     */
    loadData: () => Observable<TData>;

    /**
     * Save the given data object to the backend.
     * On success the callback should deliver the updated object
     * or null.
     * On error you should return an { @see ErrorResult<TData> } type.
     */
    saveData: (data: TData) => Observable<TData | null>;

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

    /**
     * inherited
     */
    public readonly saveData: IAction<any>;

    constructor(private options: ILocalFormStoreOptions<TData>)
    {
        super({
            ...options,
            initialState: {
                data: {} as TData,
                isLoading: false,
                globalErrors: null,
                validationErrors: {} as ValidationErrors<TData>
            }
        });

        this.updateDataField = this.createActionAndSubscribe(p => this.onUpdateDataField(p));
        this.saveData = this.createActionAndSubscribe(_ => this.onSaveData());
    }

    private onUpdateDataField(params: IUpdateDataFieldParams): void
    {
        let newState = updataDataField(this.state, params.setDataField, params.value);
        newState = validate(newState, this.options.validateData);

        this.setState(newState);
    }

    private loadInitialData(): void
    {
        this.setState(this.startLoading(this.state));

        this.subscribeServerCall(this.options.loadData());
    }

    private onSaveData(): void
    {
        this.setState(this.startLoading(this.state));

        this.subscribeServerCall(this.options.saveData(this.state.data));
    }

    private subscribeServerCall(serverCall: Observable<TData>): void
    {
        serverCall.subscribe(
            data => this.setState(this.clearErrors(this.updateData(this.state, data))),
            (error: LoadErrorResult) => this.setState(this.clearData(this.applyError(this.state, error))),
            () => this.setState(this.finishLoading(this.state))
        );
    }

    private startLoading(state: ILocalFormStoreState<TData>): ILocalFormStoreState<TData>
    {
        return { ...state, isLoading: true };
    }

    private finishLoading(state: ILocalFormStoreState<TData>): ILocalFormStoreState<TData>
    {
        return { ...state, isLoading: false };
    }

    private applyError(state: ILocalFormStoreState<TData>, error: LoadErrorResult | SaveErrorResult<TData>)
        : ILocalFormStoreState<TData>
    {
        if (typeof error === "string" || Array.isArray(error))
        {
            // simple string or string []
            return { ...state, globalErrors: error };
        }
        else if ("globalErrors" in error)
        {
            // complex error has same type as state
            return { ...state, ...error};
        }

        // last remaining case is validation errors object
        return { ...state, validationErrors: error };
    }

    private clearErrors(state: ILocalFormStoreState<TData>)
        : ILocalFormStoreState<TData>
    {
        return { ...state, globalErrors: null, validationErrors: null };
    }

    private updateData(state: ILocalFormStoreState<TData>, data: TData)
        : ILocalFormStoreState<TData>
    {
        if (!data)
        {
            // this means we were successfull but no updated 
            // data object was given
            return state;
        }

        return { ...state, data };
    }

    private clearData(state: ILocalFormStoreState<TData>)
        : ILocalFormStoreState<TData>
    {
        return { ...state, data: null };
    }
}
