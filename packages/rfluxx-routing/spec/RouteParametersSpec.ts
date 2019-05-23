import { RouteParameters } from "../src/Routing/RouteParameters";

describe("RouteParameters", () =>
{
    [
        { inputParameterName: "Parameter1", testedParameterName: "Parameter1" },
        { inputParameterName: "Parameter1", testedParameterName: "ParAmeTer1" },
        { inputParameterName: "parameter1", testedParameterName: "pArameteR1" },
        { inputParameterName: "ParaMetEr1", testedParameterName: "Parameter1" }
    ].forEach(x =>
    {
        it("parameter can be retrieved when present " + JSON.stringify(x), () =>
        {
            const parameterValue = "DSFGdfglkjdf";
            const routeParameters = new RouteParameters(new Map([[x.inputParameterName, parameterValue ]]));

            const retrievedValue = routeParameters.get(x.testedParameterName);

            expect(retrievedValue).toBe(parameterValue);
        });
    });

    [
        { inputParameterValue: "1", expectedParameterValue: 1 },
        { inputParameterValue: "47856", expectedParameterValue: 47856 },
        { inputParameterValue: "-564", expectedParameterValue: -564 },
        { inputParameterValue: "ldfjg", expectedParameterValue: null },
        { inputParameterValue: "4354lökjlkj", expectedParameterValue: 4354 }
    ].forEach(x =>
    {
        it("parameter can be retrieved as integer " + JSON.stringify(x), () =>
        {
            const parameterName = "aölfdkg";
            const routeParameters = new RouteParameters(new Map([[parameterName, x.inputParameterValue ]]));

            const retrievedValue = routeParameters.getAsInt(parameterName);

            expect(retrievedValue).toBe(x.expectedParameterValue);
        });
    });

    [
        { inputParameterValue: "1", expectedParameterValue: 1 },
        { inputParameterValue: "47856", expectedParameterValue: 47856 },
        { inputParameterValue: "-564", expectedParameterValue: -564 },
        { inputParameterValue: "ldfjg", expectedParameterValue: null },
        { inputParameterValue: "4354lökjlkj", expectedParameterValue: 4354 },
        { inputParameterValue: "1.2345", expectedParameterValue: 1.2345 },
        { inputParameterValue: "3.14367", expectedParameterValue: 3.14367 }
    ].forEach(x =>
    {
        it("parameter can be retrieved as float " + JSON.stringify(x), () =>
        {
            const parameterName = "aölfdkg";
            const routeParameters = new RouteParameters(new Map([[parameterName, x.inputParameterValue ]]));

            const retrievedValue = routeParameters.getAsFloat(parameterName);

            expect(retrievedValue).toBe(x.expectedParameterValue);
        });
    });

    [
        { inputParameterValue: "1", expectedParameterValue: true },
        { inputParameterValue: "0", expectedParameterValue: false },
        { inputParameterValue: "true", expectedParameterValue: true },
        { inputParameterValue: "false", expectedParameterValue: false },
        { inputParameterValue: "True", expectedParameterValue: true },
        { inputParameterValue: "FaLSE", expectedParameterValue: false },
        { inputParameterValue: "yes", expectedParameterValue: true },
        { inputParameterValue: "no", expectedParameterValue: false },
        { inputParameterValue: "dhlökfgjh", expectedParameterValue: null }
    ].forEach(x =>
    {
        it("parameter can be retrieved as boolean " + JSON.stringify(x), () =>
        {
            const parameterName = "aölfdkg";
            const routeParameters = new RouteParameters(new Map([[parameterName, x.inputParameterValue ]]));

            const retrievedValue = routeParameters.getAsBool(parameterName);

            expect(retrievedValue).toBe(x.expectedParameterValue);
        });
    });
});
