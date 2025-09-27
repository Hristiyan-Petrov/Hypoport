export const validateBookingForm = (formData) => {
    const errors = {};
    
    // Check if ll fields are filled
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.departureAirportId) errors.departureAirportId = 'Please select departure airport.';
    if (!formData.arrivalAirportId) errors.arrivalAirportId = 'Please select arrival airport.';
    if (!formData.departureDate) errors.departureDate = 'Please select departure date.';
    if (!formData.returnDate) errors.returnDate = 'Please select return date.';

    // Check if the dates are logical
    if (formData.departureDate && formData.returnDate) {
        const departureDate = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);

        if (returnDate <= departureDate) {
            errors.returnDate = "Return date cannot be the same or before the departure date.";
        }
    }

    // Check if the airports are different
    if (formData.departureAirportId && formData.arrivalAirportId) {

        if (formData.departureAirportId === formData.arrivalAirportId) {
            errors.arrivalAirportId = "Arrival airport cannot be the same as departure one.";
        }
    }

    return errors;
};