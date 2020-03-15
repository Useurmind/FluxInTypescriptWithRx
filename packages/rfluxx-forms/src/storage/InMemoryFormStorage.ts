import { Observable, Observer } from "rxjs-compat";
import { of } from "rxjs";

import { IFetchResult, SaveError, SimpleError } from "../stores/ErrorHandling";

import { createIntIdentityFunction } from "./createIntIdentityFunction";
import { IFormStorage } from "./IFormStorage";

/**
 * Options that the @see InMemoryFormStorage takes.
 */
export interface IInMemoryFormStorageOptions<TData>
{
    /**
     * Function that sets the id of a data object.
     */
    setDataObjectId: (data: TData, id: any) => void;

    /**
     * Function that returns the id of a data object.
     */
    getDataObjectId: (data: TData) => any;

    /**
     * Get a new id for an object.
     * Default is to create a new Identity function with @see createIntIdentityFunction.
     */
    getNextId?: () => any;

    /**
     * Get an empty data object.
     * Default is an empty object.
     */
    getEmptyDataObject?: () => TData;
}

/**
 * This form storage stores a data object directly in memory.
 */
export class InMemoryFormStorage<TData> implements IFormStorage<TData>
{
    private dataObjects: Map<any, TData> = new Map();

    /**
     * Create an instance of this class.
     * @param options Options for the form storage.
     */
    constructor(private options: IInMemoryFormStorageOptions<TData>)
    {
        if (!options.getNextId)
        {
            options.getNextId = createIntIdentityFunction();
        }

        if (!options.getEmptyDataObject)
        {
            options.getEmptyDataObject = () => ({} as TData);
        }
    }

    /**
     * @inheritdoc
     */
    public loadDataObject(id?: any): Observable<IFetchResult<TData, SimpleError>>
    {
        if (id !== null && id !== undefined)
        {
            const foundDataObject = this.dataObjects.get(id);
            if (foundDataObject)
            {
                return of({
                    data: { ...foundDataObject }
                });
            }
            else
            {
                return of({
                    error: `Could not find data object with id ${id}`
                });
            }
        }
        else
        {
            return of({
                data: { ...this.options.getEmptyDataObject() }
            });
        }
    }

    /**
     * @inheritdoc
     */
    public storeDataObject(data: TData): Observable<IFetchResult<TData, SaveError<TData>>>
    {
        // copy the data object to not risk changes from the outside
        const dataCopy = { ...data };
        let id = this.options.getDataObjectId(dataCopy);
        if (id === null || id === undefined)
        {
            // object is new, create an id for it
            id = this.options.getNextId();
            this.options.setDataObjectId(dataCopy, id);
        }
        else
        {
            if (!this.dataObjects.has(id))
            {
                return of({
                    error: `Could not update object with id ${id} because it does not exist yet`
                });
            }
        }

        this.dataObjects.set(id, dataCopy);
        // return the same data object
        return of({
            data: { ...dataCopy }
        });
    }

    /**
     * Get all objects saved in the storage.
     */
    public getAllObjects(): TData[]
    {
        return Array.from(this.dataObjects.values());
    }
}
