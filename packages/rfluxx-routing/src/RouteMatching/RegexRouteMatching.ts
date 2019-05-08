import { RouteParameters } from "../Routing/RouterStore";

import { IRouteMatchResult, IRouteMatchStrategy } from "./IRouteMatchStrategy";

/**
 * Uses standard regex to match the urls against the routes.
 */
export class RegexRouteMatching implements IRouteMatchStrategy
{
    /**
     * @inheritDoc
     */
    public matchUrl(urlFragment: string, route: string): IRouteMatchResult
    {
        const fragment = urlFragment;
        const paramRegex = new RegExp(route, "i");
        const match: RegExpMatchArray = fragment.match(paramRegex);

        const result: IRouteMatchResult = {
            isMatch: false,
            parameters: new Map()
        };

        if (match)
        {
            let routeParams: RouteParameters =  new Map<string, string>();
            if ((match as any).groups)
            {
                routeParams = new Map<string, string>(Object.entries((match as any).groups));
            }

            result.isMatch = true;
            result.parameters = routeParams;
        }

        return result;
    }
}
