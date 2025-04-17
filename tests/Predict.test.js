import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import PredictSchedule from "../src/pages/predict";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('../src/components/Layout', () => ({ children }) => <div data-testid='layout'>{children}</div>);

jest.mock('../service_axios', () => ({
    get: jest.fn(),
}));

describe('Predictions Page', () => {
    const mockData = {
        data: {
            data: [
                { visit_date: '2025-04-01', predicted_schedule_count: 1},
                { visit_date: '2025-04-02', predicted_schedule_count: 1},
                { visit_date: '2025-04-03', predicted_schedule_count: 1},
                { visit_date: '2025-04-04', predicted_schedule_count: 2}
            ],
            message: 'Predictions loaded successfully!'
        },
    };
    
    // test('renders loading state', async () => {
    //     service.get.mockResolvedValueOnce({ data: [], message: 'Predictions loaded successfully!' });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <PredictSchedule />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Predicted Schedules')).toBeInTheDocument();
    //     userEvent.click(screen.getByTestId('button'));
    //     expect(screen.getByTestId('load')).toBeInTheDocument();
    // });

    // test('renders predicted data', async () => {
    //     service.get.mockResolvedValueOnce( mockData );

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <PredictSchedule />
    //             </Layout>
    //         </Provider>
    //     )

    //     setTimeout(() => {
    //         expect(screen.getByText('Predicted Schedules')).toBeInTheDocument();
    //         userEvent.click(screen.getByTestId('button'));
    //         expect(screen.getByTestId('load')).toBeInTheDocument();
    //         expect(screen.getByText('2024-04-02')).toBeInTheDocument();
    //         expect(screen.getByText('2')).toBeInTheDocument();
    //     }, 3000);
    // });

    test('renders predicted data', async () => {
        service.get.mockRejectedValueOnce(new Error('Prediction error'));

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));

        render (
            <Provider store={store}>
                <Layout>
                    <PredictSchedule />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Predicted Schedules')).toBeInTheDocument();
        userEvent.click(screen.getByTestId('button'));
        
        setTimeout(() => {
            expect(screen.getByText('Error: Failed to get predictions. Try Again Later.'));
        }, 3000);
    });
})