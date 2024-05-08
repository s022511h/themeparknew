const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/auth.js');


router.post('/order-ticket', checkAuthenticated, async (req, res) => {
    const { date } = req.body;
    res.redirect('/dashboard');
});

router.get('/tickets', checkAuthenticated, async (req, res) => {
    
});

module.exports = router;
