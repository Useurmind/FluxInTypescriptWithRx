/**
 * Common props that all form fields should share.
 */
export interface IFormFieldProps<TData, TValue>
{
    /**
     * Get the value of the field from the data of the form store.
     */
    getValue: (data: TData) => TValue;

    /**
     * Apply the value to the data in the form store.
     */
    setValue: (data: TData, value: TValue) => void;
}
