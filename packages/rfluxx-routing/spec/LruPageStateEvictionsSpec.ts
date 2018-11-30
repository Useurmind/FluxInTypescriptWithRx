import { IPageData } from "../src/Pages/IPageData";
import { LruPageStateEvictions } from "../src/Pages/LruPageStateEvictions";
import { PathAndSearchPageId } from "../src/Pages/PathAndSearchPageId";
import { ISiteMapNodeHit } from "../src/SiteMapStore";

describe("LruPageStateEvictions", () =>
{
    const pageIdAlg = new PathAndSearchPageId();
    const baseUrl = "http://myServer.com/";

    const siteMapNodeHits: ISiteMapNodeHit[] = [
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/0")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/1")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/2")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/3")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/4")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/5")
        },
        {
            siteMapNode: null,
            siteMapPath: null,
            parameters: new Map(),
            url: new URL(baseUrl + "my/path/6")
        }
    ];

    const pageMap = new Map<string, IPageData>();

    for (const siteMapNodeHit of siteMapNodeHits)
    {
        pageMap.set(pageIdAlg.getPageId(siteMapNodeHit.url), {
            isInEditMode: false,
            openRequests: new Map(),
            siteMapNode: siteMapNodeHit.siteMapNode,
            pageRequest: null,
            url: siteMapNodeHit.url,
            routeParameters: siteMapNodeHit.parameters,
            container: null
        });
    }

    it("first eviction after cache size hits", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[2], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(1);
        expect(evictedPages3[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[0].url));
    });

    it("repeating a hit will correctly evict previous nodes", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[2], pageMap);
        const evictedPages4 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(1);
        expect(evictedPages3[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[0].url));
        expect(evictedPages4.length).toBe(1);
        expect(evictedPages4[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[1].url));
    });

    it("repeating the same two hits will not evict anything", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages4 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages5 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages6 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(0);
        expect(evictedPages4.length).toBe(0);
        expect(evictedPages5.length).toBe(0);
        expect(evictedPages6.length).toBe(0);
    });

    it("hit with edit mode true is not evicted", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).isInEditMode = true;

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[2], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(1);
        expect(evictedPages3[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[1].url));

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).isInEditMode = false;
    });

    it("hit with open requests is not evicted", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).openRequests.set("asd", null);

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[2], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(1);
        expect(evictedPages3[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[1].url));

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).openRequests.clear();
    });

    it("hit with page request is not evicted", () =>
    {
        const lruEvicitions = new LruPageStateEvictions({
            pageIdAlgorithm: pageIdAlg,
            targetNumberPagesInCache: 2
        });

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).pageRequest = {} as any;

        const evictedPages1 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[0], pageMap);
        const evictedPages2 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[1], pageMap);
        const evictedPages3 = lruEvicitions.getEvictionsOnSiteMapNodeHit(siteMapNodeHits[2], pageMap);

        expect(evictedPages1.length).toBe(0);
        expect(evictedPages2.length).toBe(0);
        expect(evictedPages3.length).toBe(1);
        expect(evictedPages3[0]).toBe(pageIdAlg.getPageId(siteMapNodeHits[1].url));

        pageMap.get(pageIdAlg.getPageId(siteMapNodeHits[0].url)).pageRequest = null;
    });
});
