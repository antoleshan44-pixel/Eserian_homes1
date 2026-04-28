import { useState } from 'react';
import { propertyAPI } from '../services/api';

export default function PropertyForm() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        pricePerNight: '',
        bedrooms: '',
        bathrooms: '',
        imageUrl: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await propertyAPI.create(form);
            alert("Property submitted! Waiting for admin approval.");
            setForm({ title: '', description: '', location: '', pricePerNight: '',
                bedrooms: '', bathrooms: '', imageUrl: '' });
        } catch (err) {
            alert("Error: " + err.response?.data);
        }
    };

    return (
        <div>
            <h2>🏠 List Your Property</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                <input placeholder="Location (City)" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
                <input type="number" placeholder="Price per night ($)" value={form.pricePerNight} onChange={(e) => setForm({...form, pricePerNight: e.target.value})} required />
                <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => setForm({...form, bedrooms: e.target.value})} />
                <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => setForm({...form, bathrooms: e.target.value})} />
                <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} />
                <button type="submit">List Property</button>
            </form>
        </div>
    );
}