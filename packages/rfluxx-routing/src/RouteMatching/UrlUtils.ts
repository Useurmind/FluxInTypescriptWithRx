/**
 * Replace multiple slashes with just one.
 * @param url The url to replace the slashes in.
 */
export function clearMultiSlashes(url: string): string
{
    return url.replace(/\/+/g, "/");
}