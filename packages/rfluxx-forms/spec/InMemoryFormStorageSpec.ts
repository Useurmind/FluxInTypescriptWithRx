import { InMemoryFormStorage } from "../src/storage/InMemoryFormStorage";
import { createIntIdentityFunction } from '../src/storage/createIntIdentityFunction';

interface IDataObject
{
    id: number;
    name: string;
    age: number;
}

describe("InMemoryFormStorage", () =>
{
    let storage: InMemoryFormStorage<IDataObject> = null;

    beforeEach(() =>
    {
        storage = new InMemoryFormStorage<IDataObject>({
            getDataObjectId: d => d.id,
            setDataObjectId: (d, id) => d.id = id,
            getNextId: createIntIdentityFunction(),
            getEmptyDataObject: () => ({ name: "John" } as IDataObject)
        });
    });

    it("loading data object without id returns empty object", () =>
    {
        storage.loadDataObject()
               .subscribe(result =>
               {
                    expect(result.data).not.toBe(undefined);
                    expect(result.data.id).toBe(undefined);
                    expect(result.data.name).toBe("John");
                    expect(result.data.age).toBe(undefined);
                    expect(result.error).toBe(undefined);
               });
    });

    it("loading data object with unkown id returns error", () =>
    {
        storage.loadDataObject(1)
               .subscribe(result =>
               {
                    expect(result.data).toBe(undefined);
                    expect(result.error).not.toBe(undefined);
               });
    });

    it("storing a data object without id returns data object with id", () =>
    {
        const dataObject: IDataObject = {
            id: null,
            age: 1,
            name: "Max"
        };

        storage.storeDataObject(dataObject)
               .subscribe(result =>
               {
                    expect(result.data).not.toBe(undefined);
                    expect(result.data.id).toBe(0);
                    expect(result.data.age).toBe(1);
                    expect(result.data.name).toBe("Max");
                    expect(result.error).toBe(undefined);
               });
    });

    it("storing a unkown data object with id does return an error", () =>
    {
        const dataObject: IDataObject = {
            id: 2,
            age: 1,
            name: "Max"
        };

        storage.storeDataObject(dataObject)
               .subscribe(result =>
               {
                    expect(result.data).toBe(undefined);
                    expect(result.error).not.toBe(undefined);
               });
    });

    it("after storing a data object it can be retrieved by id", () =>
    {
        const dataObject: IDataObject = {
            id: null,
            age: 1,
            name: "Max"
        };

        storage.storeDataObject(dataObject);
        storage.loadDataObject(0)
               .subscribe(result =>
                {
                    expect(result.data).not.toBe(undefined);
                    expect(result.data.id).toBe(0);
                    expect(result.data.age).toBe(1);
                    expect(result.data.name).toBe("Max");
                    expect(result.error).toBe(undefined);
                });
    });

    it("can retrieve all stored data objects", () =>
    {
        const dataObject1: IDataObject = {
            id: null,
            age: 1,
            name: "Max"
        };
        const dataObject2: IDataObject = {
            id: null,
            age: 2,
            name: "Boldy"
        };

        storage.storeDataObject(dataObject1);
        storage.storeDataObject(dataObject2);

        const result1 = storage.getAllObjects()[0];
        const result2 = storage.getAllObjects()[1];

        expect(result1.id).toBe(0);
        expect(result1.name).toBe("Max");
        expect(result1.age).toBe(1);
        expect(result2.id).toBe(1);
        expect(result2.name).toBe("Boldy");
        expect(result2.age).toBe(2);
    });
});
