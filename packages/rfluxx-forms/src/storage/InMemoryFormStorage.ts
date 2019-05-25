import { Observable, Observer } from "rxjs";

import { IFetchResult, SaveError, SimpleError } from "../stores/ErrorHandling";

import { IFormStorage } from "./IFormStorage";

/**
 * This form storage stores a data object directly in memory.
 */
export class InMemoryFormStorage<TData> implements IFormStorage<TData>
{
    private dataObjects: Map<any, TData> = new Map();

    /**
     * Create an instance of this class.
     * @param setDataObjectId Set the id of a new data object.
     * @param getDataObjectId Get the id of the data object to identify it.
     * @param getNextId Get the next id for a data object.
     * @param getEmptyDataObject A function to create empty data objects (including their id, if you want).
     */
    constructor(
        private setDataObjectId: (data: TData, id: any) => void,
        private getDataObjectId: (data: TData) => any,
        private getNextId: () => any,
        private getEmptyDataObject: () => TData)
    {
    }

    /**
     * @inheritdoc
     */
    public loadDataObject(id?: any): Observable<IFetchResult<TData, SimpleError>>
    {
        return Observable.create((observer: Observer<IFetchResult<TData, SimpleError>>) =>
        {
            if (id)
            {
                const foundDataObject = this.dataObjects.get(id);
                if (foundDataObject)
                {
                    observer.next({
                        data: { ...foundDataObject }
                    });
                }
                else
                {
                    observer.next({
                        error: `Could not find data object with id ${id}`
                    });
                }
            }
            else
            {
                observer.next({
                    data: { ...this.getEmptyDataObject() }
                });
            }
            observer.complete();
        });
    }

    /**
     * @inheritdoc
     */
    public storeDataObject(data: TData): Observable<IFetchResult<TData, SaveError<TData>>>
    {
        return Observable.create((observer: Observer<IFetchResult<TData, SaveError<TData>>>) =>
        {
            // copy the data object to not risk changes from the outside
            const dataCopy = { ...data };
            let id = this.getDataObjectId(data);
            if (!id)
            {
                // object is new, create an id for it
                id = this.getNextId();
                this.setDataObjectId(dataCopy, id);
            }
            else
            {
                if (!this.dataObjects.has(id))
                {
                    observer.next({
                        error: `Could not update object with id ${id} because it does not exist yet`
                    });
                    observer.complete();
                    return;
                }
            }

            this.dataObjects.set(id, dataCopy);
            // return the same data object
            observer.next({
                data: { ...dataCopy }
            });
            observer.complete();
        });
    }
}
