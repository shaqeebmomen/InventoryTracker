const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAge = 1 * 60 * 60; // 1 hour in s
// const maxAge = 30 * 1000; // 30s in ms
const secret = process.env.AUTH_SECRET || 'something longer than this';


const createToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    });
};

const sendToken = (req, res, id, guest) => {
    const token = createToken(id);
    //Send auth cookie
    res.cookie('authToken', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: true });
    //Send session cookie
    // res.cookie('sessionToken', id, { maxAge: maxAge, sameSite: true });
    res.status(201).json({ user: id, guest });
}

const clearToken = (req, res, id) => {
    const token = jwt.sign({ id }, secret, {
        expiresIn: 1
    });
    res.cookie('authToken', token, { httpOnly: true, maxAge: 1, sameSite: true });
    res.status(201).send('user logged out');
}

const handleErrors = (err) => {
    console.log(err.message, err.code ? err.code : undefined);
    let errors = { message: '' };

    // incorrect email or password
    if (err.message === 'incorrect credentials') {
        errors.message = err.message;
    }

    // mongoose error code handling
    if (err.code === 11000) {
        // duplicate of unique document error code
        errors.message = 'user already registered';
        return errors;
    }

    // mongoose validation errors
    if (err.message.includes('user validation failed')) {
        // this applies to all validation errors from mongoose
        Object.values(err.errors).forEach(({ properties }) => {
            // attach each categorial error message to error object
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

module.exports = {


    // Login a user given email and pass credentials
    login_post: async (req, res) => {
        //res.send('login post request');
        // get credentials from body
        const { email, password } = req.body;

        // find user in db with same email
        try {
            const user = await User.login(email, password);
            // send cookie
            sendToken(req, res, user._id, user.guest);
        } catch (err) {
            console.log('could not log in user');
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
    },

    signup_post: async (req, res) => {
        // get sent credentials

        const { email, password, guest } = req.body;

        try {
            // add user to db, hashing taken care of in model hooks
            await User.create({
                email,
                password,
                guest
            });
            res.status(201).send('user created');

        } catch (err) {
            console.log('User could not be created');
            const errors = handleErrors(err);
            res.status(500).json({ errors });
        }
    },
    session_post: async (req, res) => {
        // verifyUser middleware should have passed before this already
        // Send authToken
        sendToken(req, res, res.locals.userId, res.locals.guest);
    },
    logout_post: async (req, res) => {
        clearToken(req, res, req.body.id);
    },
    secret
}