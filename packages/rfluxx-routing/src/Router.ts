import * as React from "react";
import * as Rx from "rxjs";

declare const history: any;

export enum RouterMode {
    History,
    Hash
}

export interface IRouterOptions {
    mode?: RouterMode;
    root?: string;
}

export interface IRouterHandler {
    execute(matchedRoute: IRoute, path: string);
}

export interface IRoute {
    expression: string;
    handler: IRouterHandler;
}

export class Router {
    public routes: IRoute[] = [];
    public mode: RouterMode = null;
    public root: string = '/';

    private interval: number = null;

    public config(options: IRouterOptions) {
        const historyModeChosen: boolean = options && options.mode && ((options.mode as number) === (RouterMode.History as number));

        this.mode = (historyModeChosen && !!(history.pushState)) ? RouterMode.History : RouterMode.Hash;
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    }

    private getFragment(): string {
        let fragment = '';
        if (this.mode === RouterMode.History) {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }

        return this.clearSlashes(fragment);
    }

    public add(routeExpression: string, handler: IRouterHandler): Router {
        this.routes.push({ expression: routeExpression, handler: handler });
        return this;
    }

    public remove(param): Router {
        for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
            if (r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    }

    public flush(): Router {
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    }

    private check(fragment: string): Router {
        fragment = fragment || this.getFragment();
        for (var i = 0; i < this.routes.length; i++) {
            const route = this.routes[i];

            var match = fragment.match(route.expression);
            if (match) {
                match.shift();
                route.handler.execute(route, fragment);
                return this;
            }
        }
        return this;
    }

    public listen(): Router {
        if(this.mode === null) {
            this.config({});
        }

        var self = this;
        var current = self.getFragment();
        var fn = function () {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        window.clearInterval(this.interval);
        this.interval = window.setInterval(fn, 50);
        // perform initial check
        self.check(current);
        return this;
    }

    public navigate(path: string): Router {
        path = path ? path : '';
        if (this.mode === RouterMode.History) {
            history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return this;
    }


    private clearSlashes(path: string): string {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }
}

export const router: Router = new Router();