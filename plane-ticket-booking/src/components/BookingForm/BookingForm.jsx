import './BookingForm.scss';

export default function BookingForm() {
    return (
        <section className="booking-form-container">
            <h2>Book a Flight</h2>

            <form action="/" id='booking' className='booking-form'>
                {/* First name */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id='firstName' name='firstName' />
                    </div>
                {/* Last name */}
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id='lastName' name='lastName' />
                    </div>
                </div>
                {/* Departure Airport */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departureAirportId">Departure Airport</label>
                        <input type="text" id='departureAirportId' name='departureAirportId' />
                    </div>
                {/* Arrival Airport */}
                    <div className="form-group">
                        <label htmlFor="arrivalAirportId">Arrival Airport</label>
                        <input type="text" id='arrivalAirportId' name='arrivalAirportId' />
                    </div>
                </div>
                {/* Date of departure */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departureDate">Departure Date</label>
                        <input type="date" id='departureDate' name='departureDate' />
                    </div>
                {/* Date of return */}
                    <div className="form-group">
                        <label htmlFor="returnDate">Return Date</label>
                        <input type="date" id='returnDate' name='returnDate' />
                    </div>
                </div>

                <button type='submit' className="submit-form-button">
                    Book Ticket
                </button>
            </form>
        </section>
    );
};