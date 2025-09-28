import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';
import { use, useCallback, useEffect, useState } from 'react';
import { createBooking, deleteBooking, getAirports, getBookings } from './services/api';
import Modal from './components/Modal/Modal';

function App() {
    const [bookings, setBookings] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [nextPageToFetch, setNextPageToFetch] = useState(null);
    const PAGE_SIZE = 5;
    const [isFetchingMoreBookings, setIsFetchingMoreBookings] = useState(false);

    // Initial data load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const discoveryResponse = await getBookings(0, 1);
                const totalCount = Number(discoveryResponse.totalCount);

                const airportsResponse = await getAirports();
                setAirports(airportsResponse);

                if (totalCount > 0) {
                    const lastPage = Math.ceil(totalCount / PAGE_SIZE) - 1;
                    const lastPageResponse = await getBookings(lastPage);
                    setBookings(lastPageResponse.list.toReversed());
                    setNextPageToFetch(lastPage - 1);
                } else {
                    setBookings([]);
                }
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

    // Update the function on dependency update
    const handleScroll = useCallback(async () => {
        const canFetchMore = !isFetchingMoreBookings && nextPageToFetch >= 0;
        if (!canFetchMore) return;

        // Check if we are within 100px to the bottom of the page 
        // scrollTop - the already scrolled part
        // clientHeight - the visible part of the screen
        // scrollHeight - the total height of EVERYTHING visible and hidden up to the bottom of the visible screen area
        const isNearBottom = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;

        if (isNearBottom) {
            setIsFetchingMoreBookings(true);

            try {
                const bookingsResponse = await getBookings(nextPageToFetch);
                setBookings(prevBookings => [...prevBookings, ...bookingsResponse.list.toReversed()]);
                setNextPageToFetch(currPage => currPage - 1);
                console.log('Fetched more');
            } catch (error) {
                console.error("Failed to fetch more bookings:", error);
            } finally {
                setIsFetchingMoreBookings(false);
            }
        }
    }, [isFetchingMoreBookings, nextPageToFetch, bookings]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const getAirportCodeById = (id) => {
        const airport = airports.find(x => x.id === id);
        return airport ? airport.code : 'N/A';
    };

    const getAirportTitleById = (id) => {
        const airport = airports.find(x => x.id === id);
        return airport ? airport.title : 'N/A';
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

    const handleOpenBookingModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
        setIsModalOpen(false);
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
                    onViewBooking={handleOpenBookingModal}
                />
                {isFetchingMoreBookings && <p className='bookings-loader'>Loading more bookings...</p>}
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedBooking={selectedBooking}
                getAirportTitleById={getAirportTitleById}
            />
        </>
    )
}

export default App;