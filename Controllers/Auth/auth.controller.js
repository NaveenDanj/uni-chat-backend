const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');

router.post('/register' , async (req ,res) => {

    const validator = Joi.validate(req.body, {
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string().required(),
        role: Joi.string().required(),
    });

    let data = await validator.validateAsync(req.body , {abortEarly: false});
    

});

module.exports = router;