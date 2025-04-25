import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Login from "../src/pages/login";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import { useRouter } from "next/router";
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('../src/components/Layout', () => ({ children }) => <div data-testid='layout'>{children}</div>);

jest.mock("next/router", () => ({
    useRouter: () => ({
        push: jest.fn()
    }),
}));

jest.mock('../service_axios', () => ({
    post: jest.fn(),
}));

describe('Login Page', () => {
    
    // test('renders Login Form', () => {

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //         role: 'SuperAdmin',
    //         token: 'abc@1',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeInTheDocument();
    //     expect(screen.getByText('Username')).toBeInTheDocument();
    //     expect(screen.getByText('Password')).toBeInTheDocument();
    //     expect(screen.getByText('Login')).toBeInTheDocument();
    // });

    // test('handles sucessfull login', () => {
    //     service.post.mockResolvedValueOnce({ data: { username: 'testuser', role: 'SuperAdmin', access_token: 'tok_abc@1' } });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         role: 'SuperAdmin',
    //         token: 'tok_abc@1',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeInTheDocument();
    //     userEvent.type(screen.getByText('Username'), 'testuser');
    //     userEvent.type(screen.getByText('Password'), 'testpwd');
    //     userEvent.click(screen.getByText('Login'));
    // });

    test('handles login failure', async () => {
        service.post.mockResolvedValueOnce({ data: {} });

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'testuser',
            role: 'SuperAdmin',
            token: 'tok_abc@1',
        }));

        render (
            <Provider store={store}>
                <Layout>
                    <Login />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        userEvent.type(screen.getByText('Username'), 'testuser');
        userEvent.type(screen.getByText('Password'), 'testpwd');
        userEvent.click(screen.getByText('Login'));

        setTimeout(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Invalid Username or password');
        }, 3000)
    });

    // test('handles API failure', async () => {
    //     service.post.mockRejectedValueOnce(new Error('request failed'));

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         role: 'SuperAdmin',
    //         token: 'tok_abc@1',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeInTheDocument();
    //     userEvent.type(screen.getByText('Username'), 'testuser');
    //     userEvent.type(screen.getByText('Password'), 'testpwd');
    //     userEvent.click(screen.getByText('Login'));

    //     setTimeout(() => {
    //         expect(screen.getByTestId('error')).toHaveTextContent('Failed authentication, Try Again');
    //     }, 3000)
    // });
})
