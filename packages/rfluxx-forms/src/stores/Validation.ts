import { ReactNode } from "react";

/**
 * Type for a function to validate a data field.
 */
export type ValidateDataObject<TData> = (data: TData, validator: IValidator<TData>) => ValidationErrors<TData>;

/**
 * A type for a function that renders an error.
 */
export type RenderError<TData> = (data: TData) => ReactNode;

/**
 * Type for validation errors on the data object.
 * Contains a property for each field in the object.
 * The field can contain a string or any other react element.
 */
export type ValidationErrors<T> =
    T extends string ? () => ReactNode | null :
    T extends number ? () => ReactNode | null :
    T extends boolean ? () => ReactNode | null :
    {
        [P in keyof T]:
            T[P] extends Array<infer D> ? Array<ValidationErrors<D>> : ValidationErrors<T[P]>;
    };

/**
 * Interfaces that helps with validating the data object.
 */
export interface IValidator<TData>
{
    /**
     * Expect a condition to be true.
     * Render an error message if not.
     * @param condition The condition that should be true for the data to be valid.
     * @param renderError A function that will render an error in case the condition is false.
     * @param setValidationError This will apply the render error function to the validation error object.
     */
    expect(
        condition: (data: TData) => boolean,
        renderError: (data: TData) => ReactNode,
        setValidationError: (validationErrors: ValidationErrors<TData>, renderError: () => ReactNode) => void);

    /**
     * Get the validation errors of the data object.
     */
    getErrors(data: TData): ValidationErrors<TData>;
}

/**
 * Validation rule interface for the { @see Validator }
 */
interface IValidationRule<TData>
{
    condition: (data: TData) => boolean;
    renderError: RenderError<TData>;
    setValidationError: (validationErrors: ValidationErrors<TData>, renderError: () => ReactNode) => void;
}

/**
 * Validator class.
 */
export class Validator<TData> implements IValidator<TData>
{
    private readonly validationRules: Array<IValidationRule<TData>> = new Array();

    /**
     * inherited
     */
    public expect(
        condition: (data: TData) => boolean,
        renderError: RenderError<TData>,
        setValidationError: (validationErrors: ValidationErrors<TData>, renderError: () => ReactNode) => void)
    {
        this.validationRules.push({
            condition,
            renderError,
            setValidationError
        });
    }

    /**
     * inherited
     */
    public getErrors(data: TData): ValidationErrors<TData>
    {
        const validationErros = {} as ValidationErrors<TData>;

        for (const validationRule of this.validationRules)
        {
            if (!validationRule.condition(data))
            {
                validationRule.setValidationError(validationErros, () => validationRule.renderError(data));
            }
        }

        return validationErros;
    }
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