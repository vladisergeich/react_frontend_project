import {useAuthContext} from "../../context/authContext";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import {Button, Flex, Menu, MenuProps} from "antd"

export default function MyHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const {isLogin, user, logout} = useAuthContext()

    const logoutHandler = () => {
        logout(() => {
            navigate('/login')
        });
    }

    const topNavItems: MenuProps['items'] = [
        {
            key: '/',
            label: <NavLink to="/">Главная</NavLink>
        },
        {
            key: '/pollution',
            label: <NavLink to="/pollution">Загрязнения</NavLink>,
            disabled: !isLogin
        },
        {
            key: '/city',
            label: <NavLink to="/city">Информация о городе</NavLink>,
            disabled: !isLogin
        },
        {
            key: '/login',
            label: <NavLink to="/login">Вход</NavLink>,
            disabled: isLogin
        },
        {
            key: '/registration',
            label: <NavLink to="/registration">Регистрация</NavLink>,
            disabled: isLogin
        },
        {
            key: '/articles',
            label: <NavLink to="/articles">Статьи</NavLink>,
        },
    ];

    return (
        <Flex align={'center'}>
            <Menu
                style={{flexGrow: 1}}
                items={topNavItems}
                mode="horizontal"
                theme="dark"
                // defaultSelectedKeys={['home']}
                selectedKeys={[location.pathname]}
            />

            {isLogin && user && <Flex gap={'middle'} align={'center'}>
                <span style={{color: 'white'}}>{JSON.parse(user).email}</span>
                <Button
                    data-role="logout"
                    onClick={logoutHandler}
                    size={'small'}
                    type={'primary'}
                >Выйти</Button>
            </Flex>}
        </Flex>
    )
}
