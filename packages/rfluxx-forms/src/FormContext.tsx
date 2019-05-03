import * as React from "react";
import { IFormStore } from "./IFormStore";

/**
 * Props to implement by component that wants to consume a form
 * context.
 */
export interface IFormContextConsumerProps
{
    formContext: IFormContext;
}

/**
 * The data that is passed down by a form context.
 */
export interface IFormContext
{
    formStore: IFormStore<any>;
}

export const FormContext = React.createContext<IFormContext>({ formStore: null as any });