import { RenderError } from "../stores";

/**
 * Interface with all properties that are provided for form field implementation
 * inside a form field adapter.
 */
export interface IFormFieldProps<TData, TValue>
    extends IFormFieldBindingProps<TData, TValue>, IFormFieldValueProps<TValue>, IFormFieldAdditionalProps<TData>
{

}

/**
 * .
 */
export interface IFormFieldBindingProps<TData, TValue>
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

/**
 * 
 */
export interface IFormFieldValueProps<TValue>
{
    /**
     * The value the form field should show.
     */
    value: TValue;

    /**
     * The new value that was chosen in the form field.
     */
    onValueChanged: (newValue: any) => void;
}

export interface IFormFieldAdditionalProps<TData>
{
    /**
     * Should the form field be read only and not be editable.
     */
    isReadOnly: boolean;

    /**
     * A method that will render an error
     */
    renderError: (() => React.ReactNode) | null;

    /**
     * Indicates whether the form field has an error.
     */
    hasError: boolean;
}
