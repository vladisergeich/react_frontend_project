import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import './normalize.css';
// import './index.css';
import App from './components/App/App';
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import {AuthProvider, useAuthContext} from "./context/authContext";
import PollutionPage from "./pages/PollutionPage";
import CityPage from "./pages/CityPage";
import { Provider } from 'react-redux'
import {store} from "./store";

const PrivateRoute = ({children}: {children: React.ReactElement}) => {
    const { isLogin } = useAuthContext()
    if (!isLogin) {
        return <Navigate to="/login"/>
    }

    return children
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/pollution",
                element: <PrivateRoute><PollutionPage /></PrivateRoute>,
            },
            {
                path: "/city",
                element: <PrivateRoute><CityPage /></PrivateRoute>,
            },
            {
                path: "/registration",
                element: <RegistrationPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <Provider store={store}>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </Provider>
    // </React.StrictMode>
);
