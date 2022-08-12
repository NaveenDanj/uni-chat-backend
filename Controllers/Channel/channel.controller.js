const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');

router.post('/create' , async (req , res) => {
    
    // validate request body
    const validator = Joi.object({
        channel_name: Joi.string().required(),
        user_id: Joi.string().required(),
        
    });
    
    return res.status(200).json({
        message: 'create'
    });

});

module.exports = router;