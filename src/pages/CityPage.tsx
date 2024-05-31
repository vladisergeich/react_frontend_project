import {Button, Form, type FormProps, Input, Table, TableProps, Tag, message} from 'antd';
import React, {useState, useEffect} from "react";
import dayjs from 'dayjs';
import {Column} from '@ant-design/charts';
import {geocoderApi} from '../services/geocoder'
import {useAppDispatch} from "../store";
import {useSelector} from "react-redux";
import {getPollutionsList} from "../store/pollutionsSelectors";
import {setPollutionsList, addPollution} from "../store/pollutionsSlice";
import {openWeatherMapApi} from "../services/openweathermap";
import {PollutionType} from "../types/pollutionType";

const serverPort = process.env.REACT_APP_SERVER_PORT
const serverBaseUrl = `//localhost:${serverPort}/api`

type FieldType = {
    address: string;
};

const tableColumns: TableProps<PollutionType>['columns'] = [
    {
        title: 'Адрес',
        dataIndex: 'address',
        key: 'title',
    },
    {
        title: 'Координаты',
        key: 'coords',
        render: (pollution) => <div>широта: {pollution.lat}, долгота: {pollution.lon}</div>,
    },
    {
        title: 'Дата и время измерений',
        key: 'datetime',
        render: (pollution) => <>{dayjs(pollution.measured_at).format('DD.MM.YYYY HH:mm:ss')}</>,
    },
    {
        title: 'Индекс качества воздуха',
        key: 'aqi',
        render: (pollution) => {
            let color;
            let label;
            switch (pollution.aqi) {
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

export default function CityPage() {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const pollutions = useSelector(getPollutionsList)

    useEffect(() => {
        fetch(`${serverBaseUrl}/pollutions`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }).then((res) => {
            return res.json()
        }).then((data) => {
            // console.log(data)
            dispatch(setPollutionsList(data))
        }).catch((e) => {
            messageApi.open({
                type: 'error',
                content: `Невозможно загрузить историю запросов (${e.message})`,
            });
        })

    }, [dispatch]);

    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [chartData, setChartData] = useState<ChartDataType[]>([]);

    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmitDisabled(false))
            .catch(() => setSubmitDisabled(true));
    }, [form, values]);

    useEffect(() => {
        const data: ChartDataType[] = [];

        if (pollutions.length) {
            pollutions.forEach(pollution => {
                data.push({
                    address: pollution.address,
                    parameter: 'Окись азота',
                    value: pollution.components.no2,
                })
                data.push({
                    address: pollution.address,
                    parameter: 'Озон',
                    value: pollution.components.o3,
                })
                data.push({
                    address: pollution.address,
                    parameter: 'Диоксид серы',
                    value: pollution.components.so2,
                })
                data.push({
                    address: pollution.address,
                    parameter: 'PM2.5',
                    value: pollution.components.pm2_5,
                })
                data.push({
                    address: pollution.address,
                    parameter: 'PM10',
                    value: pollution.components.pm10,
                })
            })

            setChartData(data)
        }

    }, [pollutions]);

    const handleSuccessSubmit: FormProps<FieldType>["onFinish"] = async (formData) => {
        // вместо стандартных хуков Redux RTK Query использую такую конструкцию для получения результат запроса в любом месте кода,
        // а не только непосредственно в функциональном компоненте

        dispatch(geocoderApi.endpoints.getCoordsByAddress.initiate(formData.address))
            .then(({data}) => {
                const geocoderData = data;

                form.resetFields()

                if (geocoderData?.response.GeoObjectCollection.featureMember.length) {
                    const coords = geocoderData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')

                    dispatch(openWeatherMapApi.endpoints.getAirPollutionByCoords.initiate({lat: coords[1], lon: coords[0]}))
                        .then(({data}) => {

                            if (data) {
                                const newPollution = {
                                    created_at: dayjs().toISOString(),
                                    address: geocoderData.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text,
                                    lat: data.coord.lat,
                                    lon: data.coord.lon,
                                    measured_at: dayjs.unix(data.list[0].dt).toISOString(),
                                    aqi: data.list[0].main.aqi,
                                    components: data.list[0].components,
                                } as PollutionType

                                dispatch(addPollution(newPollution))
                            }
                        })
                }

            })
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
            <h1>Информация о городе</h1>
            <p>Функционал доработан с использованием Redux RTK Query. Результаты сохраняются в БД. Введите нужный адрес и нажмите на кнопку "Получить".</p>

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

            {contextHolder}

            {!!pollutions.length &&
                <Table
                    columns={tableColumns}
                    dataSource={pollutions}
                    rowKey={(rec) => rec.id || `${rec.address}_${rec.created_at}`}
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
