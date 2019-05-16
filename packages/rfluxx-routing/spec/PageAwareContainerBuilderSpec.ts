import { PageAwareContainerBuilder } from "../src/DependencyInjection/PageAwareContainerBuilder";
import { ISiteMapNode } from "../src/SiteMap";

class Something {}

describe("PageAwareContainerBuilder", () =>
{
    const siteMap: ISiteMapNode = {
        caption: "Root",
        render: null,
        routeExpression: "",
        children: [
            {
                caption: "Child 1",
                render: null,
                routeExpression: ""
            },
            {
                caption: "Child 2",
                render: null,
                routeExpression: ""
            }
        ]
    };

    const key1 = "fklögjdlg";
    const key2 = "ölghkjhgl";
    const registeredString1 = "flgökjhdföklg";

    it("can resolve global registration in root node", () =>
    {
        const builder = new PageAwareContainerBuilder();

        builder.registerGlobally(c => registeredString1).as(key1);

        const container = builder.createContainer(siteMap);

        const result = container.resolve(key1);

        expect(result).toBe(registeredString1);
    });

    it("can resolve global registration in child node", () =>
    {
        const builder = new PageAwareContainerBuilder();

        builder.registerGlobally(c => registeredString1).as(key1);

        const container = builder.createContainer(siteMap.children[0]);

        const result = container.resolve(key1);

        expect(result).toBe(registeredString1);
    });

    it("non shared global registration returns different instance for root and child", () =>
    {
        const builder = new PageAwareContainerBuilder();

        builder.registerGlobally(c => new Something()).as(key1);

        const rootContainer = builder.createContainer(siteMap);
        const childContainer = builder.createContainer(siteMap.children[0]);

        const rootResult = rootContainer.resolve(key1);
        const childResult = childContainer.resolve(key1);

        expect(rootResult).not.toBe(null);
        expect(childResult).not.toBe(null);
        expect(childResult).not.toBe(rootResult);
    });

    it("shared global registration returns same instance for root and child", () =>
    {
        const builder = new PageAwareContainerBuilder();

        builder.registerGlobally(c => new Something()).as(key1).shareGlobally();

        const rootContainer = builder.createContainer(siteMap);
        const childContainer = builder.createContainer(siteMap.children[0]);

        const rootResult = rootContainer.resolve(key1);
        const childResult = childContainer.resolve(key1);

        expect(rootResult).not.toBe(null);
        expect(childResult).not.toBe(null);
        expect(childResult).toBe(rootResult);
    });

    it("local registration available in self", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerLocally(siteMap, c => new Something()).as(key1);

        const rootContainer = builder.createContainer(siteMap);
        const rootResult = rootContainer.resolve(key1);

        expect(rootResult).not.toBe(null);
    });

    it("local registration are not available in child", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerLocally(siteMap, c => new Something()).as(key1);

        const childContainer = builder.createContainer(siteMap.children[0]);

        expect(() => childContainer.resolve(key1)).toThrow();
    });

    it("derived container builder get existing global registration", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerGlobally(c => new Something()).as(key1);

        const derivedBuilder = builder.derive();
        const container = derivedBuilder.createContainer(siteMap);

        const result = container.resolve(key1);

        expect(result).not.toBe(null);
    });

    it("derived container builder get existing local registration", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerLocally(siteMap, c => new Something()).as(key1);

        const derivedBuilder = builder.derive();
        const container = derivedBuilder.createContainer(siteMap);

        const result = container.resolve(key1);

        expect(result).not.toBe(null);
    });

    it("extending derived container builder with global registration does not change original", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerLocally(siteMap, c => new Something()).as(key1);

        const derivedBuilder = builder.derive();
        derivedBuilder.registerGlobally(c => new Something()).as(key2);

        const originalContainer = builder.createContainer(siteMap);

        expect(() => originalContainer.resolve(key2)).toThrow();
    });

    it("extending derived container builder with local registration does not change original", () =>
    {
        const builder = new PageAwareContainerBuilder();
        builder.registerLocally(siteMap, c => new Something()).as(key1);

        const derivedBuilder = builder.derive();
        derivedBuilder.registerLocally(siteMap, c => new Something()).as(key2);

        const originalContainer = builder.createContainer(siteMap);

        expect(() => originalContainer.resolve(key2)).toThrow();
    });
});
