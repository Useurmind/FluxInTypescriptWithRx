import * as Rfluxx from "rfluxx";
import { IRouterHandler, IRoute } from './Router';
import { ISiteNode } from './SiteMap';
import { findSiteMapNode } from './SiteMapUtilities';

export class RouterStoreRouteHandler implements IRouterHandler {
    constructor(private store: RouterStore) {

    }

    public execute(matchedRoute: IRoute, fragment: string) {
        this.store.signalNewRoute.trigger({route: matchedRoute, fragment});
    }
}

export interface IRouteLocation {    
    activeSiteNode: ISiteNode;
    activePath: string;
    routeParams: any;
}

export interface ISignalRouteParams {
    route: IRoute;
    fragment: string;
}

export interface IRouteStoreOptions {
    rootNode: ISiteNode;
}

export interface IRouterStoreState {
    location: IRouteLocation;
}

export class RouterStore extends Rfluxx.Store<IRouterStoreState> {
    public readonly signalNewRoute: Rfluxx.IAction<ISignalRouteParams>;

    constructor(private options: IRouteStoreOptions) {
        super({
            initialState: {
                location: null
            }
        });

        this.signalNewRoute = this.createActionAndSubscribe<ISignalRouteParams>(params => {            
            var activeSiteNode = findSiteMapNode(this.options.rootNode, (node) => {
                return node.route === params.route.expression;
            });

            let activePath = params.fragment;
            let paramRegex = new RegExp(activeSiteNode.route, "i");
            let routeParams = (activePath.match(paramRegex) as any).groups;
            if(!routeParams) {
                routeParams = {};
            }

            this.setState({...this.state, location: {activeSiteNode, activePath, routeParams }});
        });
    }
}

let routerStore: RouterStore;

export function initRouterStore(rootNode: ISiteNode) {
    routerStore = new RouterStore({ rootNode });
}

export function getRouterStore() {
    return routerStore;
}