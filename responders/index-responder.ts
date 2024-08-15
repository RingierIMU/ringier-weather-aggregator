import { connect, view } from "../server-helpers.ts";

export default async () => {
    const query = `
        SELECT
            DATE(date) AS day,
            MIN(temperature) AS minimumTemperature,
            MAX(temperature) AS maximumTemperature
        FROM
            weather
        GROUP BY
            DATE(date)
        ORDER BY
            day;
    `;

    const db = connect();

    const results = db.query(query);

    const data = results
        .map(([day, minimumTemperature, maximumTemperature]) => ({
            day,
            minimumTemperature: parseFloat(minimumTemperature as string),
            maximumTemperature: parseFloat(maximumTemperature as string),
        }))
        .map(item => JSON.stringify(item));

    return await view('index', { data });
}
