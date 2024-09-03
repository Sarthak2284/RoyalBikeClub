const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const indexRouter = require('./routes/index');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/royalBikeClub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Set up EJS and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configure session management
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/royalBikeClub',
        collectionName: 'sessions', // Name of the collection to store sessions
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default is 14 days
    }),
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Use the router for handling routes
app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404);
    res.render('error', { errorMessage: '404 - Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('error', { errorMessage: 'Internal Server Error' });
});
// Start the server
app.listen(3004, () => {
    console.log('Server is running on port 3004');
});
