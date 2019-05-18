import { routerStore, RouterStore, ComplexRouteMatching } from "../src";
import { SpecLocator } from '../src/Routing/SpecLocator';

const routeRoot = "";
const routeRootWithParams = "/?param1={+}";  // this parameter must be required or this route will shadow the root route
const route1 = "route1";
const route2 = "route2";
const route1_1 = "route1/route11";
const routeParamsInPath = "route1/route3/{param1}/asd";
const routeParamsInSearch = "route4/{param1}/asd?param2={*}";

describe("RouterStore", () =>
{
    const parameters = [
        { rootUrl: "/", forceEmptyRoot: false },
        { rootUrl: "/", forceEmptyRoot: true }
    ];

    parameters.forEach(p => {

        it(getTestTitle("Router store connected after creation", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.subscribe(s => {
                expect(s.isConnected).toBe(true);
            });
        });

        it(getTestTitle("Simple route is found ", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);
            let foundRoute = false;

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(route1);
                foundRoute = true;
            });
        });

        it(getTestTitle("Simple child route is found", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1/route11", p.rootUrl, p.forceEmptyRoot);
            let foundRoute = false;

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(route1_1);
                foundRoute = true;
            });
        });

        it(getTestTitle("Route with parameter in path matched", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1/route3/ParamValue/asd", p.rootUrl, p.forceEmptyRoot);
            let foundRoute = false;

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeParamsInPath);
                expect(s.currentHit.parameters.get("param1")).toBe("ParamValue");
                foundRoute = true;
            });
        });

        it(getTestTitle("Route with parameter in search matched", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route4/Param1Value/asd?param2=Param2Value", p.rootUrl, p.forceEmptyRoot);
            let foundRoute = false;

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeParamsInSearch);
                expect(s.currentHit.parameters.get("param1")).toBe("Param1Value");
                expect(s.currentHit.parameters.get("param2")).toBe("Param2Value");
                foundRoute = true;
            });
        });

        it(getTestTitle("Navigate to empty path works without slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger("");

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRoot);
            });
        });

        it(getTestTitle("Navigate to empty path works with slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger("/");

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRoot);
            });
        });

        it(getTestTitle("Navigate to root url works without slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToUrl.trigger(new URL("https://test.com"));

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRoot);
            });
        });

        it(getTestTitle("Navigate to root url works with slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToUrl.trigger(new URL("https://test.com/"));

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRoot);
            });
        });

        it(getTestTitle("Navigate to root url with param works without slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToUrl.trigger(new URL("https://test.com?param1=value1"));

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRootWithParams);
                expect(s.currentHit.parameters.get("param1")).toBe("value1");
            });
        });

        it(getTestTitle("Navigate to root url with param works with slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToUrl.trigger(new URL("https://test.com?param1=value1"));

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRootWithParams);
                expect(s.currentHit.parameters.get("param1")).toBe("value1");
            });
        });

        it(getTestTitle("Navigate to root path with param works without slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger("?param1=value1");

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRootWithParams);
                expect(s.currentHit.parameters.get("param1")).toBe("value1");
            });
        });

        it(getTestTitle("Navigate to root path with param works with slash", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger("/?param1=value1");

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeRootWithParams);
                expect(s.currentHit.parameters.get("param1")).toBe("value1");
            });
        });

        it(getTestTitle("Navigate to simple path works", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger(route2);

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(route2);
            });
        });

        it(getTestTitle("Navigate to path with params works", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToPath.trigger("https://test.com/route4/value1/asd?pAraM2=1");

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(routeParamsInSearch);
                expect(s.currentHit.parameters.get("param1")).toBe("value1");
                expect(s.currentHit.parameters.get("param2")).toBe("1");
            });
        });

        it(getTestTitle("Navigate to simple url works", p), () =>
        {
            const routerStore = getRouterStore("https://test.com/route1", p.rootUrl, p.forceEmptyRoot);

            routerStore.navigateToUrl.trigger(new URL("https://test.com/route2"));

            routerStore.subscribe(s => {
                expect(s.currentHit.route.expression).toBe(route2);
            });
        });
    });
});


function getRouterStore(startLocation: string, rootUrl?: string, forceEmptyRoot?: boolean): RouterStore
{
    rootUrl = rootUrl ? rootUrl : "/";

    return new RouterStore({
        locator: new SpecLocator(startLocation, rootUrl),
        routeMatchStrategy: new ComplexRouteMatching(),
        root: forceEmptyRoot ? "" : rootUrl,
        routes: [
            {
                expression: route1_1
            },
            {
                expression: routeParamsInPath
            },
            {
                expression: route1
            },
            {
                expression: route2
            },
            {
                expression: routeParamsInSearch
            },
            {
                expression: routeRootWithParams
            },
            {
                expression: routeRoot
            }
        ]
    })
}

function getTestTitle(title:string, p: any)
{
    return `${title} ${JSON.stringify(p)}`;
}