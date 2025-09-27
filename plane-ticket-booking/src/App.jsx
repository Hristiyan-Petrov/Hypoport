import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';

const MOCK_BOOKINGS = [
  { id: 1, firstName: 'John', lastName: 'Doe', departureAirport: 'JFK', destinationAirport: 'LAX' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', departureAirport: 'LHR', destinationAirport: 'CDG' },
  { id: 3, firstName: 'Peter', lastName: 'Jones', departureAirport: 'SFO', destinationAirport: 'MIA' },
];

function App() {
    return (
        <>
            <header className='hero-header'>
                <div className="hero-content">
                <h1>Your Next Journey Awaits</h1>
                <p>Where will your passion take you?</p>
                </div>
            </header>

            <main className='main-content'>
                <BookingForm />
                <BookingList bookings={MOCK_BOOKINGS}/>
            </main>
        </>
    )
}

export default App;