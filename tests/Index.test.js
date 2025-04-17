import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Home from "../src/pages/index";
import { configureStore } from '@reduxjs/toolkit'
import {store} from '../redux/Store'
import authReducer, { login } from '../redux/AuthSlice';
import { Provider } from "react-redux";
import Layout from "../src/components/Layout";


jest.mock("../src/components/Layout", () => ({ children }) => <div data-testid="layout">{children}</div>);

// test('renders home page when logged in', () => {

//     const store = configureStore({
//         reducer: { authReducer },
//     })

//     store.dispatch(login({
//         user: 'test',
//     }))

//     render(
//         <Provider store={store}>
//             <Layout>
//                 <Home />
//             </Layout>
//         </Provider>
//     )
//     expect(screen.getByText('Admin Website')).toBeInTheDocument();
//     expect(screen.getByText('Welcome Back Admin: test')).toBeInTheDocument();
//     expect(screen.getByText('Project: Geolocation And Data Validation')).toBeInTheDocument();

// })

test('prompts to log in when no authenticated', () => {

    const initialState = {
        authReducer: { 
            isAuthenticated: false,
            role: null,
        },
    }

    const store = configureStore({
        reducer: { authReducer },
        initialState
    })


    render(
        <Provider store={store}>
            <Layout>
                <Home />
            </Layout>
        </Provider>
    )
    expect(screen.getByText('Admin Website')).toBeInTheDocument();
    expect(screen.getByText('Please log in to access more features.')).toBeInTheDocument();
})