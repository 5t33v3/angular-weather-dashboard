export interface WeatherData {
    location: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
}

export interface WeatherForecast {
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
}