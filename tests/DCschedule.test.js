import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import DCSchedule from "../src/pages/dcschedule";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, { login } from '../redux/AuthSlice';
import { useRouter } from "next/router";
import Image from "next/image";
import service from "../service_axios";
import { Provider } from "react-redux";
import { __esModule } from "redux-persist/lib/storage";

jest.mock('../src/components/Layout', () => ({ children }) => <div data-testid='layout'>{children}</div>);

//--------- This router is for METHOD-1-----------//

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/adetails/',
        query: { collector_data: 1 },
        push: jest.fn()
    }),
}));

//--------- This router is for METHOD-2-----------//

// jest.mock('next/router', () => ({
//     useRouter: jest.fn(),
// }));


jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} alt="mockimage" />
}));

jest.mock('../service_axios', () => ({
    get: jest.fn(),
}));

//----------------------------METHOD 1-------------------------------//
describe('Approvers Schedule Page', () => {

    const mockScheduleData = [
        { id: 1, collectors: [{ username: 'clctr5' }, { username: 'clct6' }], plant: { name: 'plant5' }, visit_date: '2025-04-06' },
        { id: 2, collectors: [{ username: 'clctr6' }, { username: 'clctr7' }], plant: { name: 'plant6' }, visit_date: '2025-04-16' }
    ]

    const mockUserData = { id: 9, username: 'testuser6', role: 'Data Collector' };


//---------------For this TEST CASE-1 in DCschedule.jsx comment out "collschedulesid" this api endpoint-------------//

    // test('renders collector details and loading for schedule table', async () => {

    //     service.get.mockResolvedValueOnce({ data: mockUserData });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <DCSchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Collector Details...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('Data Collector Details')).toBeInTheDocument();
    //         expect(screen.getByText('9')).toBeInTheDocument();
    //         expect(screen.getByText('testuser6')).toBeInTheDocument();
    //         expect(screen.getByText('Data Collector')).toBeInTheDocument();

    //     });

    //     expect(screen.getByText('Collectors Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument(); 
    // });


//---------------For this TEST CASE-2 in DCschedule.jsx comment out "users" this api endpoint-------------//

    // test('renders loading for collector details and collectors schedule table ', async () => {

    //     service.get.mockResolvedValueOnce({ data: mockScheduleData });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <DCSchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Collector Details...')).toBeInTheDocument();
    //     expect(screen.getByText('Collectors Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument(); 

    //     await waitFor(() => {
    //         expect(screen.getByText('1')).toBeInTheDocument();
    //         expect(screen.queryByText('abcd')).not.toBeInTheDocument();
    //         expect(screen.getByText('clctr6, clctr7')).toBeInTheDocument();
    //         expect(screen.getByText('plant6')).toBeInTheDocument();
    //         expect(screen.getByText('2025-04-16')).toBeInTheDocument();
    //         expect(screen.getByTestId('button')).toBeInTheDocument();
    //     });
    // });

    test('displays error message', async () => {

        service.get.mockRejectedValueOnce(new Error());

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));
        
        render(
            <Provider store={store}>
                <DCSchedule />
            </Provider>
        );
        expect(screen.getByText('Loading Collector Details...')).toBeInTheDocument();
        expect(screen.getByText('Collectors Schedule Table')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch schedules. Try Again Later.')).toBeInTheDocument();
        });
    });

});

//----------------------------METHOD 2-------------------------------//
// describe('ASchedule Page', () => {

//     beforeEach(() => {
//         useRouter.mockReturnValue({
//             query: { collector_data: '1' },
//             push: jest.fn(),
//         });

//         service.get.mockImplementation((url) => {
//             if (url.startsWith('/collschedulesid/')) {
//                 return Promise.resolve({
//                     data: [
//                         { id: 1, collectors: [{ username: 'clctr5' }, { username: 'clct6' }], plant: { name: 'plant5' }, visit_date: '2025-04-06' },
//                         { id: 2, collectors: [{ username: 'clctr6' }, { username: 'clctr7' }], plant: { name: 'plant6' }, visit_date: '2025-04-16' }                
//                     ],
//                 });
//             } else if (url.startsWith('/users/')) {
//                 return Promise.resolve({
//                     data: { id: 9, username: 'testuser6', role: 'Data Collector' },
//                 });
//             }
//         });
//     });

//     test('renders loading state, then schedule table and collector details', async () => {

//         const store = configureStore({
//             reducer: { authReducer },
//         });

//         store.dispatch(login({
//             user: 'test',
//         }));
        
//         render(
//             <Provider store={store}>
//                 <DCSchedule />
//             </Provider>
//         );
//         expect(screen.getByText('Loading Collector Details...')).toBeInTheDocument();

//         await waitFor(() => {
//             expect(screen.getByText('Data Collector Details')).toBeInTheDocument();
//             expect(screen.getByText('9')).toBeInTheDocument();
//             expect(screen.getByText('testuser6')).toBeInTheDocument();
//             expect(screen.getByText('Data Collector')).toBeInTheDocument();

//             expect(screen.getByText('Collectors Schedule Table')).toBeInTheDocument();
//             expect(screen.getByText('2')).toBeInTheDocument();
//             expect(screen.getByText('clctr6, clctr7')).toBeInTheDocument();
//             expect(screen.getByText('plant6')).toBeInTheDocument();
//             expect(screen.getByText('2025-04-06')).toBeInTheDocument();
//             expect(screen.getByTestId('button')).toBeInTheDocument();
//         });    
//     });
// });
