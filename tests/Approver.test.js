import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Approver from "../src/pages/approver";
import Layout from "../src/components/Layout";
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import { useRouter } from "next/router";
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock("../src/components/Layout", () => ({ children }) => <div data-testid="layout">{children}</div>);


jest.mock("next/router", () => ({
    useRouter: () => ({
        pathname: '/aschedule/',
        query: { approver_id: 1 },
        push: jest.fn()
    }),
}));

jest.mock('../service_axios', () => ({
    get: jest.fn()
}));

describe('Approvers Page', () => {

    const mockApprovers = [ 
        {id: 1, username: 'mockap1', role: 'Approver'},
        {id: 2, username: 'mockap2', role: 'Approver'},
        {id: 3, username: 'mockap3', role: 'Approver'},
    ];

    // test('Renders approver data', async () => {
        
    //     service.get.mockResolvedValueOnce({ data: mockApprovers });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })
        
    //     store.dispatch(login({
    //         user: 'test',
    //     }))
    
    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Approver />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Approver Table')).toBeInTheDocument();
    //     expect(screen.getByText('Loading...')).toBeInTheDocument();

    //     await waitFor(() => {
    //         expect(screen.getByText('mockap1')).toBeInTheDocument();
    //         expect(screen.getByText('mockap2')).toBeInTheDocument();
    //         expect(screen.getByText('mockap3')).toBeInTheDocument();
    //         userEvent.click(screen.getByTestId('button'))
    //     })
    // })


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
                    <Approver />
                </Layout>
            </Provider>
        );
    
        expect(screen.getByText('Approver Table')).toBeInTheDocument();
    
        // Wait for the error to appear in the DOM
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch approvers. Try Again Later');
        });
    });    
})

