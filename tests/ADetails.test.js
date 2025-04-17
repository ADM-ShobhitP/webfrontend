import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import ADetails from "../src/pages/adetails";
import Layout from '../src/components/Layout';
import MapComponent from "../src/components/MapComponent";
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, { login } from '../redux/AuthSlice';
import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('../src/components/Layout', () => ({children}) => <div data-testid='layout'>{children}</div>);

const mockBack = jest.fn();

jest.mock('next/router', () => ({
    useRouter: () => ({
        query: { schedule_data: '1' },
        back: mockBack
    }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} alt="mockimage" />
}));

jest.mock('../service_axios', () => ({
    get: jest.fn(),
}));

jest.mock('../src/components/MapComponent', () => () => <div data-testid='map'>Map Content</div>);

describe('ADetails Page', () => {
    const mockScheduleCollectedData = [
        {
            id: 1,
            Name_client: 'Test Client Name',
            Designation_client: 'Test Client Designation',
            Email_client: "test@client.com",
            Contact_client: "1234567890",
            visit_date: "2025-04-05",
            start_time: '11:00:00',
            end_time: '19:30:00',
            dc_location_lat: 22.5778751,
            dc_location_long: 88.4615021,
            boundary: [
                {latitude: 22.5808, longitude: 88.4591},
                {latitude: 22.5764, longitude: 88.4621},
                {latitude: 22.5802, longitude: 88.4629},
            ],
            plant: { name: 'Mock Plant' },
        },
    ];

    // test('renders loading state, collected data, plant data and button', async () => {
    //     service.get.mockResolvedValueOnce({ data: mockScheduleCollectedData });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <ADetails />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();
    //     await waitFor(() => {
    //         expect(screen.getByText('Collected Data')).toBeInTheDocument();

    //         expect(screen.getByText('Client Details')).toBeInTheDocument();
    //         expect(screen.getByText('Point Is Inside The Boundary')).toBeInTheDocument();    
    //         expect(screen.getByText('Test Client Name')).toBeInTheDocument();    
    //         expect(screen.getByText('Test Client Designation')).toBeInTheDocument();
    //         expect(screen.getByText('test@client.com')).toBeInTheDocument();
    //         expect(screen.getByText('1234567890')).toBeInTheDocument();

    //         expect(screen.getByText('Visit Details')).toBeInTheDocument();
    //         expect(screen.getByText('April 2025')).toBeInTheDocument();
    //         userEvent.hover(screen.getByText('April 2025'));
    //         waitFor(() => {
    //             expect(screen.getByText('Working Hour:')).toBeInTheDocument();
    //             expect(screen.getByText('11:00:00-19:30:00')).toBeInTheDocument();
    //         });

    //         expect(screen.getByText('Plant Location')).toBeInTheDocument();
    //         expect(screen.getByText('Mock Plant')).toBeInTheDocument();
    //         expect(screen.getByTestId('map')).toHaveTextContent('Map Content');

    //         userEvent.click(screen.getByTestId('button'));
    //         expect(mockBack).toHaveBeenCalled();
    //     });
    // });

    test('renders error message when no collected data available', async () => {

        service.get.mockResolvedValueOnce({ data: [] });

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));

        render(
            <Provider store={store}>
                <ADetails />
            </Provider>
        )
        expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('No data available for this Approver')).toBeInTheDocument();
        })
    });
});
