import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Schedule from "../src/pages/schedule";
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
        pathname: '/adetails/',
        query: { schedule_data: 1 },
        push: jest.fn()
    }),
}));

jest.mock('../service_axios', () => ({
    get: jest.fn(),
}));

describe('Scehdules Page', () => {
    const mockSchedules = [
        { id: 1, approver: { username: 'aprvr1' }, collectors: [ { username: 'coltr1' }, { username: 'coltr2' } ], plant: { name: 'plant1' }, visit_date: '2025-04-01'},
        { id: 2, approver: { username: 'aprvr2' }, collectors: [ { username: 'coltr1' }, { username: 'coltr2' }, { username: 'coltr3' } ], plant: { name: 'plant2' }, visit_date: '2025-04-05'},
        { id: 3, approver: { username: 'aprvr3' }, collectors: [ { username: 'coltr1' } ], plant: { name: 'plant3' }, visit_date: '2025-04-10'},
    ];

    // test('renders schedule data', async () => {
    //     service.get.mockResolvedValueOnce({ data: mockSchedules })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Schedule />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();


    //     await waitFor(() => {
    //         expect(screen.getByText('aprvr1')).toBeInTheDocument();
    //         expect(screen.getByText('coltr1, coltr2, coltr3')).toBeInTheDocument();    
    //         expect(screen.getByText('plant2')).toBeInTheDocument();
    //         expect(screen.getByText('2025-04-01')).toBeInTheDocument();
    //         userEvent.click(screen.getByTestId('button'));
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
                    <Schedule />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Schedule Table')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch schedules. Try Again Later');
        });
    })
    
})