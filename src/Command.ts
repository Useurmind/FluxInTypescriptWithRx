import * as Rx from "rxjs/Rx";

/**
 * Interface for commands that can be called from UI components.
 */
export interface ICommand<TParameter> {
    /**
     * Execute the command.
     * @param parameter Parameter for the command.
     * @returns {}
     */
    execute(parameter: TParameter): void;
}

/**
 * Interface of commands that can be used by stores to subscribe command execution.
 */
export interface IObservableCommand<TParameter> extends ICommand<TParameter> {
    /**
     * Convert a command into an observable to subscribe it.
     * @returns {}
     */
    observe(): Rx.Observable<TParameter>;

    /**
     * Subscribe to the execution of the command directly.
     * @param next
     * @returns {}
     */
    subscribe(next: (parameter: TParameter) => void): Rx.Subscription;
}

/**
 * Simple command class instatiated by stores.
 */
export class Command<TParameter> implements IObservableCommand<TParameter> {
    private subject: Rx.Subject<TParameter>;

    constructor() {
        this.subject = new Rx.Subject<TParameter>();
    }

    /**
     * {@inheritdoc }
     */
    public observe(): Rx.Observable<TParameter> {
        return this.subject;
    }

    /**
     * {@inheritdoc }
     */
    public subscribe(next: (parameter: TParameter) => void): Rx.Subscription {
        return this.observe().subscribe(next);
    }

    /**
     * {@inheritdoc }
     */
    public execute(parameter: TParameter): void {
        this.subject.next(parameter);
    }
}