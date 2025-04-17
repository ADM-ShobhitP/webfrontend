import { render, screen } from '@testing-library/react'
import Layout from '../src/components/Layout'
import '@testing-library/jest-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import store, { persistor } from '../redux/Store'
import { PersistGate } from "redux-persist/integration/react";

import authReducer from '../redux/AuthSlice';

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/',
        push: jest.fn(),
    })
}))

jest.mock('../src/components/Navbar', () => () => <div data-testid='nav1'>Navbar Content</div>);

test('renders children and navbar when authenticated', () => {

    const initialState = {
        authReducer: {
            isAuthenticated: true,
        },
    }

    const store = configureStore({
        reducer: { authReducer },
        initialState,
    })

    render(
        <Provider store={store}>
            <Layout>
                <div data-testid='lay1'>Test Content</div>
            </Layout>
        </Provider>
    );
    expect(screen.getByTestId('lay1')).toHaveTextContent('Test Content');
    expect(screen.getByTestId('nav1')).toHaveTextContent('Navbar Content');
})
