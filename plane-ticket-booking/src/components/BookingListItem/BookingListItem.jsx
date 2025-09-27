import './BookingListItem.scss';

export default function BookingListItem({
    booking,
    getAirportCodeById,
    onBookingDelete
}) {
    const handleDeleteBooking = (e) => {
        e.stopPropagation();
        onBookingDelete(booking.id);
    }
    return (
        <div className="booking-list-item">
            <div className="booking-details">
                <p className="passenger-name">{booking.firstName} {booking.lastName}</p>
                <p className="flight-info">
                    {getAirportCodeById(booking.departureAirportId)} &rarr; {getAirportCodeById(booking.arrivalAirportId)}
                </p>
            </div>
            <div className="booking-actions">
                <button className="delete-button" onClick={handleDeleteBooking}>Delete</button>
            </div>
        </div>
    );
};