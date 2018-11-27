import { UrlFragment } from "../src/RouteMatching/UrlFragment";

describe("UrlFragment", () =>
{
    it("full url fragment (1 search parameters) is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff?parameter1=value1#someSimpleHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(1);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("value1");
        expect(urlFragment.hash).toBe("someSimpleHash");
    });

    it("full url fragment (2 search parameters) is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(2);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("value1");
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.hash).toBe("someSimpleHash");
    });

    it("url fragment without hash is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff?parameter1=value1&parameter2=value2";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(2);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("value1");
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.hash).toBe("");
    });

    it("url fragment without parameters is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff#someSimpleHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(0);
        expect(urlFragment.hash).toBe("someSimpleHash");
    });

    it("url fragment without parameters and hash is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(0);
        expect(urlFragment.hash).toBe("");
    });

    it("url fragment without parameters and second hash is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff#someSimpleHash#secondHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(0);
        expect(urlFragment.hash).toBe("someSimpleHash#secondHash");
    });

    it("url fragment with parameters and second hash is correctly splitted", () =>
    {
        const fragment = "/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash#secondHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/to/stuff");
        expect(urlFragment.searchParameters.size).toBe(2);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("value1");
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.hash).toBe("someSimpleHash#secondHash");
    });

    it("route with parameters and hash is correctly splitted", () =>
    {
        const fragment = "/path/{parameter1}/morePath?parameter1={*}&parameter2=value2#someSimpleHash#secondHash";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/{parameter1}/morePath");
        expect(urlFragment.searchParameters.size).toBe(2);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("{*}");
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.hash).toBe("someSimpleHash#secondHash");
    });

    it("route with parameter regex in hash and search is correctly splitted", () =>
    {
        const fragment =
          "/path/{parameter1}/morePath?parameter1={*}&parameter2=value2#parameter3=(?<parameter3>[A-Za-z0-9]+)";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/{parameter1}/morePath");
        expect(urlFragment.searchParameters.size).toBe(2);
        expect(urlFragment.searchParameters.get("parameter1")).toBe("{*}");
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.hash).toBe("parameter3=(?<parameter3>[A-Za-z0-9]+)");
    });

    it("route with parameter regex in hash and no search is correctly splitted", () =>
    {
        const fragment = "/path/{parameter1}/morePath#parameter2=(?<parameter2>[A-Za-z0-9]+)";
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/{parameter1}/morePath");
        expect(urlFragment.searchParameters.size).toBe(0);
        expect(urlFragment.hash).toBe("parameter2=(?<parameter2>[A-Za-z0-9]+)");
    });

    it("route with parameter that contains full url is correctly splitted", () =>
    {
        // urls in urls params should be encoded
        const otherUrl = "http://anotherserver.com/path?otherParam=1#otherHash";
        const otherUrlEncoded = encodeURIComponent(otherUrl);
        const fragment =
        `/path/{parameter1}/morePath?parameter2=value2&url=${otherUrlEncoded}&parameter3=value3#parameter4=(?<parameter4>[A-Za-z0-9]+)`;
        const urlFragment = new UrlFragment(fragment);

        expect(urlFragment.path).toBe("/path/{parameter1}/morePath");
        expect(urlFragment.searchParameters.size).toBe(3);
        expect(urlFragment.searchParameters.get("parameter2")).toBe("value2");
        expect(urlFragment.searchParameters.get("url")).toBe(otherUrlEncoded);
        expect(urlFragment.searchParameters.get("parameter3")).toBe("value3");
        expect(urlFragment.hash).toBe("parameter4=(?<parameter4>[A-Za-z0-9]+)");
    });
});
