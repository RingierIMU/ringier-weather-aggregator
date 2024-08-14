import syncWeather from "./responders/sync-weather-responder.ts";

export type Route = {
    method: string;
    pattern: string; // Route pattern with placeholders (e.g., "/user/:id")
    handler: (req: Request, params: Record<string, string>) => Response | Promise<Response>;
  };

export const routes: Route[] = [
    {
        method: "GET",
        pattern: "/",
        handler: () => new Response("Welcome to the homepage!", { status: 200 }),
    },
    {
        method: "GET",
        pattern: "/sync-weather",
        handler: syncWeather,
    }
];
