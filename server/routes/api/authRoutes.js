const { Router } = require('express');
const authControllers = require('../../controllers/authControllers');
const { verifyUser } = require('../../middleware/authMiddleware');

const router = Router();

// /api/auth...


// authenticate user
router.post('/', authControllers.login_post);

// verify user session 
router.post('/session', verifyUser, authControllers.session_post);

// logout user
router.post('/logout', authControllers.logout_post);

// sign up new user
if (process.env.NODE_ENV !== 'production') {
    router.post('/signup', authControllers.signup_post);
}

router.all((req, res) => {
    res.sendStatus(404);
});

module.exports = router;