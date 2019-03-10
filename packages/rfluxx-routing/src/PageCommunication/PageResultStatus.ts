/**
 * Result status for a page.
 */
export enum PageResultStatus
{
    /**
     * The page completed succesfully (with a result).
     */
    Completed,

    /**
     * The page was canceled (nothing should change).
     */
    Canceled,

    /**
     * The page produced an error.
     */
    Error
}
