import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import ASchedule from "../src/pages/aschedule";
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

// jest.mock('next/router', () => ({
//     useRouter: () => ({
//         pathname: '/adetails/',
//         query: { approver_id: 1 },
//         push: jest.fn()
//     }),
// }));

//--------- This router is for METHOD-2-----------//

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

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
        { id: 1, approver: { username: 'aprvr1' }, collectors: [{ username: 'clctr1' }, { username: 'clctr2' }], plant: { name: 'plant1' }, visit_date: '2025-04-05' },
        { id: 2, approver: { username: 'aprvr2' }, collectors: [{ username: 'clctr2' }, { username: 'clctr3' }], plant: { name: 'plant2' }, visit_date: '2025-04-07' }
    ]

    const mockUserData = { id: 4, username: 'testuser', role: 'Approver' };

//---------------For this TEST CASE-1 in aschedule.jsx comment out "apprschedulesid" this api endpoint-------------//
    // test('renders approver details and loading for schedule table', async () => {
    //     service.get.mockResolvedValueOnce({ data: mockUserData })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('Approver Details')).toBeInTheDocument();

    //         expect(screen.getByText('4')).toBeInTheDocument();
    //         expect(screen.queryByText('abcd')).not.toBeInTheDocument();
    //         expect(screen.getByText('testuser')).toBeInTheDocument();

    //     }, { interval: 3000, timeout: 3000 });
    //     expect(screen.getByText('Approvers Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();
    // });

//----------------For this TEST CASE-2 in aschedule.jsx comment out "users" this api endpoint-------------//
    // test('renders approver details as loading and approver_s schedule table', async () => {
    //     service.get.mockResolvedValueOnce({ data: mockScheduleData })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //         role: 'SuperAdmin',
    //         token: 'abc@1',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();
    //     expect(screen.getByText('Approvers Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();

    //     await waitFor(() => {

    //         expect(screen.getByText('1')).toBeInTheDocument();
    //         expect(screen.queryByText('abcd')).not.toBeInTheDocument();
    //         expect(screen.getByText('aprvr1')).toBeInTheDocument();
    //         expect(screen.getByText('clctr1, clctr2')).toBeInTheDocument();
    //         expect(screen.getByText('plant1')).toBeInTheDocument();
    //         expect(screen.getByText('2025-04-05')).toBeInTheDocument();
    //         expect(screen.getByTestId('button')).toBeInTheDocument();

    //     }, { interval: 3000, timeout: 3000 });
    // });

    // test('displays error message', async () => {
    //     service.get.mockRejectedValueOnce(new Error('ApI Failure Error'));

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'test',
    //         role: 'SuperAdmin',
    //         token: 'abc@1',
    //     }));

    //     render(
    //         <Provider store={store}>
    //             <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();
    //     expect(screen.getByText('Approvers Schedule Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('Failed to fetch schedules. Try Again Later.')).toBeInTheDocument();
    //     }, { interval: 3000, timeout: 3000 });
    // });
})

//----------------------------METHOD 2-------------------------------//
describe('ASchedule Page', () => {
  
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: { approver_id: '1' },
        push: jest.fn(),
      });
  
      service.get.mockImplementation((url) => {
        if (url.startsWith('/apprschedulesid/')) {
          return Promise.resolve({
            data: [
              { id: 1, approver: { username: 'aprvr5' }, collectors: [{ username: 'clctr5' }, { username: 'clctr6' }], plant: { name: 'Plant A' }, visit_date: '2024-04-10' },
            ],
          });
        } else if (url.startsWith('/users/')) {
            return Promise.resolve({
                data: { id: 10, username: 'approver1', role: 'admin' },
            });
        }
      });
    });
  
    test('renders loading state, then schedule and user data', async () => {

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
            role: 'SuperAdmin',
            token: 'abc@1',
        }));
        
        render(
            <Provider store={store}>
                <ASchedule />
            </Provider>
        );
        expect(screen.getByText('Loading Approver Details...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Approver Details')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.queryByText('abcd')).not.toBeInTheDocument();
            expect(screen.getByText('approver1')).toBeInTheDocument();

            expect(screen.getByText('Approvers Schedule Table')).toBeInTheDocument();
            expect(screen.getByText('aprvr5')).toBeInTheDocument();
            expect(screen.getByText('clctr5, clctr6')).toBeInTheDocument();
            expect(screen.getByText('Plant A')).toBeInTheDocument();
            expect(screen.getByText('2024-04-10')).toBeInTheDocument();
        }, { interval: 3000, timeout: 3000 });
    });
});  