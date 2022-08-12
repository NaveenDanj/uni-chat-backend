const express = require('express');
const router = express.Router();
const AuthRequired = require('../Middlewares/AuthRequired.middleware');

const AuthController = require('../Controllers/Auth/auth.controller');
const UserController = require('../Controllers/User/user.controller');
const ChannelController = require('../Controllers/Channel/channel.controller');
const ContactController = require('../Controllers/User/contact.controller');

router.get('/', (req, res) => {
    return res.json('UNI-CHAT API');
});

router.use('/auth' , AuthController);
router.use('/user' , UserController);
router.use('/channel' , AuthRequired() , ChannelController);
router.use('/contact' , AuthRequired() , ContactController);

module.exports = router;