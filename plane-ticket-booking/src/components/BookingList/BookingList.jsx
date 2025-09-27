import BookingListItem from '../BookingListItem/BookingListItem';
import './BookingList.scss';

export default function BookingList({
    bookings
}) {
    console.log(bookings);

    return (
        <section className="booking-list-container">
            <h2>Existing Bookings</h2>

            {bookings
                ? (
                    <div className="booking-list-items">
                        {bookings.map(booking  => (
                            <BookingListItem id={booking.id} booking={booking} />
                        ))}
                    </div>

                )
                : (
                    <p>There are no bookings.</p>
                )
            }
        </section>
    );
};