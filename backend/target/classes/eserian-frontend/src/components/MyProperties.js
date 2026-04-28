import { useEffect, useState } from 'react';
import { propertyAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MyProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadMyProperties();
    }, []);

    const loadMyProperties = async () => {
        try {
            const res = await propertyAPI.getMyProperties();
            setProperties(res.data || []);
        } catch (err) {
            console.error('Error loading properties:', err);
            alert('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'APPROVED':
                return { color: '#27ae60', text: '✅ Approved' };
            case 'PENDING':
                return { color: '#f39c12', text: '⏳ Pending Approval' };
            case 'REJECTED':
                return { color: '#e74c3c', text: '❌ Rejected' };
            default:
                return { color: '#95a5a6', text: '📝 Draft' };
        }
    };

    if (loading) {
        return <div className="loading">Loading your properties...</div>;
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>📋 My Properties</h1>
                    <button onClick={() => navigate('/add-property')}>+ Add New Property</button>
                </div>

                {properties.length === 0 ? (
                    <div className="alert alert-info">
                        You haven't listed any properties yet.
                        <button onClick={() => navigate('/add-property')} style={{ marginLeft: '10px' }}>List Your First Property</button>
                    </div>
                ) : (
                    <div className="property-grid">
                        {properties.map(property => {
                            const status = getStatusBadge(property.status);
                            return (
                                <div key={property.id} className="property-card">
                                    <img
                                        src={property.imageUrl || 'https://via.placeholder.com/300'}
                                        alt={property.title}
                                        className="property-image"
                                    />
                                    <div className="property-info">
                                        <h3 className="property-title">{property.title}</h3>
                                        <p className="property-location">📍 {property.location}</p>
                                        <p>🛏️ {property.bedrooms} beds • 🚽 {property.bathrooms} baths</p>
                                        <p className="property-price">${property.pricePerNight}/night</p>
                                        <p style={{ color: status.color, fontWeight: 'bold', marginTop: '10px' }}>
                                            {status.text}
                                        </p>
                                        {property.status === 'REJECTED' && (
                                            <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                                                Please contact admin for details
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}