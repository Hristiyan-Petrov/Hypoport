// cypress/e2e/booking_flow.cy.js

describe('Booking Application Tests', () => {

  // This beforeEach hook runs before EACH test.
  // It sets up the initial state by mocking the API calls.
  beforeEach(() => {
    // Set up the intercepts BEFORE visiting the page.
    cy.intercept('GET', '**/api/airports', { fixture: 'airports.json' }).as('getAirports');
    cy.intercept('GET', '**/api/bookings?pageIndex=0', { fixture: 'bookings_page1.json' }).as('getBookings');

    // Visit the page. This will trigger the API calls.
    cy.visit('/');
  });

  // --- TEST 1: The most robust test for page load. ---
  it('should show a loading state and then display the initial list of bookings', () => {
    cy.log('Verifying the full loading sequence...');

    // 1. First, we can assert that the initial loading message is visible.
    cy.contains('Loading bookings...').should('be.visible');

    // 2. NOW, we wait for the mocked network calls to be "completed" by Cypress.
    cy.wait(['@getBookings', '@getAirports']);

    // 3. After waiting, the loading message should have disappeared.
    cy.contains('Loading bookings...').should('not.exist');

    // 4. Now we can safely assert that the final UI is correct.
    cy.get('[data-cy="total-bookings-count"]').should('contain.text', 'Total bookings: 2');
    cy.get('[data-cy="booking-list"]').children().should('have.length', 2);
    cy.get('[data-cy="booking-item-101"]').should('contain.text', 'John Doe');
  });


  // --- TEST 2: A focused test for creating a booking. ---
  it('should allow a user to create a new booking', () => {
    cy.log('Testing the booking creation flow...');

    // First, ensure the initial state is loaded before we try to interact with it.
    cy.wait(['@getBookings', '@getAirports']);
    cy.contains('Loading bookings...').should('not.exist');


    const newBookingData = {
      id: 999,
      firstName: 'Cypress',
      lastName: 'Tester',
    };

    cy.intercept('POST', '**/api/bookings/create', {
      statusCode: 201,
      body: { ...newBookingData, id: 999, departureAirportId: 1, arrivalAirportId: 3 },
    }).as('createBooking');

    cy.on('window:alert', (text) => {
      expect(text).to.match(/sucessfully created a booking/);
    });

    cy.get('[data-cy="firstName-input"]').type(newBookingData.firstName);
    cy.get('[data-cy="lastName-input"]').type(newBookingData.lastName);
    cy.get('[data-cy="departure-select"]').select('John F. Kennedy International Airport (JFK)');
    cy.get('[data-cy="arrival-select"]').select('Haneda Airport (HND)');
    cy.get('#departureDate').type('2026-01-15');
    cy.get('#returnDate').type('2026-01-22');

    cy.get('[data-cy="submit-booking"]').click();
    cy.wait('@createBooking');

    cy.get('[data-cy="total-bookings-count"]').should('contain.text', 'Total bookings: 3');
    cy.get('[data-cy="booking-list"]').children().should('have.length', 3);
    cy.get('[data-cy="booking-item-999"]').should('contain.text', 'Cypress Tester');
  });


  // --- TEST 3: A focused test for deleting a booking. ---
  it('should allow a user to delete a booking', () => {
    cy.log('Testing the booking deletion flow...');

    // Ensure the initial state is loaded.
    cy.wait(['@getBookings', '@getAirports']);
    cy.contains('Loading bookings...').should('not.exist');

    const bookingIdToDelete = 101;

    cy.intercept('DELETE', `**/api/bookings/${bookingIdToDelete}/delete`, { statusCode: 200 }).as('deleteBooking');
    // After deletion, the app tries to fetch the "fill-in" booking. This is at index 1 now.
    cy.intercept('GET', '**/api/bookings?pageIndex=0', { 
        list: [{ id: 102, firstName: 'Jane', lastName: 'Smith' }], 
        totalCount: "1" 
    }).as('refillBooking');


    cy.on('window:confirm', () => true);
    cy.on('window:alert', (text) => {
      expect(text).to.contains(`Booking ${bookingIdToDelete} deleted.`);
    });

    cy.get(`[data-cy="booking-item-${bookingIdToDelete}"]`)
      .find('[data-cy="delete-button"]')
      .click();

    cy.wait('@deleteBooking');

    cy.get('[data-cy="total-bookings-count"]').should('contain.text', 'Total bookings: 1');
    cy.get(`[data-cy="booking-item-${bookingIdToDelete}"]`).should('not.exist');
    cy.get('[data-cy="booking-list"]').children().should('have.length', 1);
  });

});