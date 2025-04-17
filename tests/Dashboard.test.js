import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Dashboard from "../src/pages/dashboard";
import Layout from "../src/components/Layout";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import axios from "axios";
import authReducer, {login} from '../redux/AuthSlice';
import service from "../service_axios";
import { Provider } from "react-redux";

jest.mock('@superset-ui/embedded-sdk', () => ({
    embedDashboard: jest.fn()
}));

jest.mock("../src/components/Layout", () => ({ children }) => <div data-testid="layout">{children}</div>);

jest.mock("axios");

jest.mock("../service_axios", () => ({
    post: jest.fn()
}));


describe("Dashboard Page", () => {

    service.post.mockResolvedValue({ data: { access_token: 'mock-access-token' } })

    axios.post.mockResolvedValue({ data: { access_token: 'mock-guest-token' } })

    service.post.mockResolvedValue({ data: { access_token: 'mock-access-token' } })


    test("renders Dashboard page and calls embed Dashboard for apache superset", async () => {

        const store = configureStore({
            reducer: { authReducer },
        })
        
        store.dispatch(login({
            user: 'test',
        }))

        render (
            <Provider store={store}>
                <Layout>
                    <Dashboard />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Dashboard')).toBeInTheDocument();

        await waitFor(() => {
            expect(embedDashboard).toHaveBeenCalledTimes(1);
        })

    })
})
    