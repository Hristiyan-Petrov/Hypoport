import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';
import { useCallback, useEffect, useState } from 'react';
import { createBooking, deleteBooking, getAirports, getBookings } from './services/api';
import Modal from './components/Modal/Modal';
import { useModal } from './hooks/useModal';
import { useBookings } from './hooks/useBookings';

function App() {

    const {
        bookings,
        airports,
        isLoading,
        error,
        totalBookings,
        isFetchingMoreBookings,
        addBooking,
        removeBooking,
        getAirportCodeById,
        getAirportTitleById,
    } = useBookings();

    const { isOpen: isModalOpen, openModal, closeModal } = useModal();
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleBookingFormSubmit = async (formData) => {
        try {
            const parsedData = {
                ...formData,
                departureAirportId: Number(formData.departureAirportId),
                arrivalAirportId: Number(formData.arrivalAirportId),
            }
            await addBooking(parsedData);
        } catch (error) {
            console.error("Failed to create new booking:", error);
            alert('Could not create booking.');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            await removeBooking(bookingId);
        } catch (error) {
            console.error('Failed to delete booking:', error);
            alert('Could not delete booking.');
        }
    };

    const handleOpenBookingModal = (booking) => {
        setSelectedBooking(booking);
        openModal();
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
        closeModal();
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
                    totalBookings={totalBookings}
                />
                {isFetchingMoreBookings && <p className='bookings-loader'>Loading...</p>}
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