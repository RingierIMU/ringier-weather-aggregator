import { handler, port, hostname } from "./server.ts";

Deno.serve({ port, hostname }, handler);
