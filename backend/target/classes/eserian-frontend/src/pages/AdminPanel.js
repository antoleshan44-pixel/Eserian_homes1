import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const [pendingProperties, setPendingProperties] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Verify admin role
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role !== 'ADMIN') {
                navigate('/dashboard');
                return;
            }
        } catch (e) {
            navigate('/login');
            return;
        }

        loadPendingProperties();
        loadAllBookings();
    }, []);

    const loadPendingProperties = async () => {
        try {
            // You need to add this endpoint in your backend PropertyController
            const res = await API.get('/properties/pending');
            setPendingProperties(res.data || []);
        } catch (err) {
            console.error('Error loading pending properties:', err);
            // If endpoint doesn't exist yet, use demo data
            setPendingProperties([]);
        }
    };

    const loadAllBookings = async () => {
        try {
            const res = await API.get('/admin/bookings');
            setAllBookings(res.data || []);
        } catch (err) {
            console.error('Error loading bookings:', err);
            setAllBookings([]);
        }
    };

    const approveProperty = async (propertyId) => {
        try {
            await API.put(`/properties/${propertyId}/approve`);
            alert("Property approved!");
            loadPendingProperties();
        } catch (err) {
            alert("Error approving property: " + (err.response?.data || err.message));
        }
    };

    const rejectProperty = async (propertyId) => {
        try {
            await API.put(`/properties/${propertyId}/reject`);
            alert("Property rejected!");
            loadPendingProperties();
        } catch (err) {
            alert("Error rejecting property: " + (err.response?.data || err.message));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>👑 Admin Dashboard</h1>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '30px' }}>
                <h2>📊 Statistics</h2>
                <p>Pending Properties: {pendingProperties.length}</p>
                <p>Total Bookings: {allBookings.length}</p>
            </div>

            <h2>⏳ Pending Approvals</h2>
            {pendingProperties.length === 0 ? (
                <p>No pending properties to approve.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {pendingProperties.map(property => (
                        <div key={property.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
                            <h3>{property.title}</h3>
                            <p>📍 Location: {property.location}</p>
                            <p>💰 Price: ${property.pricePerNight}/night</p>
                            <p>👤 Owner: {property.owner?.email || 'Unknown'}</p>
                            <p>🛏️ {property.bedrooms} beds • 🚽 {property.bathrooms} baths</p>
                            <p>📝 {property.description}</p>
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => approveProperty(property.id)} style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    ✅ Approve
                                </button>
                                <button onClick={() => rejectProperty(property.id)} style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 style={{ marginTop: '40px' }}>📅 All Bookings</h2>
            {allBookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {allBookings.map(booking => (
                        <div key={booking.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                            <p><strong>{booking.property?.title}</strong> - Booked by: {booking.user?.email}</p>
                            <p>📅 {booking.checkInDate} to {booking.checkOutDate}</p>
                            <p>💰 Total: ${booking.totalPrice}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}