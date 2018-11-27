import { IRouteMatchResult, IRouteMatchStrategy } from "./IRouteMatchStrategy";
import { UrlFragment } from "./UrlFragment";

interface IPartialMatchResult
{
    isMatch: boolean;
    parameters: Map<string, string>;
}

/**
 * This route matching strategy uses different algorithms to match and find parameters.
 * - In the path you can use parameter names like /myPath/{parameter1}
 * - In the search all parameters are automatically extracted, you can define
 *   wildcards for parameter values like this ?parameter2={*}
 * - In the hash regex with capturing group can be used to match parameters
 */
export class ComplexRouteMatching implements IRouteMatchStrategy
{
    /**
     * @inheritDoc
     */
    public matchUrl(urlFragment: string, route: string): IRouteMatchResult
    {
        const urlFrag = new UrlFragment(urlFragment);
        const routeFrag = new UrlFragment(route);

        const result: IRouteMatchResult = {
            isMatch: true,
            parameters: new Map()
        };

        const pathMatchResult = this.matchPath(urlFrag, routeFrag);
        this.joinResults(result, pathMatchResult);

        const searchMatchResult = this.matchSearch(urlFrag, routeFrag);
        this.joinResults(result, searchMatchResult);

        const hashMatchResult = this.matchHash(urlFrag, routeFrag);
        this.joinResults(result, hashMatchResult);

        if (result.isMatch === false)
        {
            return {
                isMatch: false,
                parameters: new Map()
            };
        }

        return result;
    }

    private joinResults(aggregatedResult: IRouteMatchResult, partialResult: IPartialMatchResult)
    {
        for (const parameterName of Array.from(partialResult.parameters.keys()))
        {
            aggregatedResult.parameters.set(parameterName, partialResult.parameters.get(parameterName));
        }
        aggregatedResult.isMatch = aggregatedResult.isMatch && partialResult.isMatch;
    }

    private matchPath(urlFragment: UrlFragment, routeFragment: UrlFragment): IPartialMatchResult
    {
        // check that path matches and extract parameters
        const matchParameterNamesRegex = new RegExp("\{[A-Za-z0-9]+\}", "ig");

        const parameterNameMatches = routeFragment.path.match(matchParameterNamesRegex);

        let routeRegex = routeFragment.path;

        if (parameterNameMatches)
        {
            for (const parameterNameMatch of parameterNameMatches)
            {
                const parameterName = parameterNameMatch.slice(1, -1);

                // parameters are matched with everything except slashes, ampersants and hashes
                routeRegex = routeRegex.replace(parameterNameMatch, `(?<${parameterName}>[^\/\?#]+)`);
            }
        }

        const pathMatch: RegExpMatchArray = urlFragment.path.match(new RegExp(routeRegex, "i"));

        if (pathMatch)
        {
            let pathParams: Map<string, string> =  new Map<string, string>();
            if ((pathMatch as any).groups)
            {
                pathParams = new Map<string, string>(Object.entries((pathMatch as any).groups));
            }

            return {
                isMatch: true,
                parameters: pathParams
            };
        }

        return {
            isMatch: false,
            parameters: new Map()
        };
    }

    private matchSearch(urlFragment: UrlFragment, routeFragment: UrlFragment): IPartialMatchResult
    {
        let allParametersMatch = true;

        for (const parameterName of Array.from(routeFragment.searchParameters.keys()))
        {
            const urlParameterValue = urlFragment.searchParameters.get(parameterName);
            const routeParameterValue = routeFragment.searchParameters.get(parameterName);

            if (!urlParameterValue)
            {
                allParametersMatch = false;
            }
            else if (routeParameterValue.trim() !== "{*}")
            {
                // values must be the same if the parameter is not wildcarded in the route
                allParametersMatch = allParametersMatch && urlParameterValue === routeParameterValue;
            }

            if (allParametersMatch === false)
            {
                break;
            }
        }

        if (allParametersMatch === true)
        {
            return {
                isMatch: true,
                parameters: urlFragment.searchParameters
            };
        }

        return {
            isMatch: false,
            parameters: new Map()
        };
    }

    private matchHash(urlFragment: UrlFragment, routeFragment: UrlFragment): IPartialMatchResult
    {
        const hashMatch: RegExpMatchArray = urlFragment.hash.match(new RegExp(routeFragment.hash, "i"));

        if (hashMatch)
        {
            let hashParams: Map<string, string> =  new Map<string, string>();
            if ((hashMatch as any).groups)
            {
                hashParams = new Map<string, string>(Object.entries((hashMatch as any).groups));
            }

            return {
                isMatch: true,
                parameters: hashParams
            };
        }

        return {
            isMatch: false,
            parameters: new Map()
        };
    }
}
