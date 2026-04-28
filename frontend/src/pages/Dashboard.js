import { useEffect, useState } from 'react';
import { propertyAPI, bookingAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [properties, setProperties] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Get user role from token (decode JWT)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role || 'USER');
        } catch (e) {
            console.log('Could not decode token');
        }

        loadProperties();
        loadBookings();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const loadProperties = async () => {
        try {
            const res = await propertyAPI.getAllApproved();
            setProperties(res.data || []);
        } catch (err) {
            console.error('Error loading properties:', err);
        }
    };

    const loadBookings = async () => {
        try {
            const res = await bookingAPI.getMyBookings();
            setMyBookings(res.data || []);
        } catch (err) {
            console.error('Error loading bookings:', err);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await propertyAPI.search(searchTerm);
            setProperties(res.data || []);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const handleBook = async (propertyId) => {
        const checkIn = prompt("Check-in date (YYYY-MM-DD):");
        const checkOut = prompt("Check-out date (YYYY-MM-DD):");

        if (checkIn && checkOut) {
            try {
                await bookingAPI.create({ propertyId, checkInDate: checkIn, checkOutDate: checkOut });
                alert("Booking confirmed!");
                loadBookings();
            } catch (err) {
                alert("Booking failed: " + (err.response?.data || err.message));
            }
        }
    };

    return (
        <div>
            {/* Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
                <h1>🏠 Eserian Homes</h1>
                <div>
                    <span style={{ marginRight: '15px' }}>Role: {userRole}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Admin Panel - Only shows for ADMIN users */}
            {userRole === 'ADMIN' && (
                <div style={{ margin: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                    <h2>🔧 Admin Panel</h2>
                    <button onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>
                </div>
            )}

            {/* Owner Panel - Only shows for OWNER users */}
            {userRole === 'OWNER' && (
                <div style={{ margin: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
                    <h2>🏘️ Owner Panel</h2>
                    <button onClick={() => navigate('/add-property')}>+ List New Property</button>
                    <button onClick={() => navigate('/my-properties')} style={{ marginLeft: '10px' }}>📋 My Properties</button>
                </div>
            )}

            {/* Search Bar */}
            <div style={{ padding: '20px' }}>
                <input
                    placeholder="Search by city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleSearch}>🔍 Search</button>
                <button onClick={loadProperties} style={{ marginLeft: '10px' }}>Reset</button>
            </div>

            {/* Property Listings */}
            <h2 style={{ padding: '0 20px' }}>Available Properties</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
                {properties.map(property => (
                    <div key={property.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
                        <img src={property.imageUrl || 'https://via.placeholder.com/300'}
                             alt={property.title}
                             style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
                        <h3>{property.title}</h3>
                        <p>📍 {property.location}</p>
                        <p>🛏️ {property.bedrooms} beds • 🚽 {property.bathrooms} baths</p>
                        <h3 style={{ color: '#e74c3c' }}>${property.pricePerNight}/night</h3>
                        <button onClick={() => handleBook(property.id)} style={{ width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            📅 Book Now
                        </button>
                    </div>
                ))}
            </div>

            {/* My Bookings */}
            {myBookings.length > 0 && (
                <>
                    <h2 style={{ padding: '0 20px' }}>My Trips</h2>
                    <div style={{ padding: '20px' }}>
                        {myBookings.map(booking => (
                            <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                                <h3>{booking.property?.title}</h3>
                                <p>📅 {booking.checkInDate} to {booking.checkOutDate}</p>
                                <p>💰 Total: ${booking.totalPrice}</p>
                                <p>Status: {booking.status}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}