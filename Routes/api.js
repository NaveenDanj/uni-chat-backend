const express = require('express');
const router = express.Router();

const AuthRequired = require('../Middlewares/AuthRequired.middleware');

const AuthController = require('../Controllers/Auth/auth.controller');
const UserController = require('../Controllers/User/user.controller');
const ChannelController = require('../Controllers/Channel/channel.controller');
const ContactController = require('../Controllers/User/contact.controller');
const ChatController = require('../Controllers/chat.controller');
const BookmarkController = require('../Controllers/bookmark.controller');

router.get('/', (req, res) => {
    return res.json('UNI-CHAT API changed!');
});

router.use('/auth' , AuthController);
router.use('/user' , UserController);
router.use('/channel' , AuthRequired() , ChannelController);
router.use('/contact' , AuthRequired() , ContactController);
router.use('/chat' , AuthRequired() , ChatController)
router.use('/bookmark' , AuthRequired() , BookmarkController)

module.exports = router;