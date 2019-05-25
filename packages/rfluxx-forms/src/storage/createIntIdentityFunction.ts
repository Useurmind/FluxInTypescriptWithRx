/**
 * Create a function that creates a series of unique numbers.
 * Each function created in this way will create a different series of numbers.
 */
export function createIntIdentityFunction(): () => number
{
    let currentId = 0;

    return () =>
    {
        return currentId++;
    };
}
