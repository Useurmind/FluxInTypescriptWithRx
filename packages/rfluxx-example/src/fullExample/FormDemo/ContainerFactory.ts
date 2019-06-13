import { IContainer, IContainerBuilder, PullingStore, registerStore, resolveStore } from "rfluxx";
import { IFormStorage, InMemoryFormStorage, IValidator, LocalFormStore } from "rfluxx-forms";
import { IGlobalComponents, ISiteMapNodeContainerBuilder, RouteParameters, SiteMapNodeContainerFactoryBase } from "rfluxx-routing";

import { IFormData } from "./IFormData";

export class ContainerFactory extends SiteMapNodeContainerFactoryBase
{
    protected registerStores(builder: ISiteMapNodeContainerBuilder): void
    {
        builder.register(c => new InMemoryFormStorage<IFormData>({
            setDataObjectId: (d: IFormData, id: number) => d.id = id,
            getDataObjectId: (d: IFormData) => d.id,
            getEmptyDataObject: () => ({
                id: null,
                firstName: "",
                lastName: "",
                birthdate: null,
                selectableSubobject: null,
                someSelectableString: ""
            })
        }))
        .as("IFormStorage<IFormData>")
        .as("InMemoryFormStorage<IFormData>");

        registerStore(builder, "IStore<IFormData[]>", (c, injOpt) => new PullingStore<IFormData[]>(injOpt({
            pullState: () => c.resolve<InMemoryFormStorage<IFormData>>("InMemoryFormStorage<IFormData>").getAllObjects()
        })));

        registerStore(builder, "IFormStore<IFormData>", (c, injOpt) => new LocalFormStore<IFormData>(injOpt({
            validateData: (data: IFormData, validator: IValidator<IFormData>) =>
            {
                validator.expect(
                    d => !!d.firstName,
                    d => "First name must be set",
                    (e, re) => e.firstName = re);

                return validator.getErrors(data);
            },
            formStorage: c.resolve<IFormStorage<IFormData>>("IFormStorage<IFormData>")
        })));
    }
}
