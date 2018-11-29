import { PathAndSearchPageId } from "../src/Pages/PathAndSearchPageId";

describe("PathAndSearchPageId", () =>
{
    const pageIdAlgorithm = new PathAndSearchPageId();

    it("page id does not differ when hash changes", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#anotherSimpleHash");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });

    it("page id does not differ when protocol/server changes", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("http://anotherserver.de/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });

    it("page id does not differ when hash is missing", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });

    it("page id is different for different search", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter2=value2");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).not.toBe(pageId2);
    });

    it("page id is different for different path", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1");
        const fragment2 =
            new URL("https://myserver.com/a/different/path/to/stuff?parameter1=value1");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).not.toBe(pageId2);
    });

    it("page id does not differ when params occur in different order", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter2=value2&parameter1=value1#someSimpleHash");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });
});

describe("PathAndSearchPageId with ignored parameters", () =>
{
    const pageIdAlgorithm = new PathAndSearchPageId({
        ignoredParameters: [ "ignored1", "ignored2" ]
    });

    it("page id does not differ when hash changes", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#anotherSimpleHash");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });

    it("page id does not differ when ignored parameter is added", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2&ignored1=ign1");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });

    it("page id does not differ when another ignored parameter is added", () =>
    {
        const fragment1 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2&ignored1=ign1#someSimpleHash");
        const fragment2 =
            new URL("https://myserver.com/path/to/stuff?parameter1=value1&parameter2=value2&ignored1=ign1&ignored2=ign2");

        const pageId1 = pageIdAlgorithm.getPageId(fragment1);
        const pageId2 = pageIdAlgorithm.getPageId(fragment2);

        expect(pageId1).toBe(pageId2);
    });
});
