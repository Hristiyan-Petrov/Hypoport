import BookingListItem from '../../src/components/BookingListItem/BookingListItem'

describe('<BookingListItem />', () => {
  const booking = {
    id: 123,
    firstName: 'Alice',
    lastName: 'Smith',
    departureAirportId: 1,
    arrivalAirportId: 2,
  }

  const getAirportCodeById = (id) => (id === 1 ? 'SOF' : 'BER')

  it('renders passenger and flight info', () => {
    cy.mount(
      <BookingListItem
        booking={booking}
        getAirportCodeById={getAirportCodeById}
        onBookingDelete={cy.stub()}
        onViewBooking={cy.stub()}
        isDeletingId={false}
      />
    )

    cy.contains('Alice Smith').should('exist')
    cy.contains('SOF → BER').should('exist')
  })

  it('calls onViewBooking when clicked', () => {
    const onView = cy.stub().as('onView')
    cy.mount(
      <BookingListItem
        booking={booking}
        getAirportCodeById={getAirportCodeById}
        onBookingDelete={cy.stub()}
        onViewBooking={onView}
        isDeletingId={false}
      />
    )

    cy.get('.booking-list-item').click()
    cy.get('@onView').should('have.been.calledWith', booking)
  })

  it('calls onBookingDelete when delete button clicked', () => {
    const onDelete = cy.stub().as('onDelete')
    cy.mount(
      <BookingListItem
        booking={booking}
        getAirportCodeById={getAirportCodeById}
        onBookingDelete={onDelete}
        onViewBooking={cy.stub()}
        isDeletingId={false}
      />
    )

    cy.get('.delete-button').click()
    cy.get('@onDelete').should('have.been.calledWith', booking.id)
  })
})
