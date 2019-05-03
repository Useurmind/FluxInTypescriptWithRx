import * as Rfluxx from "rfluxx";

/**
 * Type for a function to set a data field.
 */
type SetDataField = (data: any, value: any) => void;

/**
 * Type for a function to get the value of a data field.
 * This function type can also be used to get the validation errors from
 * the validation error object for a given data field.
 */
type GetDataField = (data: any) => any;

/**
 * Type for a function to validate a data field.
 */
type ValidateDataObject<TData> = (data: TData) => ValidationErrors<TData>;

/**
 * Type for validation errors on 
 */
type ValidationErrors<T> = T extends string ? string[] : 
                          T extends number ? string[] : 
                          T extends boolean ? string[] : 
                          {
                              [P in keyof T]: 
                                T[P] extends Array<infer D> ? Array<ValidationErrors<D>> : ValidationErrors<T[P]>;
                          };

/**
 * Parameters for the action that updates a data field in the 
 * data object.
 */
export interface IUpdateDataFieldParams
{
    /**
     * A function that knows how to set the data field in the 
     * data object.
     */
    setDataField: SetDataField;

    /**
     * The value that should be applied.
     */
    value: any;
}

export interface IFormStoreState<TData>
{
    /**
     * The data object that is shown and edited in the form.
     */
    data: TData;

    /**
     * This is an object that has the same structure as the original data object.
     * Only that each property is a string array containing the validation errors.
     */
    validationErrors: ValidationErrors<TData>;
}

export interface IFormStore<TData> extends Rfluxx.IStore<IFormStoreState<TData>>
{
    /**
     * Action to update a data field in the data object.
     */
    updateDataField: Rfluxx.IAction<IUpdateDataFieldParams>;
}

export function updataDataField<TData>(state: IFormStoreState<TData>, setDataField: SetDataField, value: any): IFormStoreState<TData>
{
    const newData = { ...(state.data as any) };

    setDataField(newData, value);

    return {
        ...state,
        data: newData
    };
}

export function validate<TData>(state: IFormStoreState<TData>, validateDataObject: ValidateDataObject<TData>): IFormStoreState<TData>
{
    const validationErrors = validateDataObject(state.data);

    return {
        ...state,
        validationErrors
    };
}

// code to test the validation errors type
// interface IData1 {
//     stringValue: string;
//     numberValue?: number;
//     enumValue: Enum1;
//     data2: IData2;
//     data2Array: IData2[];
// }

// interface IData2 {
//     stringValue2: string | null;
//     numberValue2: number;
// }

// enum Enum1 {

// }

// const valError: ValidationErrors<IData1>;

// valError.numberValue
// valError.stringValue
// valError.data2.numberValue2
// valError.data2Array[0].numberValue2
