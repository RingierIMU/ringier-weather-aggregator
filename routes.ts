import indexResponder from "./responders/index-responder.ts";
import syncWeatherResponder from "./responders/sync-weather-responder.ts";

export type Route = {
    method: string;
    pattern: string; // Route pattern with placeholders (e.g., "/user/:id")
    handler: (req: Request, params: Record<string, string>) => Response | Promise<Response>;
  };

export const routes: Route[] = [
    {
        method: "GET",
        pattern: "/",
        handler: indexResponder,
    },
    {
        method: "GET",
        pattern: "/sync-weather",
        handler: syncWeatherResponder,
    }
];
