import {PollutionApiResponseListItemType} from "./pollutionApiResponseListItemType";

export type GeoObjectType = {
    id: number,
    title: string,
    coords: {
        lat: number,
        lon: number,
    },
    airPollution: PollutionApiResponseListItemType
}
