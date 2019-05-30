import { Observable } from "rxjs/Observable";

import { IFetchResult, SimpleError } from "./ErrorHandling";

/**
 * This interface contains all data fields that describe the form field.
 */
export interface IFormFieldData<TData>
{
    /**
     * A field may be saved or not.
     * When a field changes its status changes to not saved.
     * When it is saved through its saveField function or when the complete object is
     * saved this flag goes back to saved.
     */
    isSaved: boolean;

    /**
     * Is there currently a network operation going on about this field.
     */
    isLoading: boolean;
}

/**
 * Type for the form field data of a complex object.
 * This type reproduces the type structure of a given type but replaces each
 * atomic field with an { @see IFormFieldData }.
 */
export type FormFieldDataObject<TData> = InternalFormFieldDataObject<TData, TData>;

type InternalFormFieldDataObject<TData, T> =
    T extends string ? () => IFormFieldData<T> | null :
    T extends number ? () => IFormFieldData<T> | null :
    T extends boolean ? () => IFormFieldData<T> | null :
    {
        [P in keyof T]:
            T[P] extends Array<infer D>
                ? Array<InternalFormFieldDataObject<TData, D>>
                : InternalFormFieldDataObject<TData, T[P]>;
    };
