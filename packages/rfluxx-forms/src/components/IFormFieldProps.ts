/**
 * Common props that all form fields should share.
 */
export interface IFormFieldProps<TData, TValue>
{
    getValue: (data: TData) => TValue;
    setValue: (data: TData, value: TValue) => void;
}