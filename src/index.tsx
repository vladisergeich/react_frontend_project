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
import ArticlesListPage from "./pages/articles/ArticlesListPage";
import ArticlePage from "./pages/articles/ArticlePage";
import { Provider } from 'react-redux'
import {store} from "./store";
import ArticleCreatePage from "./pages/articles/ArticleCreatePage";

const PrivateRoute = ({children}: {children: React.ReactElement}) => {
    const { isLogin } = useAuthContext()
    if (!isLogin) {
        return <Navigate to="/login"/>
    }

    return children
}

const GuestOnlyRoute = ({children}: {children: React.ReactElement}) => {
    const { isLogin } = useAuthContext()
    if (isLogin) {
        return <Navigate to="/"/>
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
                path: "/articles",
                children: [
                    {
                        index: true,
                        element: <ArticlesListPage />,
                    },
                    {
                        path: "create",
                        element: <PrivateRoute><ArticleCreatePage /></PrivateRoute>,
                    },
                    {
                        path: ":id",
                        element: <ArticlePage />,
                    },
                ],
            },
            {
                path: "/registration",
                element: <GuestOnlyRoute><RegistrationPage /></GuestOnlyRoute>,
            },
            {
                path: "/login",
                element: <GuestOnlyRoute><LoginPage /></GuestOnlyRoute>,
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
