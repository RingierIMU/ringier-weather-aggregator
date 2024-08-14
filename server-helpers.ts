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
