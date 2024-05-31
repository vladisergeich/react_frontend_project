export type PollutionType = {
    id: number | undefined,
    created_at: string,
    address: string,
    lat: number,
    lon: number,
    measured_at: string,
    aqi: number,
    components: {
        co: number,
        no: number,
        no2: number,
        o3: number,
        so2: number,
        pm2_5: number,
        pm10: number,
        nh3: number
    },
}
