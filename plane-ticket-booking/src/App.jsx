import './styles/index.scss';
import BookingForm from './components/BookingForm/BookingForm'
import BookingList from './components/BookingList/BookingList';

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
                <BookingList />
            </main>
        </>
    )
}

export default App;