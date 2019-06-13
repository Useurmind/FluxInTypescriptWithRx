/**
 * Common props for a form field component applied when setting up a form.
 */
export interface IFormFieldProps
{
    /**
     * Label for the form field.
     */
    label?: string;

    /**
     * Is this form field required to be filled out.
     */
    required?: boolean;

    /**
     * A helpfull text that describes the form field.
     */
    description?: string;
}
