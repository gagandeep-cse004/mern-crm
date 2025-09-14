// routes/customers.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

// GET all customers for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const list = await Customer.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create (owner = logged user)
router.post('/', auth, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name) return res.status(400).json({ error: 'Name required' });
        const c = new Customer({ user: req.user.id, name, email, phone });
        const saved = await c.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single (owner only)
router.get('/:id', auth, async (req, res) => {
    try {
        const c = await Customer.findById(req.params.id);
        if (!c) return res.status(404).json({ error: 'Customer not found' });
        if (c.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
        res.json(c);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update (owner only)
router.put('/:id', auth, async (req, res) => {
    try {
        const c = await Customer.findById(req.params.id);
        if (!c) return res.status(404).json({ error: 'Customer not found' });
        if (c.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        c.name = req.body.name ?? c.name;
        c.email = req.body.email ?? c.email;
        c.phone = req.body.phone ?? c.phone;

        const updated = await c.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE (owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const c = await Customer.findById(req.params.id);
        if (!c) return res.status(404).json({ error: 'Customer not found' });
        if (c.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        await Customer.findByIdAndDelete(req.params.id); // ✅ modern way
        res.json({ success: true, message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
