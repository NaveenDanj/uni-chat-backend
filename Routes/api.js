const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/Auth/auth.controller');
const UserController = require('../Controllers/User/user.controller');

router.get('/', (req, res) => {
    res.json('UNI-CHAT API');
});

router.use('/auth' , AuthController);
router.use('/user' , UserController);

module.exports = router;