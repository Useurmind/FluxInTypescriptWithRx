import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
import { GlobalContainerFactoryBase, IGlobalComponents, IGlobalContainerBuilder, RouteParameters } from "rfluxx-routing";

import { EditPageStore } from "./EditPage/EditPageStore";
import { EndlessSequencePageStore } from "./EndlessSequence/EndlessSequencePageStore";
import { FormPageStore } from "./FormWithSelectPage/FormPageStore";
import { registerResourcesGlobally } from 'rfluxx-i18n';
import { languages } from './Internationalization/Languages';

export class ContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        registerResourcesGlobally(builder, languages);

        registerStore(builder, "IFormPageStore", (c, injOpt) => new FormPageStore(injOpt({
            pageStore: c.resolve("IPageStore")
        })));

        registerStore(builder, "IEditPageStore", (c, injOpt) => new EditPageStore(injOpt({
            pageStore: c.resolve("IPageStore")
        })));

        registerStore(builder, "IEndlessSequencePageStore", (c, injOpt) => new EndlessSequencePageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            sequenceNumber: c.resolve<RouteParameters>("RouteParameters").getAsInt("sequenceNumber")
        })));
    }
}
