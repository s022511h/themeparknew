const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Ride = require('../models/Ride');
const Ticket = require('../models/Ticket');
const { checkAuthenticated } = require('../middleware/auth');

router.get('/login', (req, res) => res.render('login', { error: req.flash('error'), success: req.flash('success') }));
router.get('/register', (req, res) => res.render('register', { error: req.flash('error') }));
router.get('/dashboard', checkAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId);
    const rides = await Ride.find({});
    res.render('dashboard', { email: user.email, rides: rides, ticketPrice: 20 });
});

router.post('/register', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        req.flash('error', 'Email already in use.');
        return res.redirect('/register');
    }
    const newUser = new User({ email: req.body.email, password: await bcrypt.hash(req.body.password, 10) });
    await newUser.save();
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }
    req.session.userId = user._id;
    res.redirect('/dashboard');
});

router.post('/cart/add', async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            res.status(404).json({ error: 'Ride not found' });
            return;
        }
        if (!req.session.cart) req.session.cart = [];
        req.session.cart.push({ id: ride._id, name: ride.name, price: ride.fastTrackPrice });
        res.json({ cart: req.session.cart });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Example for adding a ticket
router.post('/tickets/add', async (req, res) => {
    const { date } = req.body;
    try {
        const newTicket = new Ticket({ userId: req.session.userId, date: new Date(date), basePrice: 20 });
        await newTicket.save();
        res.json({ message: "Ticket added successfully", ticket: newTicket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add ticket' });
    }
});

router.get('/cart/checkout', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('User not logged in');
    const newTicket = new Ticket({ userId: req.session.userId, date: new Date(), rides: req.session.cart.map(item => item.id) });
    await newTicket.save();
    req.session.cart = [];
    res.send('Checkout successful');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            req.flash('error', 'Failed to log out.');
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    });
});

module.exports = router;
