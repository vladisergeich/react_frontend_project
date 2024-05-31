import {NavLink, useNavigate} from "react-router-dom";
import LoginRegistrationForm from "../components/Form/LoginRegistrationForm";

const serverPort = process.env.REACT_APP_SERVER_PORT
const serverBaseUrl = `//localhost:${serverPort}/api`

interface RegistrationObjectInterface {
    email: string,
    password: string,
    confirm: string,
}

export default function RegistrationPage () {
    const navigate = useNavigate();

    const registrationHandler = async ({email, password, confirm}: RegistrationObjectInterface) => {
        const payload = {email, password, confirm};

        try {
            await fetch(`${serverBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <h1>Регистрация</h1>

            <LoginRegistrationForm
                mode={'register'}
                submitHandler={registrationHandler}
            />

            <NavLink to={'/login'}>Вход</NavLink>
        </>
    );
}
