// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchCustomers = async () => {
        try {
            const res = await API.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                // token invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/customers/${editingId}`, form);
                setEditingId(null);
            } else {
                await API.post('/customers', form);
            }
            setForm({ name: '', email: '', phone: '' });
            fetchCustomers();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const startEdit = (c) => {
        setEditingId(c._id);
        setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
    };

    const doDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await API.delete(`/customers/${id}`);
        fetchCustomers();
    };

    return (
        <div className="dashboard-container">
            <h3>Dashboard</h3>

            <form onSubmit={onSubmit} style={{ maxWidth: 480, display: 'grid', gap: 8, marginBottom: 16 }}>
                <input name="name" placeholder="Name" required value={form.name} onChange={onChange} />
                <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
                <div>
                    <button type="submit">{editingId ? 'Save changes' : 'Add Customer'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '' }); }} style={{ marginLeft: 8 }}>Cancel</button>}
                </div>
            </form>

            <h4>Customers ({customers.length})</h4>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {customers.map(c => (
                    <li key={c._id} style={{ padding: 10, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <strong>{c.name}</strong><br />
                            <small>{c.email || '—'} {c.phone ? ` • ${c.phone}` : ''}</small>
                        </div>
                        <div>
                            <button onClick={() => startEdit(c)}>Edit</button>
                            <button onClick={() => doDelete(c._id)} style={{ marginLeft: 8 }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
