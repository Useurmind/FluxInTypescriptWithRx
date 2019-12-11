/**
 * An action hook is really only a function that is used to trigger an action.
 */
export type ActionHook<TActionEvent> = (actionEvent: TActionEvent) => void;


/**
 * A hook for an actin without an action event type.
 */
export type ActionHookVoid = () => void;