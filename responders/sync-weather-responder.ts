import { parse } from "jsr:@std/csv";
import { connect, insertWeatherData, marshalWeatherData } from "../server-helpers.ts";
import { createWeatherTable } from "../server-helpers.ts";

export default () => {
    downloadAndProcess().catch(console.error);

    return new Response("Weather", { status: 200 });
}

let columns: string[] = [];

const processLine = (line: string) => {

    if (columns.length === 0) {
        columns = line.trim().split(",");
        return;
    }

    const data = parse(line, {
        columns,
    });

    const marshalled = marshalWeatherData(data[0]);

    insertWeatherData(connect(), marshalled);
};

const downloadAndProcess = async () => {
    const response = await fetch("https://assertchris.fra1.cdn.digitaloceanspaces.com/ad-hoc/14-08-2024-ringier-silly-aggregator/Cape_Town_-33_922087_18_423142_66bc2723bf8a6c0008de9189.csv");

    if (!response.body) {
        throw new Error("Failed to fetch file");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;

        while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            processLine(line);
        }
    }

    if (buffer.length > 0) {
        processLine(buffer);
    }
};
