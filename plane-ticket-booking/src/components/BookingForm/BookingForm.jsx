import { useRef, useState } from 'react';
import './BookingForm.scss';
import { validateBookingForm } from '../../utils/validators';
import Spinner from '../Spinner/Spinner';

export default function BookingForm({
    airports,
    onBookingFormSubmit,
    isCreating
}) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        departureAirportId: '',
        arrivalAirportId: '',
        departureDate: '',
        returnDate: '',
    });
    const [errors, setErrors] = useState({});

    const departureDateRef = useRef(null);
    const arrivalDateRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateBookingForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        } else {
            onBookingFormSubmit(formData);
            setFormData({
                firstName: '',
                lastName: '',
                departureAirportId: '',
                arrivalAirportId: '',
                departureDate: '',
                returnDate: '',
            });
        }
    };

    return (
        <section className="booking-form-container">
            <h2>Book a Flight</h2>

            <form id='booking' className='booking-form' onSubmit={handleSubmit}>
                {/* First name */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id='firstName'
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName &&
                            <span className="error-text">{errors.firstName}</span>}
                    </div>
                    {/* Last name */}
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id='lastName'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName &&
                            <span className="error-text">{errors.lastName}</span>}
                    </div>
                </div>
                {/* Departure Airport */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departureAirportId">Departure Airport</label>
                        <select
                            id='departureAirportId'
                            name='departureAirportId'
                            value={formData.departureAirportId}
                            onChange={handleChange}
                        >
                            <option value='' disabled>Please select an airport</option>
                            {airports.map(x => (
                                <option key={x.id} value={x.id}>
                                    {x.title} ({x.code})
                                </option>
                            ))}
                        </select>
                        {errors.departureAirportId &&
                            <span className="error-text">{errors.departureAirportId}</span>}
                    </div>
                    {/* Arrival Airport */}
                    <div className="form-group">
                        <label htmlFor="arrivalAirportId">Arrival Airport</label>
                        <select
                            id='arrivalAirportId'
                            name='arrivalAirportId'
                            value={formData.arrivalAirportId}
                            onChange={handleChange}
                        >
                            <option value='' disabled>Please select an airport</option>
                            {airports.map(x => (
                                <option key={x.id} value={x.id}>
                                    {x.title} ({x.code})
                                </option>
                            ))}
                        </select>
                        {errors.arrivalAirportId &&
                            <span className="error-text">{errors.arrivalAirportId}</span>}
                    </div>
                </div>
                {/* Date of departure */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departureDate">Departure Date</label>
                        <input
                            type="date"
                            id='departureDate'
                            name='departureDate'
                            value={formData.departureDate}
                            onChange={handleChange}
                            ref={departureDateRef}
                            onClick={() => departureDateRef.current.focus()}
                        />
                        {errors.departureDate &&
                            <span className="error-text">{errors.departureDate}</span>}
                    </div>
                    {/* Date of return */}
                    <div className="form-group">
                        <label htmlFor="returnDate">Return Date</label>
                        <input
                            type="date"
                            id='returnDate'
                            name='returnDate'
                            value={formData.returnDate}
                            onChange={handleChange}
                            ref={arrivalDateRef}
                            onClick={() => arrivalDateRef.current.focus()}
                        />
                        {errors.returnDate &&
                            <span className="error-text">{errors.returnDate}</span>}
                    </div>
                </div>

                <button type='submit' className="submit-form-button" disabled={isCreating}>
                    {isCreating ? <Spinner /> : 'Book Ticket'}
                </button>
            </form>
        </section>
    );
};