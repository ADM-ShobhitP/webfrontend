import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Userbyid from "../src/pages/user/[uid]";
import Layout from "../src/components/Layout";
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, {login} from '../redux/AuthSlice';
import Router, { useRouter } from "next/router";
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock("../src/components/Layout", () => ({ children }) => <div data-testid="layout">{children}</div>);

jest.mock('../service_axios', () => ({
    get: jest.fn()
}));


describe('UserById Page', () => {
    
    const mockUser = { id: 1, username: 'mockUser1', role: 'mockRole' };

    test('renders user details', () => {
        
        const store = configureStore({
            reducer: { authReducer },
        });
    
        store.dispatch(login({
            user: 'test',
        }));
    
        render(
            <Provider store={store}>
                <Layout>
                    <Userbyid user={mockUser} />
                </Layout>
            </Provider>
        );
        expect(screen.getByText('User Details')).toBeInTheDocument();
        expect(screen.getByText('User: mockUser1')).toBeInTheDocument();
        expect(screen.getByText('Role: mockRole')).toBeInTheDocument();
        expect(screen.getByText('Id: 1')).toBeInTheDocument();
    });
});