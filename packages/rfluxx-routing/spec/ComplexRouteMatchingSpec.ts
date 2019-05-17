import { ComplexRouteMatching } from "../src/RouteMatching/ComplexRouteMatching";

describe("ComplexRouteMatching", () =>
{
    it("simple path without any parameters is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl("/path/to/stuff", "/path/to/stuff");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(0);
    });

    it("simple path without any parameters is matched when cased differently", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl("/Path/To/stUff", "/path/to/stuff");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(0);
    });

    it("simple path without any parameters is NOT matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl("/path/to/stuff", "/path/to/otherStuff");

        expect(result.isMatch).toBe(false);
        expect(result.parameters.size).toBe(0);
    });

    it("simple path with one parameters is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/",
             "/path/{parameter1}");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(1);
        expect(result.parameters.get("parameter1")).toBe("value1");
    });

    it("simple path with two parameters is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath",
             "/path/{parameter1}/{parameter2}/morePath");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(2);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
    });

    it("simple path with two parameters is matched when casing differs", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/patH/Value1/valUe2/MorEPath",
             "/path/{parameter1}/{parameter2}/morePath");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(2);
        expect(result.parameters.get("parameter1")).toBe("Value1");
        expect(result.parameters.get("parameter2")).toBe("valUe2");
    });

    it("simple path with two parameters is NOT matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath",
             "/path2/{parameter1}/{parameter2}/morePath");

        expect(result.isMatch).toBe(false);
        expect(result.parameters.size).toBe(0);
    });

    it("path with two parameters and search is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3&parameter4=value4",
             "/path/{parameter1}/{parameter2}/morePath?parameter4={*}&parameter3=value3");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(4);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
        expect(result.parameters.get("parameter3")).toBe("value3");
        expect(result.parameters.get("parameter4")).toBe("value4");
    });

    it("path with parameters and to many search parameters is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3&parameter4=value4&parameter5=value5",
             "/path/{parameter1}/{parameter2}/morePath?parameter4={*}&parameter3=value3");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(5);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
        expect(result.parameters.get("parameter3")).toBe("value3");
        expect(result.parameters.get("parameter4")).toBe("value4");
        expect(result.parameters.get("parameter5")).toBe("value5");
    });

    it("path with parameters and to few search parameters is NOT matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3",
             "/path/{parameter1}/{parameter2}/morePath?parameter4={*}&parameter3=value3");

        expect(result.isMatch).toBe(false);
        expect(result.parameters.size).toBe(0);
    });

    it("path with parameters, search and simple hash is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3#simpleHash",
             "/path/{parameter1}/{parameter2}/morePath?parameter3=value3#simpleHash");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(3);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
        expect(result.parameters.get("parameter3")).toBe("value3");
    });

    it("path with parameters, search and regex hash with capture group is matched", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3#parameter4=value4",
             "/path/{parameter1}/{parameter2}/morePath?parameter3=value3#parameter4=(?<parameter4>[A-za-z0-9]+)");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(4);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
        expect(result.parameters.get("parameter3")).toBe("value3");
        expect(result.parameters.get("parameter4")).toBe("value4");
    });

    it("path with parameters, search and regex hash with capture group is matched CASE INSENTIVE", () =>
    {
        const routeMatching = new ComplexRouteMatching();

        const result = routeMatching.matchUrl(
            "/path/value1/value2/morePath?parameter3=value3#parameter4=value4",
             "/patH/{parameter1}/{parameter2}/morePaTH?parameteR3=value3#Parameter4=(?<parameter4>[A-za-z0-9]+)");

        expect(result.isMatch).toBe(true);
        expect(result.parameters.size).toBe(4);
        expect(result.parameters.get("parameter1")).toBe("value1");
        expect(result.parameters.get("parameter2")).toBe("value2");
        expect(result.parameters.get("parameter3")).toBe("value3");
        expect(result.parameters.get("parameter4")).toBe("value4");
    });

    [
        { rootPathInFragment: "", rootPathInRoute: "" },
        { rootPathInFragment: "", rootPathInRoute: "/" },
        { rootPathInFragment: "/", rootPathInRoute: "" },
        { rootPathInFragment: "/", rootPathInRoute: "/" },
    ].forEach(x => {
        it("route without path and with parameters in search is matched " + JSON.stringify(x), () =>
        {
            const routeMatching = new ComplexRouteMatching();

            const result = routeMatching.matchUrl(
                x.rootPathInFragment + "?parameter3=value3#parameter4=value4",
                x.rootPathInRoute + "?parameteR3=value3#Parameter4=(?<parameter4>[A-za-z0-9]+)");

            expect(result.isMatch).toBe(true);
            expect(result.parameters.size).toBe(2);
            expect(result.parameters.get("parameter3")).toBe("value3");
            expect(result.parameters.get("parameter4")).toBe("value4");
        });
    });
});
