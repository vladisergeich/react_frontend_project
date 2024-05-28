import {PollutionApiResponseListItemType} from "./pollutionApiResponseListItemType";

export type AirPollutionResponseType = {
    "coord": {
        "lon": number,
        "lat": number
    },
    "list": PollutionApiResponseListItemType[]
};
