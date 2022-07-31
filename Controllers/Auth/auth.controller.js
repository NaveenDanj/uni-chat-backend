const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');

router.post('/register' , async (req ,res) => {

    const validator = Joi.validate(req.body, {
        fullname: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    try{
        let data = await validator.validateAsync(req.body , {abortEarly: false});
        // go ahead

        // check if user exists by email or phone
        let checkUser = await db.users.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    {email: data.email},
                    {phone: data.phone}
                ]
            }
        });

        if(checkUser){
            return res.status(400).json({error: 'User already exists'});
        }

        // create user
        let user = await db.users.create({
            fullname: data.fullname,
            phone: data.phone,
            email: data.email,
            password: data.password,
        });

        // generate token
        const token = null

        // save token
        await db.access_token.create({
            user_id: user.id,
            token: token
        });

        // return user
        return res.status(200).json({
            user: user,
            token: token
        });


    }catch(err){
        return res.status(400).send(err.details);
    }


});

module.exports = router;