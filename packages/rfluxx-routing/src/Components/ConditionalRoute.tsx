import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { IPageMasterProps, Page } from "../Page";
import { IPageContextProps, PageContext } from "../PageContext";
import { IPageManagementStore, IPageManagementStoreState } from "../PageManagementStore";
import { IPageData } from "../Pages/IPageData";
import { RouteParameters } from "../Routing/RouteParameters";

/**
 * Props for { @see ConditionalRoute }.
 */
export interface IConditionalRouteProps extends IPageContextProps
{
    /**
     * Condition under which the route is shown.
     */
    condition?: (routeParameters: RouteParameters) => boolean;

    /**
     * Name of the parameter to match.
     * Alternative to condition: combine parameterName and parameterValue.
     */
    parameterName?: string;

    /**
     * Value of the parameter to match.
     * Alternative to condition: combine parameterName and parameterValue.
     */
    parameterValue?: string;
}

/**
 * State for { @see ConditionalRoute }.
 */
export interface IConditionalRouteState
{
}

/**
 * The ConditionalRoute renders its children only when the condition is true.
 */
export class ConditionalRoute
    extends React.Component<IConditionalRouteProps, IConditionalRouteState>
{
    constructor(props: IConditionalRouteProps)
    {
        super(props);

        this.state = {
        };
    }

    /**
     * check if the condition is true
     */
    private isConditionTrue(pageContextProps: IPageContextProps): boolean
    {
        if (this.props.condition)
        {
            return this.props.condition(pageContextProps.routeParameters);
        }

        if (!this.props.parameterValue || !this.props.parameterName)
        {
            throw new Error("Either parameter value or name must be set for ConditionalRoute " +
            "when no condition is given");
        }

        let actualParameterValue = pageContextProps.routeParameters.get(this.props.parameterName);
        if (actualParameterValue)
        {
            actualParameterValue = actualParameterValue.toLowerCase();
        }

        return actualParameterValue === this.props.parameterValue.toLowerCase();
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        return <PageContext.Consumer>
            {pageContext =>
            {
                if (!this.isConditionTrue(pageContext))
                {
                    return null;
                }

                return this.props.children;
            }}
        </PageContext.Consumer>;
    }
}
