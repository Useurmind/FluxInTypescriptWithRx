import { Observable } from "rxjs/Observable";

import { IFetchResult, SaveError, SimpleError } from "../stores/ErrorHandling";

/**
 * Interface that defines how to store data of a form
 * in for example a backend store.
 */
export interface IFormStorage<TData>
{
    /**
     * Load a data object from the storage.
     * @param id The id of the data object, null to load a new object.
     */
    loadDataObject(id?: any): Observable<IFetchResult<TData, SimpleError>>;

    /**
     * Store the complete data object in the form storage.
     * @param data The data object to store.
     */
    storeDataObject(data: TData): Observable<IFetchResult<TData, SaveError<TData>>>;
}
