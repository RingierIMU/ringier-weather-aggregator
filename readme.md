# Ringier Weather Aggregator

This is an example project created to help with technical interviews.

## Getting Started

Follow these steps to get a general idea of what this app is about:

1. make sure you have deno installed
1. run the server
2. navigate to `/sync-weather`
3. wait a bit for some data to import
4. navigate to `/` to see the graph

### Installing Deno

On Mac, run:

```
brew install deno
```

For instructions installing homebrew, go to <https://brew.sh>
For instructions installed Deno, do to <https://deno.com>

### Running the Server

To start the server, use the following command:

```sh
deno run --allow-net run.ts
```

The server will start on port 8080 and handle defined routes.

### Running Tests

The tests handle starting and stopping the server internally. To run the tests, use:

```sh
deno test --allow-net
```

This command will execute the tests defined in `app_test.ts`, which will start the server, perform tests, and then stop the server.

### Notes

- **`run.ts`**: Entry point to start the server.
- **`routes.ts`**: Defines route patterns and handlers.
- **`server.test.ts`**: Contains tests for the routes. The server is started and stopped within the test code, so you don't need to manually run the server before testing.

For more information about Deno and its features, visit the [Deno documentation](https://deno.land/manual).
