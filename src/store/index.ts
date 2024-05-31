import {configureStore} from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import {setupListeners} from '@reduxjs/toolkit/query'
import {geocoderApi} from '../services/geocoder'
import {openWeatherMapApi} from "../services/openweathermap";
import {useDispatch} from "react-redux";
import pollutionsSlice from "./pollutionsSlice";
import {serverApi} from "../services/serverApi";

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [geocoderApi.reducerPath]: geocoderApi.reducer,
        [openWeatherMapApi.reducerPath]: openWeatherMapApi.reducer,
        [serverApi.reducerPath]: serverApi.reducer,
        pollutions: pollutionsSlice,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(geocoderApi.middleware)
            .concat(openWeatherMapApi.middleware)
            .concat(serverApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>
