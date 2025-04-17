import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Collector from "../src/pages/collector";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import { useRouter } from "next/router";
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('../src/components/Layout', () => ({ children }) => <div data-testid='layout'>{children}</div>);

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/dcschedule',
        query: { collector_data: 1 },
        push: jest.fn()
    }),
}));

jest.mock('../service_axios', () => ({
    get: jest.fn()
}));


describe('Collectors Page', () => {
    const mockCollectors = [
        { id: 1, username: 'mockapi1', role: 'Data Collector' },
        { id: 2, username: 'mockapi2', role: 'Data Collector' },
        { id: 3, username: 'mockapi3', role: 'Data Collector' }
    ];

    // test('Renders collector data', async () => {
    //     service.get.mockResolvedValueOnce({ data: mockCollectors });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Collector />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Collector Table'));
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('mockapi1')).toBeInTheDocument();
    //         expect(screen.getByText('mockapi2')).toBeInTheDocument();
    //         expect(screen.getByText('mockapi3')).toBeInTheDocument();
    //         userEvent.click(screen.getByTestId('button'))
    //     });
    // });

    test('service axios failure', async () => {
        service.get.mockRejectedValueOnce(new Error('Service axios error mesage'));

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));

        render (
            <Provider store={store}>
                <Layout>
                    <Collector />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Collector Table')).toBeInTheDocument();

        // await waitFor(() => {
        //     expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch collectors. Try Again Later');
        // });

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch collectors. Try Again Later');
        });
    })
})