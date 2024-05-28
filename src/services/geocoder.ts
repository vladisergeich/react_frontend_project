import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {GeocoderResponseType} from "../types/geocoderResponseType";

const baseUrl = 'https://geocode-maps.yandex.ru/1.x'
const geocoderApiKey = process.env.REACT_APP_YANDEX_GEOCODER_API_KEY

// Define a service using a base URL and expected endpoints
export const geocoderApi = createApi({
    reducerPath: 'geocoderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    tagTypes: ['GeocoderResponseType'],
    endpoints: (builder) => ({
        getCoordsByAddress: builder.query<GeocoderResponseType, string>({
            query: (address) => {
                return {
                    url: '/',
                    params:{
                        apikey: geocoderApiKey,
                        geocode: address,
                        format: 'json',
                        results: '1'
                    },
                }
            },
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCoordsByAddressQuery } = geocoderApi
