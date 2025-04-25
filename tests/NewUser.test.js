import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import NewUser from "../src/pages/newuser";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('../src/components/Layout', () => ({ children }) => <div data-testid='layout'>{children}</div>);

jest.mock('../service_axios', () => ({
    post: jest.fn(),
}));

describe('New User Page', () => {

    // test('renders the form successfully', () => {
        
    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <NewUser />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Create New User')).toBeInTheDocument();
    //     expect(screen.getByText('Username')).toBeInTheDocument();
    //     expect(screen.getByText('Password')).toBeInTheDocument();
    //     expect(screen.getByLabelText('Role')).toBeInTheDocument();
    //     expect(screen.getByText('Create User')).toBeInTheDocument();
    // })

    // test('new user created and success message shown', async () => {
    //     service.post.mockResolvedValueOnce({ data: { message: "New user created" } });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <NewUser />
    //             </Layout>
    //         </Provider>
    //     )
        
    //     expect(screen.getByText('Create New User')).toBeInTheDocument();
    //     userEvent.type(screen.getByText('Username'), 'testuser');
    //     userEvent.type(screen.getByText('Password'), 'testpass');
    //     userEvent.type(screen.getByLabelText('Role'), 'Data Collector');
    //     userEvent.click(screen.getByText('Create User'));

    //     setTimeout(() => {
    //         expect(screen.getByTestId('success')).toHaveTextContent('User created successfully')
    //     }, 3000);
    // });

    // test('new user creation failed and error message shown', async () => {
    //     service.post.mockRejectedValueOnce(new Error('failed to create new user'));

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <NewUser />
    //             </Layout>
    //         </Provider>
    //     )
        
    //     expect(screen.getByText('Create New User')).toBeInTheDocument();
    //     userEvent.type(screen.getByText('Username'), 'ftestuser');
    //     userEvent.type(screen.getByText('Password'), 'ftestpass');
    //     userEvent.type(screen.getByLabelText('Role'), 'Approver');
    //     userEvent.click(screen.getByText('Create User'));

    //     setTimeout(() => {
    //         expect(screen.getByTestId('error')).toHaveTextContent('Failed to create new user')
    //     }, 3000);
    // });

        test('new user creation failed and error message shown', async () => {
        service.post.mockRejectedValueOnce(new Error('failed to create new user'));

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));

        render (
            <Provider store={store}>
                <Layout>
                    <NewUser />
                </Layout>
            </Provider>
        )
        
        expect(screen.getByText('Create New User')).toBeInTheDocument();
        userEvent.type(screen.getByText('Username'), 'ftestuser');
        userEvent.type(screen.getByText('Password'), 'ftestpass');
        userEvent.type(screen.getByLabelText('Role'), 'Approver');
        userEvent.click(screen.getByText('Create User'));

        setTimeout(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to create new user')
        }, 3000);
    })

})