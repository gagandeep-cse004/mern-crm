// src/pages/Login.js
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{ maxWidth: 420 }}>
            <h3 style={{marginTop:'100px'}}>Login</h3>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
                <input style={{marginTop:'20px'}} name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
                <input style={{ marginTop: '20px' }} name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
                <button style={{ marginTop: '20px' }} type="submit">Login</button>
            </form>
        </div>
    );
}
