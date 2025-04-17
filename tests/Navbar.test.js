import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import Navbar from "../src/components/Navbar";
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import {store} from '../redux/Store'
import authReducer, { login } from '../redux/AuthSlice';
import { useRouter } from "next/router";

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/',
        push: jest.fn(),
    })
}))



// test('shows login button when not authenticated', () => {

//     const initialState = {
//         authReducer: { 
//             isAuthenticated: false,
//             role: null,
//         },
//     }
    
//     const store = configureStore({
//         reducer: { authReducer },
//         initialState,
//     })    


//     render (
//         <Provider store={store}>
//             <Navbar />
//         </Provider>
//     );

//     expect(screen.getByText('GeoLoc')).toBeInTheDocument();
//     expect(screen.getByText('Home')).toBeInTheDocument();

// })

// test('renders SuperAdmin links ', async () => {

    
//     const store = configureStore({
//         reducer: { authReducer },
//     })

//     store.dispatch(login({
//         user: 'test',
//         role: 'SuperAdmin',
//         token: 'abc123'
//     }))

//     render (
//         <Provider store={store}>
//             <Navbar />
//         </Provider>
//     );

//     expect(screen.getByText('GeoLoc')).toBeInTheDocument();
//     expect(screen.getByText('Home')).toBeInTheDocument();
//     expect(screen.getByText('Dashboard')).toBeInTheDocument();
//     expect(screen.getByText('Approver')).toBeInTheDocument();
//     expect(screen.getByText('Collector')).toBeInTheDocument();
//     expect(screen.getByText('Schedule')).toBeInTheDocument();
//     expect(screen.getByText('User')).toBeInTheDocument();
//     expect(screen.getByText('Prediction')).toBeInTheDocument();
//     // expect(screen.getByTestId('AccountCircle'));

//     // expect(screen.getByText('LogOut')).toBeInTheDocument();
// });

test('renders logout menu', async () => {

    
    const store = configureStore({
        reducer: { authReducer },
    })

    store.dispatch(login({
        user: 'test',
        role: 'SuperAdmin',
        token: 'abc123'
    }))

    render (
        <Provider store={store}>
            <Navbar />
        </Provider>
    );

    await userEvent.click(screen.getByTestId('logout-icon'))
    expect(screen.getByText('Logout'));

});