import Spinner from '../Spinner/Spinner';
import './BookingListItem.scss';

export default function BookingListItem({
    booking,
    getAirportCodeById,
    onBookingDelete,
    onViewBooking,
    isDeletingId
}) {
    const handleDeleteBooking = (e) => {
        e.stopPropagation();
        onBookingDelete(booking.id);
    };

    const isDeleting = isDeletingId === booking.id;
    
    return (
        <div className="booking-list-item" onClick={() => onViewBooking(booking)}>
            <div className="booking-details">
                <p className="passenger-name">{booking.firstName} {booking.lastName}</p>
                <p className="flight-info">
                    {getAirportCodeById(booking.departureAirportId)} &rarr; {getAirportCodeById(booking.arrivalAirportId)}
                </p>
            </div>
            <div className="booking-actions">
                <button className="delete-button" onClick={handleDeleteBooking} disabled={isDeleting}>
                    {isDeleting ? <Spinner/> : 'Delete'}
                    </button>
            </div>
        </div>
    );
};