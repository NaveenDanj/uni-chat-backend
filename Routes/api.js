const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('UNI-CHAT API');
});

// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);

// router.use('/auth' , authController);
// router.use('/app' , AuthRequired('user') , appController);
// router.use('/workspace' , AuthRequired('user') , workspaceController);

module.exports = router;