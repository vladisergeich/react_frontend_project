import React, {useState, useEffect} from "react";
import {Button, Form, Input, FormProps, FormRule} from "antd";

interface LoginFormProps {
    mode: 'login' | 'register',
    submitHandler: Function,
}

type FieldType = {
    email?: string;
    password?: string;
    confirm?: string;
};

export default function LoginRegistrationForm (props: LoginFormProps) {
    const [form] = Form.useForm();
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const {mode} = props

    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmitDisabled(false))
            .catch(() => setSubmitDisabled(true));
    }, [form, values]);

    const submitHandler: FormProps<FieldType>["onFinish"] = (formData) => {
        props.submitHandler(formData)
    };

    const passwordRules: FormRule[] = [
        { required: true, message: 'Нужно ввести пароль' },
        {
            min: 6,
            message: 'Минимум 6 символов'
        },
    ];

    if (mode === 'register') {
        passwordRules.push({
            pattern: /[a-z]/,
            message: 'Только английские символы в нижнем регистре'
        })
    }

    return (
        <Form
            form={form}
            layout={'horizontal'}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 400 }}
            onFinish={submitHandler}
            // autoComplete="off"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, type: 'email', message: 'Нужно ввести email' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                rules={passwordRules}
                hasFeedback={mode === 'register'}
            >
                <Input.Password />
            </Form.Item>

            {
                mode === 'register' &&
                <Form.Item
                    name="confirm"
                    label="Подтверждение"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Нужно ввести подтверждение пароля',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
            }

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={submitDisabled}
                >{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</Button>
            </Form.Item>
        </Form>
    );
}
