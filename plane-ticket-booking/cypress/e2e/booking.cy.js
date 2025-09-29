describe("Plane Ticket Booking App", () => {
  const token = Cypress.env("AUTH_TOKEN");

  beforeEach(() => {
    // Intercept airports
    cy.intercept(
      "GET",
      `/airports?authToken=${token}`,
      { fixture: "airports.json" }   // mock to avoid hitting real API
    ).as("getAirports");

    // Visit your frontend (not API!)
    cy.visit("http://localhost:5173"); // dev server
  });

  it("loads airports and shows them in dropdowns", () => {
    cy.wait("@getAirports");
    cy.get("[name=departureAirportId]").should("exist");
    cy.get("[name=arrivalAirportId]").should("exist");
  });

  it("submits a booking", () => {
    cy.intercept(
      "POST",
      `/bookings/create?authToken=${token}`,
      { statusCode: 201, body: { success: true, bookingId: "12345" } }
    ).as("createBooking");

    cy.wait("@getAirports");

    // Fill the form
    cy.get("[name=firstName]").type("John");
    cy.get("[name=lastName]").type("Doe");
    cy.get("[name=departureAirportId]").select("SOF");
    cy.get("[name=arrivalAirportId]").select("JFK");
    cy.get("[name=departureDate]").type("2025-12-01");

    cy.get("form").submit();

    cy.wait("@createBooking").its("response.statusCode").should("eq", 201);
  });

  it("lists bookings", () => {
    cy.intercept(
      "GET",
      `/bookings?pageIndex=1&authToken=${token}`,
      { fixture: "bookings.json" }
    ).as("getBookings");

    // Navigate to bookings page
    cy.get("a[href='/bookings']").click();

    cy.wait("@getBookings");
    cy.get(".booking-row").should("have.length.greaterThan", 0);
  });
});
