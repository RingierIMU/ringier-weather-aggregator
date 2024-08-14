interface TestServerParams {
    handler: Deno.ServeHandler;
    port: number;
    hostname: string;
    test: (url: string) => Promise<void>;
}

export const testServer = async ({
    handler,
    port,
    hostname,
    test,
}: TestServerParams) => {
    const controller = new AbortController();

    const serverPromise = Deno.serve({
        port,
        hostname,
        signal: controller.signal,
    }, handler);

    await new Promise((resolve) => setTimeout(resolve, 100));

    await test(`http://${hostname}:${port}`);

    controller.abort();

    await serverPromise;
};
