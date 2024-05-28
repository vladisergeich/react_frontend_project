import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {AirPollutionResponseType} from "../types/airPollutionResponseType";

const baseUrl = 'https://api.openweathermap.org/data/2.5'
const pollutionApiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY

// Define a service using a base URL and expected endpoints
export const openWeatherMapApi = createApi({
    reducerPath: 'openWeatherMapApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    tagTypes: ['AirPollutionResponseType'],
    endpoints: (builder) => ({
        getAirPollutionByCoords: builder.query<AirPollutionResponseType, object>({
            query: (coords: {lat: string, lon: string}) => {
                const {lat, lon} = coords
                return {
                    url: '/air_pollution',
                    params:{
                        appid: pollutionApiKey,
                        lat: lat,
                        lon: lon,
                    },
                }
            },
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAirPollutionByCoordsQuery } = openWeatherMapApi
