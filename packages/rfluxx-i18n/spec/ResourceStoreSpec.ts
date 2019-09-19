import { RouterStore, ComplexRouteMatching, SpecLocator } from "rfluxx-routing";
import { ResourceStore, ILanguage } from '../src/ResourceStore';
import { currentStoreState } from 'rfluxx';
import { delay } from "rxjs/operators";

type ResourceTexts = typeof resources1;

const resources1 = {
    text1: "text1"
}

const resources2 = {
    text1: "text2"
}

const languages: ILanguage<ResourceTexts>[] = [
    {
        key: "1",
        caption: "lang 1",
        resources: resources1
    },
    {
        key: "2",
        caption: "lang 2",
        resources: resources2
    }
]

describe("ResourceStore", () =>
{
    it("all languages are available", () =>
    {
        const resourceStore = getResourceStore();

        currentStoreState(resourceStore).subscribe(s => {
            expect(s.availableLanguages.length).toBe(2);
            expect(s.availableLanguages[0].key).toBe("1");
            expect(s.availableLanguages[1].key).toBe("2");
        })
    })

    it("first language is active by default", () =>
    {
        const resourceStore = getResourceStore();

        currentStoreState(resourceStore).subscribe(s => {
            expect(s.activeLanguage.key).toBe("1");
            expect(s.activeResources.text1).toBe(resources1.text1);
        });
    })

    it("change language works", () =>
    {
        const resourceStore = getResourceStore();

        resourceStore.setLanguage.trigger("2")

        currentStoreState(resourceStore).pipe(delay(10)).subscribe(s => {
            expect(s.activeLanguage.key).toBe("2");
            expect(s.activeResources.text1).toBe(resources2.text1);
        });
    })    

    it("route is set to default language after start", () =>
    {
        const routerStore = getDefaultRouterStore()
        const resourceStore = getResourceStore(routerStore);

        currentStoreState(routerStore).pipe(delay(10)).subscribe(s => {
            expect(s.currentHit.parameters.get("lang")).toBe("1");
        });
    })
        
    it("route is set to language after start switch", () =>
    {
        const routerStore = getDefaultRouterStore()
        const resourceStore = getResourceStore(routerStore);

        resourceStore.setLanguage.trigger("2")

        currentStoreState(routerStore).pipe(delay(10)).subscribe(s => {
            expect(s.currentHit.parameters.get("lang")).toBe("2");
        });
    })
        
    it("when route is changed it is extended with lang param", () =>
    {
        const routerStore = getDefaultRouterStore()
        const resourceStore = getResourceStore(routerStore);

        routerStore.navigateToPath.trigger("/my/route/1");

        currentStoreState(routerStore).pipe(delay(10)).subscribe(s => {
            expect(s.currentHit.parameters.get("lang")).toBe("1");
        });
    })
});

function getResourceStore(routerStore?: RouterStore, langParam?: string)
{
    return new ResourceStore({
        routerStore: routerStore ? routerStore : getRouterStore("https://test.com/my/route/1", "https://test.com"),
        languages,
        languageParameterName: langParam
    });
}

function getDefaultRouterStore()
{
    return getRouterStore("https://test.com/my/route/1", "https://test.com");
}

function getRouterStore(startLocation: string, rootUrl?: string, forceEmptyRoot?: boolean): RouterStore
{
    rootUrl = rootUrl ? rootUrl : "/";

    return new RouterStore({
        locator: new SpecLocator(startLocation, rootUrl),
        routeMatchStrategy: new ComplexRouteMatching(),
        root: forceEmptyRoot ? "" : rootUrl,
        routes: [
            {
                expression: "my/route/1"
            }
        ]
    })
}