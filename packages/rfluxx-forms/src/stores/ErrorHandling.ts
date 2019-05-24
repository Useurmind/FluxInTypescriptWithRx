import { ValidationErrors } from "./Validation";

/**
 * Type of error that should be delivered when loading of the initial data fails.
 */
export type SimpleError = string | string[];

/**
 * When data is saved to the backend deliver this type of object when an error occurs.
 */
export type SaveError<TData> = string | string[] | ValidationErrors<TData> | IComplexSaveError<TData>;

/**
 * Interface for more complex save errors.
 */
export interface IComplexSaveError<TData>
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
 * Interface for a generic fetch result, e.g. for saving data.
 * A save operation can either return data or an error.
 * Returning data indicates success.
 * Returning an error indicates failure.
 */
export interface IFetchResult<TData, TError>
{
    /**
     * The data in case of success.
     */
    data?: TData;

    /**
     * The error in case of failure.
     */
    error?: TError;
}
