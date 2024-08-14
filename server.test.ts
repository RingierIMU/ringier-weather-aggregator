import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { testServer } from "./test-helpers.ts";
import { handler, hostname, port } from "./server.ts";

Deno.test("Root path returns 200 status code", async () => {
    await testServer({
        handler,
        port,
        hostname,
        test: async () => {
            const response = await fetch(`http://${hostname}:${port}`);
            assertEquals(response.status, 200);
            await response.body?.cancel()
        }},
    )
});
