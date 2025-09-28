import BookingListItem from '../BookingListItem/BookingListItem';
import './BookingList.scss';

export default function BookingList({
    bookings,
    isLoading,
    error,
    getAirportCodeById,
    onBookingDelete,
    onViewBooking,
    totalBookings
}) {
    return (
        <section className="booking-list-container">
            <div className="booking-list-header">
                <h2>Current Bookings Showed: {bookings.length}</h2>
                <div className="page-size-selector">
                    <div className="total-bookings">Total bookings: {totalBookings}</div>
                    {/* <label htmlFor="pageSize">Show:</label>
                    <select
                        id='pageSize'
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select> */}
                </div>
            </div>

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
                                onBookingDelete={onBookingDelete}
                                onViewBooking={onViewBooking}
                            />
                        ))}
                    </div>
                )
                : (
                    !isLoading && !error && <p>There are no bookings...</p>
                )
            }
        </section>
    );
};