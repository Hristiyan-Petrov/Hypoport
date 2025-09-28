import { useCallback, useEffect, useState } from "react";
import { createBooking, deleteBooking, getAirports, getBookings } from "../services/api";

const PAGE_SIZE = 5;

export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pageIndex, setPageIndex] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [isFetchingMoreBookings, setIsFetchingMoreBookings] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Data fetcher
    useEffect(() => {
        let isActive = true; // Flag to track if the component is still interested in this fetch

        const fetchData = async () => {
            if (isInitialLoad) setIsLoading(true);
            else setIsFetchingMoreBookings(true);

            try {
                const bookingsResponse = await getBookings(pageIndex);

                if (isActive) {

                    if (isInitialLoad) {
                        const airportsResponse = await getAirports();
                        setAirports(airportsResponse);
                    }

                    setBookings(prev => pageIndex === 0 ? bookingsResponse.list : [...prev, ...bookingsResponse.list]);
                    setTotalBookings(Number(bookingsResponse.totalCount));

                    setError(null);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                if (isActive) {
                    setError('Could not load data from the server.')
                }
            } finally {
                if (isActive) {
                    if (isInitialLoad) setIsLoading(false);
                    else setIsFetchingMoreBookings(false);
                    setIsInitialLoad(false);
                }
            }
        };

        fetchData();

        return () => {
            isActive = false;
        }
    }, [pageIndex]);


    // Update the function on dependency update
    const handleScroll = useCallback(async () => {
        const canFetchMore = !isLoading && !isFetchingMoreBookings && bookings.length < totalBookings;
        if (!canFetchMore) return;

        // Check if we are within 100px to the bottom of the page 
        // scrollTop - the already scrolled part
        // clientHeight - the visible part of the screen
        // scrollHeight - the total height of EVERYTHING visible and hidden up to the bottom of the visible screen area
        const isNearBottom = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 10;

        if (isNearBottom) {
            setPageIndex(prev => prev + 1);
        }
    }, [isLoading, isFetchingMoreBookings, bookings.length, totalBookings]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);




    const addBooking = async (formData) => {
        const newBooking = await createBooking(formData);
        alert('You sucessfully created a booking! You can find it at the bottom of the list.');
        setTotalBookings(prev => prev + 1);

        const currentCapacity = (pageIndex + 1) * PAGE_SIZE;
        if (bookings.length < currentCapacity) {
            setBookings(prev => [...prev, newBooking]);
        }
    };

    const removeBooking = async (bookingId) => {
        await deleteBooking(bookingId);
        const currentBookingCount = bookings.length - 1;
        setBookings(prevBookings => prevBookings.filter(x => x.id !== bookingId));
        const newTotal = totalBookings - 1;
        setTotalBookings(newTotal);

        if (currentBookingCount < newTotal) {
            const pageToFetch = Math.floor(currentBookingCount / PAGE_SIZE);
            const itemIndexOnPage = currentBookingCount % PAGE_SIZE;
            const response = await getBookings(pageToFetch);

            if (response.list.length > itemIndexOnPage) {
                const newItem = response.list[itemIndexOnPage];
                setBookings(prev => [...prev, newItem]);
            }
        }
        alert(`Booking ${bookingId} deleted.`);
    };


    // Helper functions
    const getAirportCodeById = (id) => {
        const airport = airports.find(x => x.id === id);
        return airport ? airport.code : 'N/A';
    };

    const getAirportTitleById = (id) => {
        const airport = airports.find(x => x.id === id);
        return airport ? airport.title : 'N/A';
    };

    return {
        bookings,
        airports,
        isLoading,
        error,
        totalBookings,
        isFetchingMoreBookings,
        addBooking,
        removeBooking,
        getAirportCodeById,
        getAirportTitleById,
    };

};