import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';
import { useEffect, useState } from 'react';
import { createBooking, deleteBooking, getAirports, getBookings } from './services/api';

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

                setBookings(bookingsResponse.list.toReversed());
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

    const handleBookingFormSubmit = async (formData) => {
        try {
            const parsedData = {
                ...formData,
                departureAirportId: Number(formData.departureAirportId),
                arrivalAirportId: Number(formData.arrivalAirportId),
            }
            const newBooking = await createBooking(parsedData);
            setBookings(prevBookings => [newBooking, ...prevBookings]);
            alert('You sucessfully created a booking!');

        } catch (error) {
            console.error("Failed to create new booking:", error);
            alert('Could not create booking.');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        try {
            await deleteBooking(bookingId);
            setBookings(prevBookings => prevBookings.filter(x => x.id !== bookingId));
            alert(`Booking ${bookingId} deleted.`);
        } catch (error) {
            console.error('Failed to delete booking:', error);
            alert('Could not delete booking.');
        }
    };

    return (
        <>
            {/* Holds background image */}
            <div className="bg-hero"></div>

            <header className='page-header'>
                <div className="hero-content">
                    <h1>Your Next Journey Awaits</h1>
                    <p>Where will your passion take you?</p>
                </div>
            </header>

            <main className='main-content'>
                <BookingForm
                    airports={airports}
                    onBookingFormSubmit={handleBookingFormSubmit}
                />
                <BookingList
                    bookings={bookings}
                    isLoading={isLoading}
                    error={error}
                    getAirportCodeById={getAirportCodeById}
                    onBookingDelete={handleDeleteBooking}
                />
            </main>
        </>
    )
}

export default App;