import { clearMultiSlashes } from './UrlUtils';

/**
 * Helper class to split up urls and routes into the different parts that are important.
 */
export class UrlFragment
{
    /**
     * The path of the url fragment.
     */
    public path: string = "";

    /**
     * The search parameters found in the url fragment if any.
     * WARNING: Parameter names are lower cased
     */
    public searchParameters: Map<string, string> = new Map();

    /**
     * The hash of the url fragment withouth the leading '#'.
     */
    public hash: string = "";

    constructor(private fragment: string)
    {
        const indexOfQuestionMark = fragment.indexOf("?");
        const indexOfHash = fragment.indexOf("#");

        const hasHash = indexOfHash !== -1;
        const hasSearch = indexOfQuestionMark !== -1 && (!hasHash || indexOfHash > indexOfQuestionMark);

        // extract path
        if (hasSearch)
        {
            this.path = fragment.slice(0, indexOfQuestionMark);
        }
        else if (hasHash)
        {
            this.path = fragment.slice(0, indexOfHash);
        }
        else
        {
            this.path = fragment;
        }

        // extract search
        if (hasSearch)
        {
            let search: string;
            if (hasHash)
            {
                search = fragment.slice(indexOfQuestionMark + 1, indexOfHash);
            }
            else
            {
                search = fragment.slice(indexOfQuestionMark + 1);
            }

            const searchParams = search.split("&");

            for (const searchParameter of searchParams)
            {
                const nameAndValue = searchParameter.split("=");
                const paramName = nameAndValue[0].toLowerCase();
                const paramValue = nameAndValue[1];

                this.searchParameters.set(paramName, paramValue);
            }
        }

        // extract hash
        if (hasHash)
        {
            this.hash = fragment.slice(indexOfHash + 1);
        }
    }

    public cleanSleashes()
    {
        this.path = clearMultiSlashes(this.path.replace(/^\/+/, ""));;
    }
}
