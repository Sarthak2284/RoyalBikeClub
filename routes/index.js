const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Bike = require('../models/Bike');
const Transaction = require('../models/Transaction');
const session = require('express-session');

// Middleware to check session user
const checkSession = (req, res, next) => {
    if (req.session.userName) {
        return next();
    }
    res.redirect('/login');
};

// Home page route
router.get('/', (req, res) => {
    res.render('index');
});

// Register page route
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user registration
router.post('/create-user', async (req, res) => {
    const { firstName, lastName, email, password, phone, age } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { errorMessage: 'User Already Exists. Please log in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, phone, age });
        await newUser.save();
        
        req.session.userName = firstName;
        res.redirect('/welcome');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { errorMessage: 'Wrong Email Or Password' });
    }

    req.session.userName = user.firstName;
    res.redirect('/welcome');
});

// Welcome page route
router.get('/welcome', checkSession, (req, res) => {
    const name = req.session.userName;
    res.render('welcome', { name });
});

// Shop page route
router.get('/shop', async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('shop', { bikes });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Rent page route
router.get('/rent', async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('rent', { bikes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Rent now route
router.get('/rent-now/:id', async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);
        if (!bike) {
            return res.status(404).render('error', { errorMessage: 'Bike not found' });
        }
        res.render('rent-details', { bike });
    } catch (err) {
        console.error('Error fetching bike details:', err);
        res.status(500).render('error', { errorMessage: 'Internal server error' });
    }
});


// Handle rental checkout
router.post('/rent-now/:id/checkout', async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);
        if (!bike) {
            return res.status(404).render('error', { errorMessage: 'Bike not found' });
        }

        const { days, totalPrice } = req.body;
        if (!days || isNaN(days) || !totalPrice) {
            return res.status(400).render('error', { errorMessage: 'Invalid rental details' });
        }

        const user = await User.findOne({ firstName: req.session.userName });
        if (!user) {
            return res.redirect('/login');
        }

        res.render('checkout', {
            userName: req.session.userName,
            bike,
            numberOfDays: days,
            totalPayment: totalPrice
        });
    } catch (err) {
        console.error('Error during rental checkout:', err);
        res.status(500).render('error', { errorMessage: 'Internal server error' });
    }
});

// Route to display bike details for purchase
router.get('/buy-now/:id', async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);
        if (!bike) {
            return res.redirect('/shop');
        }

        const relatedBikes = await Bike.find({
            category: bike.category,
            _id: { $ne: bike._id }
        }).limit(4);

        res.render('buy-now', { bike, relatedBikes });
    } catch (err) {
        console.error(err);
        res.redirect('/shop');
    }
});

// Route to handle payment for purchase
router.get('/payment', async (req, res) => {
    const bikeId = req.query.bikeId;

    try {
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).send('Bike not found');
        }

        res.render('payment', { bike });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle purchase processing
router.post('/process-purchase', async (req, res) => {
    const { cardName, bikeId } = req.body;

    try {
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).send('Bike not found');
        }

        const transaction = new Transaction({
            userName: req.session.userName,
            bikeId,
            type: 'purchase',
            totalPrice: bike.price,
        });

        await transaction.save();

        const user = await User.findOne({ firstName: req.session.userName });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.orders.push({
            bikes: [{ bikeId, quantity: 1 }],
            totalPrice: bike.price,
            date: new Date(),
        });

        await user.save();

        res.render('thank-you', {
            cardName,
            bikeName: bike.name,
            bikePrice: bike.price,
        });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle rental completion
router.post('/complete-rent', async (req, res) => {
    const { userName, bikeId, numberOfDays, totalPayment } = req.body;
    const numericTotalPayment = parseFloat(totalPayment.replace('₹', '').replace(',', ''));

    try {
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).send('Bike not found');
        }

        const user = await User.findOne({ firstName: userName });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const transaction = new Transaction({
            userName,
            bikeId,
            type: 'rental',
            totalPrice: numericTotalPayment,
        });

        await transaction.save();

        user.orders.push({
            userName:userName,
            bikes: [{ bikeId, quantity: 1 }],
            totalPrice: numericTotalPayment,
            date: new Date(),
        });

        await user.save();

        res.render('thank-you-rent', {
            userName,
            bike,
            numberOfDays,
            totalPayment: numericTotalPayment,
        });
    } catch (err) {
        console.error('Error processing rental:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display user's transactions
router.get('/my-transactions', checkSession, async (req, res) => {
    try {
        const userName = req.session.userName;

        console.log('Session User Name:', userName); // Debug session user name

        const user = await User.findOne({ firstName: userName }).populate({
            path: 'orders.bikes.bikeId',
            model: 'Bike'
        });

        if (!user) {
            console.log('User not found'); // Debug user not found
            return res.status(404).send('User not found');
        }

        console.log('User Data:', user); // Debug user data

        const transactions = user.orders;

        res.render('my-transactions', { transactions ,userName});
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

// Error page route
router.get('/error', (req, res) => {
    res.render('error');
});

// 404 page route
router.use((req, res) => {
    res.status(404).render('error', { errorMessage: 'Page Not Found' });
});

module.exports = router;
