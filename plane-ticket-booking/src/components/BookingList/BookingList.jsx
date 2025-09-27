import BookingListItem from '../BookingListItem/BookingListItem';
import './BookingList.scss';

export default function BookingList({
    bookings,
    isLoading,
    error,
    getAirportCodeById
}) {
    return (
        <section className="booking-list-container">
            <h2>Existing Bookings</h2>

            {isLoading && <p>Loading bookings...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && bookings && bookings.length > 0
                ? (
                    <div className="booking-list-items">
                        {bookings.map(booking => (
                            <BookingListItem
                                key={booking.id}
                                booking={booking}
                                getAirportCodeById={getAirportCodeById}
                            />
                        ))}
                    </div>
                )
                : (
                    !isLoading && !error && <p>There are no bookings.</p>
                )
            }
        </section>
    );
};