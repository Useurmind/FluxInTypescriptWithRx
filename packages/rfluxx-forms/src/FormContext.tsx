import * as React from "react";

import { IFormStore } from "./stores/IFormStore";

/**
 * Props to implement by component that wants to consume a form
 * context.
 */
export interface IFormContextConsumerProps
{
    /**
     * The form context.
     */
    formContext: IFormContext;
}

/**
 * The data that is passed down by a form context.
 */
export interface IFormContext
{
    /**
     * The store to use for the form.
     */
    formStore: IFormStore<any>;
}

export const FormContext = React.createContext<IFormContext>({
    formStore: null as any
});
