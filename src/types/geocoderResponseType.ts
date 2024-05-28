export type GeocoderResponseType = {
    response: {
        GeoObjectCollection: {
            metaDataProperty: {
                GeocoderResponseMetaData: {
                    found: string,
                    request: string,
                    results: string,
                }
            },
            featureMember: [
                {
                    GeoObject: {
                        metaDataProperty: {
                            GeocoderMetaData: {
                                text: string
                            }
                        };
                        Point: {
                            pos: string
                        }
                    }
                }
            ]
        }
    }
};
