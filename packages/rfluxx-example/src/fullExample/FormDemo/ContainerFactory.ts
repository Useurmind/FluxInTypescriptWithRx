import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
import { IValidator, LocalFormStore } from "rfluxx-forms";
import { IGlobalComponents, IPageContainerFactory, ISiteMapNodeContainerBuilder, RouteParameters, SiteMapNodeContainerFactoryBase } from "rfluxx-routing";

import { IFormData } from "./IFormData";

export class ContainerFactory extends SiteMapNodeContainerFactoryBase
{
    protected registerStores(builder: ISiteMapNodeContainerBuilder): void
    {
        registerStore(builder, "IFormStore<IFormData>", (c, injOpt) => new LocalFormStore<IFormData>(injOpt({
            validateData: (data: IFormData, validator: IValidator<IFormData>) =>
            {
                validator.expect(
                    d => !!d.firstName,
                    d => "First name must be set",
                    (e, re) => e.firstName = re);

                return validator.getErrors(data);
            }
        })));
    }
}
