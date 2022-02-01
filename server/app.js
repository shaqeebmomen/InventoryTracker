const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const authRoutes = require('./routes/api/authRoutes');
const partRoutes = require('./routes/api/partRoutes');
const cookieParser = require('cookie-parser');

let dbURI = ""

if (process.env.NODE_ENV !== 'production') {
    const private = require('./private');
    dbURI = private.MONGODB_URL;
} else {

    dbURI = process.env.MONGODB_URL;
}

// use port assigned to hosting environment or 3000 if testing
const port = process.env.PORT || 3000;


// connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })

    }).catch((err) => {
        console.log(err);
    });

// Middleware for all requestes
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(express.json()); // parses json data
app.use(cors());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parts', partRoutes);

// Front end route handling

// Handle production routes and front end routes
if (process.env.NODE_ENV === 'production') {
    // Static (built) folder
    app.use(express.static(__dirname + '/public/'));

    // Handling single page application (the kind of app vue makes)
    app.get(/.*/, (req, res) => {
        // app.get('*', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
} else {
    // Dev folder serving
    app.use(express.static('./public'));

    // Handling singe page application (the kind of app vue makes)
    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
}


