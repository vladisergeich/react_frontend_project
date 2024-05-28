import {Button, Form, type FormProps, Input, Table, TableProps, Tag} from 'antd';
import React, {useState, useEffect} from "react";
import dayjs from 'dayjs';
import {Column} from '@ant-design/charts';

const geocoderApiKey = process.env.REACT_APP_YANDEX_GEOCODER_API_KEY
const pollutionApiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY

type FieldType = {
    address?: string;
};

type GeocoderResponseType = {
    response: {
        GeoObjectCollection: {
            metaDataProperty: {},
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

type PollutionApiResponseListItemType = {
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
    dt: number,
    main: {
        aqi: number
    }
}

type GeoObjectType = {
    id: number,
    title: string,
    coords: {
        lat: number,
        lon: number,
    },
    airPollution: PollutionApiResponseListItemType
}

const tableColumns: TableProps<GeoObjectType>['columns'] = [
    {
        title: 'Адрес',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Координаты',
        dataIndex: 'coords',
        key: 'coords',
        render: (coords) => <div>широта: {coords.lat}, долгота: {coords.lon}</div>,
    },
    {
        title: 'Дата и время измерений',
        dataIndex: 'airPollution',
        key: 'datetime',
        render: (airPollution) => <>{dayjs.unix(airPollution.dt).format('DD.MM.YYYY HH:mm:ss')}</>,
    },
    {
        title: 'Индекс качества воздуха',
        dataIndex: 'airPollution',
        key: 'aqi',
        render: (airPollution) => {
            let color;
            let label;
            switch (airPollution.main.aqi) {
                case 1:
                    color = 'green'
                    label = 'Хороший'
                    break
                case 2:
                    color = 'lime'
                    label = 'Нормальный'
                    break
                case 3:
                    color = 'gold'
                    label = 'Удовлетворительный'
                    break
                case 4:
                    color = 'volcano'
                    label = 'Плохой'
                    break
                case 5:
                    color = 'red'
                    label = 'Очень плохой!'
                    break
            }
            return <Tag color={color}>{label}</Tag>
        }
    },
];

type ChartDataType = {
    address: string,
    parameter: string,
    value: number,
}

export default function PollutionPage() {
    const [form] = Form.useForm();

    // const [address, setAddress] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [geocoderData, setGeocoderData] = useState<GeocoderResponseType | null>(null);
    const [geoObjects, setGeoObjects] = useState<GeoObjectType[]>([]);
    const [chartData, setChartData] = useState<ChartDataType[]>([]);

    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmitDisabled(false))
            .catch(() => setSubmitDisabled(true));
    }, [form, values]);

    useEffect(() => {
        if (geocoderData?.response.GeoObjectCollection.featureMember.length) {
            const coords = geocoderData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')

            try {
                fetch('https://api.openweathermap.org/data/2.5/air_pollution?' + new URLSearchParams({
                    appid: pollutionApiKey || '',
                    lat: coords[1],
                    lon: coords[0],
                }))
                    .then((res) => res.json())
                    .then((data) => {
                        const geoObject: GeoObjectType = {
                            id: dayjs().valueOf(),
                            title: geocoderData.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text,
                            coords: {
                                lat: +coords[1],
                                lon: +coords[0],
                            },
                            airPollution: data.list[0]
                        }

                        setGeoObjects(geoObjects => [...geoObjects, geoObject])
                        setGeocoderData(null)
                    })
            } catch (e) {
                console.log(e)
            }
        }
    }, [geocoderData]);

    useEffect(() => {
        const data: ChartDataType[] = [];

        if (geoObjects.length) {
            geoObjects.forEach(geoObject => {
                data.push({
                    address: geoObject.title,
                    parameter: 'Окись азота',
                    value: geoObject.airPollution.components.no2,
                })
                data.push({
                    address: geoObject.title,
                    parameter: 'Озон',
                    value: geoObject.airPollution.components.o3,
                })
                data.push({
                    address: geoObject.title,
                    parameter: 'Диоксид серы',
                    value: geoObject.airPollution.components.so2,
                })
                data.push({
                    address: geoObject.title,
                    parameter: 'PM2.5',
                    value: geoObject.airPollution.components.pm2_5,
                })
                data.push({
                    address: geoObject.title,
                    parameter: 'PM10',
                    value: geoObject.airPollution.components.pm10,
                })
            })

            setChartData(data)
        }

    }, [geoObjects]);

    const handleSuccessSubmit: FormProps<FieldType>["onFinish"] = (formData) => {
        try {
            fetch('https://geocode-maps.yandex.ru/1.x/?' + new URLSearchParams({
                apikey: geocoderApiKey || '',
                geocode: formData?.address || '',
                format: 'json',
                results: '1'
            }))
                .then((res) => res.json())
                .then((data) => {
                    setGeocoderData(data)

                    form.resetFields()
                })
        } catch (err) {
            console.log(err)
        }
    };

    const chartConfig = {
        height: 400,
        xField: 'address',
        yField: 'value',
        // group: true,
        stack: true,
        colorField: 'parameter',
        axis: {
            x: {
                title: 'Адрес'
            },
            y: {
                title: 'Концентрация в мкг/куб.м'
            },
        },
    };

    return (
        <>
            <h1>Загрязнения</h1>
            <p>На данной странице вы можете узнать уровень загрязнений различных населенных пунктов. Введите нужный адрес и нажмите на кнопку
                "Получить".</p>

            <Form
                form={form}
                layout={'vertical'}
                onFinish={handleSuccessSubmit}
                autoComplete="off"
            >
                <Form.Item
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: 'Нужно ввести название города или адрес'
                        },
                        {
                            min: 3,
                            message: 'Минимум 3 символа'
                        },
                    ]}
                >
                    <Input placeholder="Введите название города или адрес"/>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={submitDisabled}
                    >Получить</Button>
                </Form.Item>
            </Form>

            {!!geoObjects.length &&
                <Table
                    columns={tableColumns}
                    dataSource={geoObjects}
                    rowKey={'id'}
                    size={'small'}
                    scroll={{
                        x: true
                    }}
                />
            }

            {!!chartData.length &&
                <Column
                    data={chartData}
                    {...chartConfig}
                />
            }
        </>
    );
}
