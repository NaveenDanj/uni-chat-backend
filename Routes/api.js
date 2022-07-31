const express = require('express');
const router = express.Router();

const AuthController = require('../Controllers/Auth/auth.controller');

router.get('/', (req, res) => {
    res.json('UNI-CHAT API');
});

// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);

// router.use('/auth' , authController);
// router.use('/app' , AuthRequired('user') , appController);
// router.use('/workspace' , AuthRequired('user') , workspaceController);

router.use('/auth' , AuthController);

module.exports = router;