import './BookingListItem.scss';

export default function BookingListItem({
    id,
    booking
}) {
    console.log('Test')
    return (
        <div className="booking-list-item">
            <div className="booking-details">
                <p className="passenger-name">{booking.firstName} {booking.lastName}</p>
                <p className="flight-info">{booking.departureAirport} &rarr; {booking.destinationAirport}</p>
            </div>
            <div className="booking-actions">
                <button className="delete-button">Delete</button>
            </div>
        </div>
    );
};