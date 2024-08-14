import { routes } from "./routes.ts";
import { matchRoute } from "./server-helpers.ts";

export const handler = function(req: Request): Response|Promise<Response> {
    const { method, url } = req;

    let match = null;
    let route = null;

    for (const nextRoute of routes) {
        const nextMatch = matchRoute(nextRoute.pattern, new URL(url).pathname);

        if (nextRoute.method === method && nextMatch.matched) {
            match = nextMatch;
            route = nextRoute;
            break;
        }
    }

    if (match === null || route === null) {
        return new Response("Not Found", { status: 404 });
    }

    return route.handler(req, match.params);
};

export const hostname = "127.0.0.1";

export const port = 8000;
