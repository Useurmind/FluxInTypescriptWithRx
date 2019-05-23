/**
 * Class that provides holds route parameters.
 * Similar to a set but provides additional functionality.
 * Some rules:
 * - parameter names are always lowercase
 * This class ensures you do not need to care about these rules.
 */
export class RouteParameters
{
    private readonly parameters: Map<string, string>;

    /**
     * Create a new instance.
     * @param parameters The map with parameters to store.
     */
    constructor(parameters?: Map<string, string>)
    {
        this.parameters = new Map();
        if (parameters)
        {
            for (const parameterName of parameters.keys())
            {
                // store all parameters in lower case
                this.parameters.set(parameterName.toLowerCase(), parameters.get(parameterName));
            }
        }
    }

    /**
     * Return the number of router parameters.
     */
    public get size(): number
    {
        return this.parameters.size;
    }

    /**
     * Returns the keys of the parameter map.
     */
    public keys(): IterableIterator<string>
    {
        return this.parameters.keys();
    }

    /**
     * Return the value of the given parameter.
     * @param parameterName The name of the parameter.
     */
    public get(parameterName: string): string | null | undefined
    {
        return this.parameters.get(parameterName.toLowerCase());
    }

    /**
     * Retrieve a parameter and convert it to an integer number.
     * Returns null when number can not be parsed.
     * @param parameterName The name of the parameter.
     */
    public getAsInt(parameterName: string): number | null | undefined
    {
        const parameterValue = this.get(parameterName);

        const numberValue = Number.parseInt(parameterValue, 10);

        if (isNaN(numberValue))
        {
            return null;
        }

        return numberValue;
    }

    /**
     * Retrieve a parameter and convert it to a float number.
     * Returns null when number can not be parsed.
     * @param parameterName The name of the parameter.
     */
    public getAsFloat(parameterName: string): number | null | undefined
    {
        const parameterValue = this.get(parameterName);

        const numberValue = Number.parseFloat(parameterValue);

        if (isNaN(numberValue))
        {
            return null;
        }

        return numberValue;
    }

    /**
     * Retrieve a parameter and convert it to a boolean.
     * Returns null when boolean could not be parsed.
     * Valid boolean values are:
     * - true, false (in any casing)
     * - 1, 0
     * - yes, no
     * @param parameterName The name of the parameter.
     */
    public getAsBool(parameterName: string): boolean | null | undefined
    {
        const parameterValue = this.get(parameterName);

        if (!parameterValue)
        {
            return null;
        }

        if (parameterValue.match(/^(true|yes|1)$/i))
        {
            return true;
        }

        if (parameterValue.match(/^(false|no|0)$/i))
        {
            return false;
        }

        return null;
    }
}
