import {Button, Form, FormProps, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import {useAddArticleMutation} from "../../services/serverApi";
import {useNavigate} from "react-router-dom";

type FieldType = {
    title: string;
    short_desc: string;
    description: string;
};

export default function ArticleCreatePage() {
    const [form] = Form.useForm();
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [addArticle, { isLoading }] = useAddArticleMutation()
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmitDisabled(false))
            .catch(() => setSubmitDisabled(true));
    }, [form, values]);

    const submitHandler: FormProps<FieldType>["onFinish"] = (formData) => {
        addArticle(formData).unwrap()
            .then((res) => {
                navigate(`/articles/${res.id}`);
            })
            .catch((e) => {
                console.log(e)
                messageApi.open({
                    type: 'error',
                    content: `Невозможно создать статью (${e.error})`,
                });
            })
    };

    return (
        <>
            <h1>Создание статьи</h1>
            {contextHolder}
            <Form
                form={form}
                layout={'vertical'}
                style={{ maxWidth: 600 }}
                onFinish={submitHandler}
                // autoComplete="off"
            >
                <Form.Item
                    label="Заголовок"
                    name="title"
                    rules={[
                        { required: true, message: 'Нужно указать заголовок' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Краткое описание"
                    name="short_desc"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Текст статьи"
                    name="description"
                    rules={[
                        { required: true, message: 'Нужно ввести текст статьи' }
                    ]}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 5, maxRows: 10 }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={submitDisabled}
                        loading={isLoading}
                    >Создать статью</Button>
                </Form.Item>
            </Form>
        </>
    );
}
