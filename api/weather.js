import axios from "axios";
import { apikey } from "../constants";

const forecastEndPoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.cityName}`;

const apicall = async (endpoint) => {
    const options ={
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(options);
        return response.data;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const fetchWeatherForecast = params => {
    return apicall(forecastEndPoint(params));
} 
export const fetchLocations = params => {
    return apicall(locationEndPoint(params));
} 
