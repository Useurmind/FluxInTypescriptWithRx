import { IContainer } from "./IContainer";

/**
 * Simple container implements the container interface by holding an internal map.
 */
export class SimpleContainer implements IContainer {
    private registrationMap = {};
    private instanceMap = {};

    public register(typeName: string, create: (c: IContainer) => any): void {
        this.registrationMap[typeName] = create;
    }

    public registerInCollection(collectionName: string|string[], create: (c: IContainer) => any, typeName?: string): void {
        // we want singleton behaviour for multiple names here
        const createSingleton = (function() {
            let instance = null;
            function createSingletonInner(container) {
                if (!instance) {
                    instance = create(container);
                }
                return instance;
            }
            return createSingletonInner;
        }());

        let collectionNames: string[] = collectionName as string[];
        if (typeof collectionName === "string") {
            collectionNames = [collectionName];
        }

        collectionNames.forEach(name => {
            if (!this.registrationMap[name]) {
                this.registrationMap[name] = [];
            }
            this.registrationMap[name].push(createSingleton);
        });
        this.registrationMap[typeName] = createSingleton;
    }

    public resolve(typeName: string, instanceName?: string): any {
        let instance = this.instanceMap[typeName];

        if (!instance) {
            const create = this.registrationMap[typeName];
            if (typeof create == "function") {
                // single create function
                instance = create(this);
            } else if (typeof create == "object") {
                // multiple create functions for a collection
                instance = create.map(x => x(this));
            }
            this.instanceMap[typeName] = instance;
        }

        return instance;
    }
}
