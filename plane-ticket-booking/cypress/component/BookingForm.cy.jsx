import BookingForm from '../../src/components/BookingForm/BookingForm'

describe('<BookingForm />', () => {
  const airports = [
    { id: 1, title: 'Sofia Airport', code: 'SOF' },
    { id: 2, title: 'Berlin Airport', code: 'BER' },
  ]

  it('renders all inputs', () => {
    cy.mount(<BookingForm airports={airports} onBookingFormSubmit={cy.stub()} isCreating={false} />)

    cy.get('input[name="firstName"]').should('exist')
    cy.get('input[name="lastName"]').should('exist')
    cy.get('select[name="departureAirportId"]').should('exist')
    cy.get('select[name="arrivalAirportId"]').should('exist')
    cy.get('input[name="departureDate"]').should('exist')
    cy.get('input[name="returnDate"]').should('exist')
    cy.get('button[type="submit"]').should('contain.text', 'Book Ticket')
  })

  it('shows error if submitting empty form', () => {
    const onSubmit = cy.stub()
    cy.mount(<BookingForm airports={airports} onBookingFormSubmit={onSubmit} isCreating={false} />)

    cy.get('button[type="submit"]').click()
    cy.get('.error-text').should('exist')
    cy.wrap(onSubmit).should('not.have.been.called')
  })

  it('submits correct data when form is valid', () => {
    const onSubmit = cy.stub()
    cy.mount(<BookingForm airports={airports} onBookingFormSubmit={onSubmit} isCreating={false} />)

    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('select[name="departureAirportId"]').select('1')
    cy.get('select[name="arrivalAirportId"]').select('2')
    cy.get('input[name="departureDate"]').type('2025-10-01')
    cy.get('input[name="returnDate"]').type('2025-10-10')

    cy.get('button[type="submit"]').click()

    cy.wrap(onSubmit).should('have.been.calledOnce')
    cy.wrap(onSubmit).its('firstCall.args.0').should('deep.include', {
      firstName: 'John',
      lastName: 'Doe',
      departureAirportId: '1',
      arrivalAirportId: '2',
      departureDate: '2025-10-01',
      returnDate: '2025-10-10',
    })
  })
})
