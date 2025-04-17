import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import UserIndex from "../src/pages/user/index";
import Layout from "../src/components/Layout";
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock("../src/components/Layout", () => ({ children }) => <div data-testid="layout">{children}</div>);

jest.mock('../service_axios', () => ({
    get: jest.fn()
}));

describe('Users Page', () => {

    const mockUsers = [
        { id: 1, username: 'user1', role: 'Approver' },
        { id: 2, username: 'user2', role: 'Data Collector' },
        { id: 3, username: 'user3', role: 'SuperAdmin' },
    ];

    // test('renders users data', async () => {

    //     service.get.mockResolvedValueOnce({ data: mockUsers });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })
        
    //     store.dispatch(login({
    //         user: 'test',
    //     }))

    //     render(
    //         <Provider store={store}>
    //             <UserIndex />
    //         </Provider>
    //     )
    //     expect(screen.getByText('User Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('user1')).toBeInTheDocument();
    //         expect(screen.getByText('Data Collector')).toBeInTheDocument();
    //         expect(screen.getByText('SuperAdmin')).toBeInTheDocument();
    //         expect(screen.getByTestId('button')).toBeInTheDocument();    
    //     });
    // });

    test('service axios failure', async () => {
        service.get.mockRejectedValueOnce(new Error('Service axios error message'));
    
        const store = configureStore({
            reducer: { authReducer },
        });
    
        store.dispatch(login({
            user: 'test',
        }));
    
        render(
            <Provider store={store}>
                <Layout>
                    <UserIndex />
                </Layout>
            </Provider>
        );
    
        expect(screen.getByText('User Table')).toBeInTheDocument();
    
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch users. Try Again Later');
        });
    });    

})