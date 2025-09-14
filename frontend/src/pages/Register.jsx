// src/pages/Register.js
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', form);
            alert('Registered. Now login.');
            navigate('/login');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{ maxWidth: 420 }}>
            <h3 style={{marginTop:'90px'}}>Register</h3>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
                <input style={{ marginTop: '20px' }} name="name" placeholder="Name" value={form.name} onChange={onChange} required />
                <input style={{ marginTop: '20px' }} name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
                <input style={{ marginTop: '20px' }} name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
                <button style={{ marginTop: '20px' }} type="submit">Register</button>
            </form>
        </div>
    );
}
