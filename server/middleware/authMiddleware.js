const jwt = require('jsonwebtoken');
const { secret } = require('../controllers/authControllers');
const User = require('../models/User');

module.exports = {
    // Used to check token validity before accessing protected routes
    verifyUser: async (req, res, next) => {
        const token = req.cookies.authToken;

        if (token) {
            // Decoded token holds user ID
            await jwt.verify(token, secret, async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.sendStatus(403);
                } else {
                    res.locals.userId = decodedToken.id;
                    try {
                        const user = await User.findById(decodedToken.id);
                        res.locals.guest = user.guest;
                        next();
                    } catch (error) {
                        console.log(error.message);
                        res.sendStatus(500);
                    }
                }
            })
        } else {
            res.sendStatus(403);
        }
    },
    checkGuest: (req, res, next) => {
        if (!res.locals.guest) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
}