import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { Observable } from "rxjs/Observable";

import { IFormStorage } from "../storage";

import { IFetchResult, SaveError, SimpleError } from "./ErrorHandling";
import { FormFieldDataObject } from "./FormFieldData";
import { IFormStore, IFormStoreState, IUpdateDataFieldParams, updataDataField, validate } from "./IFormStore";
import { ValidateDataObject, ValidationErrors } from "./Validation";

/**
 * The options to configure the { @see LocalFormStore }
 */
export interface ILocalFormStoreOptions<TData> extends IInjectedStoreOptions
{
    /**
     * Load the data from the server.
     * Also used for refreshing the data in the form.
     * The next operation of this observable can also return errors in the data object.
     * Set either @see loadData and @see saveData or set @see formStorage.
     */
    loadData?: () => Observable<IFetchResult<TData, SimpleError>>;

    /**
     * Save the given data object to the backend.
     * On success the callback should deliver the updated object
     * or null.
     * The next operation of this observable can also return errors in the data object.
     * Set either @see loadData and @see saveData or set @see formStorage.
     */
    saveData?: (data: TData) => Observable<IFetchResult<TData, SaveError<TData>>>;

    /**
     * Form storage used to save and load data.
     * Set either @see loadData and @see saveData or set @see formStorage.
     */
    formStorage?: IFormStorage<TData>;

    /**
     * A function that validates the input fields.
     */
    validateData: ValidateDataObject<TData>;

    /**
     * If this is set to true, whenever a field is updated and a save fiel function is
     * provided, the store will try to save the field directly.
     * TODO: implement this.
     */
    enableAutomaticFieldSaving?: boolean;
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

    /**
     * inherited
     */
    public readonly resetData: IAction<any>;

    constructor(private options: ILocalFormStoreOptions<TData>)
    {
        super({
            ...options,
            initialState: {
                data: {} as TData,
                saveProblem: null,
                isLoading: false,
                globalErrors: null,
                validationErrors: {} as ValidationErrors<TData>,
                formFieldData: {} as FormFieldDataObject<TData>
            }
        });

        this.updateDataField = this.createActionAndSubscribe(p => this.onUpdateDataField(p));
        this.saveData = this.createActionAndSubscribe(_ => this.onSaveData());
        this.resetData = this.createActionAndSubscribe(_ => this.onResetData());
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

        const loadDataFunc = this.options.loadData ? this.options.loadData
                                                   : () => this.options.formStorage.loadDataObject();

        this.subscribeServerCall(loadDataFunc());
    }

    private onResetData(): void
    {
        this.loadInitialData();
    }

    private onSaveData(): void
    {
        this.setState(this.startLoading(this.state));

        const saveDataFunc = this.options.saveData ? this.options.saveData
                                                   : (d: TData) => this.options.formStorage.storeDataObject(d);

        this.subscribeServerCall(saveDataFunc(this.state.data));
    }

    private subscribeServerCall(serverCall: Observable<IFetchResult<TData, SimpleError | SaveError<TData>>>): void
    {
        serverCall.subscribe(
            result => this.setState(this.clearErrors(this.applyResult(this.state, result))),
            (error: any) => this.setState(this.clearData(this.applyError(this.state, error))),
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

    private applyResult(state: ILocalFormStoreState<TData>, result: IFetchResult<TData, SimpleError | SaveError<TData>>)
        : ILocalFormStoreState<TData>
    {
        if (result.error)
        {
            // we have an error, failure
            return this.applyError(state, result.error);
        }
        else
        {
            return this.updateData(state, result.data);
        }
    }

    private applyError(state: ILocalFormStoreState<TData>, error: SimpleError | SaveError<TData> | Error)
        : ILocalFormStoreState<TData>
    {
        if (typeof error === "string" || Array.isArray(error))
        {
            // simple string or string []
            return {
                ...state,
                globalErrors: error
            };
        }
        else if ("globalErrors" in error)
        {
            // complex error has same type as state
            return { ...state, ...error};
        }
        else if ("message" in error)
        {
            // Error object
            return {
                ...state,
                saveProblem: error.message
            };
        }

        // last remaining case is validation errors object
        return {
            ...state,
            validationErrors: error ? error : {} as ValidationErrors<TData>
         };
    }

    private clearErrors(state: ILocalFormStoreState<TData>)
        : ILocalFormStoreState<TData>
    {
        return { ...state, saveProblem: null, globalErrors: null, validationErrors: {} as ValidationErrors<TData> };
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
