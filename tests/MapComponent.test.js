import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import MapComponent from "../src/components/MapComponent";
import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow } from "@react-google-maps/api";

jest.mock('@react-google-maps/api', () => {
    const React = require('react');
    return {
        LoadScript: ({children}) => <div data-testid="load-script">{children}</div>,
        GoogleMap: ({children}) => <div data-testid="google-map">{children}</div>,
        Marker: ({ onClick }) => (<div data-testid="marker" onClick={onClick}>Marker</div>),
        Polygon: () => <div data-testid="polygon">Polygon</div>,
        InfoWindow: ({ children, onCloseClick }) => (
            <div data-testid="info-window">
                {children}
                <button onClick={onCloseClick}>Close</button>
            </div>
        ),
    };
});


describe ('Map Component', () => {
    const mockLocation = { lat: 37.7749, lng: -122.4194 };
    const mockPolygon = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7750, lng: -122.4195 },
      { lat: 37.7751, lng: -122.4196 },
    ];

    test('redners map with polygon', async () => {
        render(<MapComponent location={mockLocation} polygonBoundary={mockPolygon} />);

        expect(screen.getByTestId('load-script')).toBeInTheDocument();
        expect(screen.getByTestId('google-map')).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('marker'));
        expect(screen.getByTestId('info-window')).toBeInTheDocument();
        expect(screen.getByTestId('polygon')).toHaveTextContent('Polygon');
        await userEvent.click(screen.getByText('Close'));
    })
})
