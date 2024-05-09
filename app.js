const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRoute = require('./routes/index');
app.use('/', indexRoute);

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/tickets', ticketRoutes); 

app.use(session({
    secret: 'your_secret_key',  
    resave: false,
    saveUninitialized: false
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT);
