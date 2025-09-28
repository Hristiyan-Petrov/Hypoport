import './Modal.scss';

export default function Modal({
    isOpen,
    onClose,
    selectedBooking,
    getAirportTitleById
}) {
    if (!isOpen || !selectedBooking) return null;

    const formatData = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Booking Details</h2>
                    <button className="modal-close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {selectedBooking && (
                    <div className="booking-modal-details">
                        <p><strong>Passenger</strong></p>
                        <span className='booking-data-field'>{selectedBooking.firstName} {selectedBooking.lastName}</span>
                        <p><strong>Departure</strong></p>
                        <span className='booking-data-field'>{getAirportTitleById(selectedBooking.departureAirportId)} on {formatData(selectedBooking.departureDate)}</span>
                        <p><strong>Arrival</strong></p>
                        <span className='booking-data-field'>{getAirportTitleById(selectedBooking.arrivalAirportId)} on {formatData(selectedBooking.returnDate)}</span>
                    </div>
                )}
            </div>
        </div>

    );
};