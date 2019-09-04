import { IContainer, IContainerBuilderEssential, registerDefaultActionFactory, registerObservableFetcher, SimpleContainerBuilder } from "./DependencyInjection";
import { registerTimeTraveler } from "./Middleware";

/**
 * Interface to start initialization and configure the container.
 */
export interface IRfluxxContainerInitializer
{
    /**
     * Tell rfluxx to use a container and register your stuff in it.
     * @param register Function that takes the container builder as an argument and
     *   registers any stores or actions, etc.
     */
    useContainer(register: (builder: IContainerBuilderEssential) => void): IRfluxxInitializerWithContainer;
}

/**
 * Interface to add different functions to the container.
 */
export interface IRfluxxInitializerWithContainer
{
    /**
     * Use a central fetcher that is connected to the rfluxx middleware.
     */
    useFetcher(): IRfluxxInitializerWithContainer;

    /**
     * Use a central action factory that is connected to the rfluxx middleware.
     */
    useActionFactory(): IRfluxxInitializerWithContainer;

    /**
     * Make time travel available.
     * @param options Options to configure time travel.
     */
    useTimeTravel(options?: ITimeTravelOptions): IRfluxxInitializerWithContainer;

    /**
     * Build the container to use in your app.
     */
    build(): IContainer;
}

export interface ITimeTravelOptions
{
    /**
     * Make the timetraveler and eventlog available on the window as properties.
     */
    registerInWindow?: boolean;
}

/**
 * Start to initialize the rfluxx framework.
 */
export function init(): IRfluxxContainerInitializer
{
    return ({
        useContainer: (register: (builder: IContainerBuilderEssential) => void) =>
        {
            let useFetcher = false;
            let useActionFactory = false;
            let useTimeTravelOptions = null;

            const initApi = ({
                useFetcher: () =>
                {
                    useFetcher = true;
                    return initApi;
                },
                useActionFactory: () =>
                {
                    useActionFactory = true;
                    return initApi;
                },
                useTimeTravel: (options: ITimeTravelOptions) =>
                {
                    useFetcher = true;
                    useActionFactory = true;
                    useTimeTravelOptions = options ? options : {};
                    return initApi;
                },
                build: () =>
                {
                    const builder = new SimpleContainerBuilder();

                    register(builder);

                    if (useFetcher)
                    {
                        registerObservableFetcher(builder);
                    }

                    if (useActionFactory)
                    {
                        registerDefaultActionFactory(builder);
                    }

                    if (useTimeTravelOptions)
                    {
                        registerTimeTraveler(builder, useTimeTravelOptions.registerInWindow, undefined, true);
                    }

                    const container = builder.build();

                    // resolve the time traveler to start it
                    container.resolveOptional("TimeTraveler");

                    return container;
                }
            });

            return initApi;
        }
    });
}