import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';
import { useState } from 'react';
import Modal from './components/Modal/Modal';
import { useModal } from './hooks/useModal';
import { useBookings } from './hooks/useBookings';
import Notification from './components/Notification/Notification';
import Spinner from './components/Spinner/Spinner';

function App() {

    const {
        bookings,
        airports,
        isLoading,
        error,
        isCreating,
        isDeletingId,
        totalBookings,
        isFetchingMoreBookings,
        addBooking,
        removeBooking,
        getAirportCodeById,
        getAirportTitleById,
    } = useBookings();

    const { isOpen: isModalOpen, openModal, closeModal } = useModal();
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [notification, setNotification] = useState({
        message: '',
        type: '',
        visible: false
    });

    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
    };

    const handleBookingFormSubmit = async (formData) => {
        try {
            const parsedData = {
                ...formData,
                departureAirportId: Number(formData.departureAirportId),
                arrivalAirportId: Number(formData.arrivalAirportId),
            }
            await addBooking(parsedData);
            showNotification('You sucessfully created a booking! You can find it at the bottom of the list.', 'success');
        } catch (error) {
            console.error("Failed to create new booking:", error);
            showNotification('Could not create booking.', 'error');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            await removeBooking(bookingId);
            showNotification(`Booking ${bookingId} deleted.`, 'success');
        } catch (error) {
            console.error('Failed to delete booking:', error);
            showNotification(`Could not delete booking.`, 'error');
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
            <Notification
                message={notification.message}
                type={notification.type}
                visible={notification.visible}
                onClose={() => setNotification({ ...notification, visible: false })}
            />
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
                    isCreating={isCreating}
                />
                <BookingList
                    bookings={bookings}
                    isLoading={isLoading}
                    error={error}
                    getAirportCodeById={getAirportCodeById}
                    onBookingDelete={handleDeleteBooking}
                    onViewBooking={handleOpenBookingModal}
                    totalBookings={totalBookings}
                    isDeletingId={isDeletingId}
                />
                {isFetchingMoreBookings &&
                    (
                        <div className="bookings-loader">
                            <p>Loading more bookings</p>
                            <Spinner />
                        </div>
                    )
                }
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