import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.0.3/src/index.ts"

export type RouteMatch = {
    matched: boolean;
    params: Record<string, string>;
}

export const matchRoute = (pattern: string, url: string): RouteMatch => {
    const patternParts = pattern.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);

    if (patternParts.length !== urlParts.length) {
        return { matched: false, params: {} };
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = urlParts[i];
        } else if (patternParts[i] !== urlParts[i]) {
            return { matched: false, params: {} };
        }
    }

    return { matched: true, params };
};

export type WeatherData = {
    date: Date;
    city: string;
    latitude: string;
    longitude: string;
    temperature: number;
    visibility: string;
    dewPoint: number;
    feelsLike: number;
    minimumTemperature: number;
    maximumTemperature: number;
    pressure: string;
    seaLevel: string;
    groundLevel: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    windGust: string;
    weatherDescription: string;
}

export const kelvinToCelsius = (kelvin: string): number => {
    const kelvinValue = parseFloat(kelvin);
    return kelvinValue - 273.15;
};

export const marshalWeatherData = (data: Record<string, string>): WeatherData => {
    return {
        date: new Date(data.dt_iso),
        city: String(data.city_name),
        latitude: String(data.lat),
        longitude: String(data.lon),
        temperature: kelvinToCelsius(data.temp),
        visibility: String(data.visibility),
        dewPoint: kelvinToCelsius(data.dew_point),
        feelsLike: kelvinToCelsius(data.feels_like),
        minimumTemperature: kelvinToCelsius(data.temp_min),
        maximumTemperature: kelvinToCelsius(data.temp_max),
        pressure: String(data.pressure),
        seaLevel: String(data.sea_level),
        groundLevel: String(data.grnd_level),
        humidity: parseFloat(String(data.humidity)),
        windSpeed: parseFloat(String(data.wind_speed)),
        windDirection: parseFloat(String(data.wind_deg)),
        windGust: String(data.wind_gust),
        weatherDescription: String(data.weather_description),
    };
};

export const connect = () => {
    return new DB("weather.db");
};

export const createWeatherTable = (db: DB) => {
    db.execute(`
        CREATE TABLE IF NOT EXISTS weather (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            city TEXT NOT NULL,
            latitude TEXT NOT NULL,
            longitude TEXT NOT NULL,
            temperature REAL NOT NULL,
            visibility TEXT,
            dewPoint REAL NOT NULL,
            feelsLike REAL NOT NULL,
            minimumTemperature REAL NOT NULL,
            maximumTemperature REAL NOT NULL,
            pressure TEXT NOT NULL,
            seaLevel TEXT,
            groundLevel TEXT,
            humidity INTEGER NOT NULL,
            windSpeed REAL NOT NULL,
            windDirection INTEGER NOT NULL,
            windGust TEXT,
            weatherDescription TEXT NOT NULL
        );
    `);
};

export const insertWeatherData = (db: DB, weatherData: WeatherData) => {
    createWeatherTable(db);

    const checkQuery = `SELECT COUNT(*) FROM weather WHERE date = ?`;
    const result = db.query(checkQuery, [weatherData.date.toISOString()]);
    const [count] = result[0] as number[];

    if (count > 0) {
        // console.log(`Data for date ${weatherData.date.toISOString()} already exists.`);
        return;
    }

    const query = `
      INSERT INTO weather (
        date, city, latitude, longitude, temperature, visibility, dewPoint,
        feelsLike, minimumTemperature, maximumTemperature, pressure, seaLevel,
        groundLevel, humidity, windSpeed, windDirection, windGust, weatherDescription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      weatherData.date.toISOString(),
      weatherData.city,
      weatherData.latitude,
      weatherData.longitude,
      weatherData.temperature,
      weatherData.visibility,
      weatherData.dewPoint,
      weatherData.feelsLike,
      weatherData.minimumTemperature,
      weatherData.maximumTemperature,
      weatherData.pressure,
      weatherData.seaLevel,
      weatherData.groundLevel,
      weatherData.humidity,
      weatherData.windSpeed,
      weatherData.windDirection,
      weatherData.windGust,
      weatherData.weatherDescription
    ]);
};

export const view = async function(name: string, data: object = {}): Promise<Response> {
    const renderer = new Eta({
        views: "./templates/",
        cache: true,
        useWith: true,
    });

    const content = await renderer.renderAsync(name, data);

    return new Response(content, {
        headers: { "Content-Type": "text/html" }
    })
};
