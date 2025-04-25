import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Search from "../src/pages/search";
import Layout from '../src/components/Layout';
import { configureStore } from "@reduxjs/toolkit";
import store from "../redux/Store";
import authReducer, { login } from '../redux/AuthSlice';
import { useRouter } from "next/router";
import Image from "next/image";
import service from "../service_axios";
import { Provider } from "react-redux";
import { Layout as ElasticLayout } from "@elastic/react-search-ui-views";
import { __esModule } from "redux-persist/lib/storage";

jest.mock('../src/components/Layout', () => ({children}) => <div data-testid='layout'>{children}</div>);

const mockPush = jest.fn();
jest.mock('next/router', () => ({
    useRouter: () => ({
        query: { schedule_data: '1' },
        push: mockPush,
    }),
}));

jest.mock('@elastic/react-search-ui-views', () => ({
    __esModule: true,
    default: ({ header, sideContent, bodyContent, bodyHeader, bodyFooter }) => (
        <div data-testid='searchprovider'>
            <div data-testid='header'>{header}</div>
            <div data-testid='sideContent'>{sideContent}</div>
            <div data-testid='bodyContent'>{bodyContent}</div>
            <div data-testid='bodyHeader'>{bodyHeader}</div>
            <div data-testid='bodyFooter'>{bodyFooter}</div>
        </div>
    ),
}));

describe('Entire Search UI Page', () => {
    
    const mockSearchData = [
        {
            id: { raw: '25' }, 
            visit_date: { raw: '2025-04-01'},
            approvers: { raw: { username: 'aprvr1' } } , 
            collectors: { raw: [{ username: 'clctr1' }, { username: 'clctr2' }] } , 
            plant: { raw: { name: 'Plant A' } },
            details: { raw: [{ name_client: 'Name client' }] },
        },
    ];

    test('renders search result with expected fields', async () => {

        // service.get.mockResolvedValueOnce({ data: mockSearchData });

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'test',
        }));

        render(
            <Provider store={store}>
                <Search />
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('searchprovider')).toBeInTheDocument();
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByTestId('sideContent')).toBeInTheDocument();
            expect(screen.getByTestId('bodyContent')).toBeInTheDocument();
            expect(screen.getByTestId('bodyHeader')).toBeInTheDocument();
            expect(screen.getByTestId('bodyFooter')).toBeInTheDocument();

            // expect(screen.getByText('Visit Date:')).toBeInTheDocument();
        })
    })
})

//****************INCOMPLETE TEST CASE***********************