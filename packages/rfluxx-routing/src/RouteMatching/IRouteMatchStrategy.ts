import { RouteParameters } from "../RouterStore";

/**
 * Describes the result of a url/route matching operation.
 */
export interface IRouteMatchResult
{
    /**
     * Tells whether the url was a match for the given route.
     */
    isMatch: boolean;

    /**
     * Any parameters that were extracted from the url, based on the parameters defined in the route.
     */
    parameters: RouteParameters;
}

/**
 * Interface to define different url matching strategies.
 */
export interface IRouteMatchStrategy
{
    /**
     * Check if a url matches a route and return the result of the match.
     * @param urlFragment The url fragment to check for a match (path without root, search and hash).
     * @param route The route against which the url should be matched.
     */
    matchUrl(urlFragment: string, route: string): IRouteMatchResult;
}
