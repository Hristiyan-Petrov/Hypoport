import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';
import { useEffect, useState } from 'react';
import { getAirports, getBookings } from './services/api';

const MOCK_BOOKINGS = [
    { id: 1, firstName: 'John', lastName: 'Doe', departureAirport: 'JFK', destinationAirport: 'LAX' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', departureAirport: 'LHR', destinationAirport: 'CDG' },
    { id: 3, firstName: 'Peter', lastName: 'Jones', departureAirport: 'SFO', destinationAirport: 'MIA' },
];

function App() {
    const [bookings, setBookings] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const bookingsResponse = await getBookings(0);
                const airportsResponse = await getAirports();

                setBookings(bookingsResponse.list);
                setAirports(airportsResponse);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                console.error(error);
                setError('Could not load data from the server.')
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const getAirportCodeById = (id) => {
        const airport = airports.find(x => x.id === id);
        return airport ? airport.code : 'N/A';
    };

    return (
        <>
            <header className='hero-header'>
                <div className="hero-content">
                    <h1>Your Next Journey Awaits</h1>
                    <p>Where will your passion take you?</p>
                </div>
            </header>

            <main className='main-content'>
                <BookingForm />
                <BookingList
                    bookings={bookings}
                    isLoading={isLoading}
                    error={error}
                    getAirportCodeById={getAirportCodeById}
                />
            </main>
        </>
    )
}

export default App;