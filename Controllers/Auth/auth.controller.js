const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');
const {generateToken , generateUserId} = require('../../Services/Jwt.service');
const {hashPasswod} = require('../../Services/hash.service');

router.post('/register' , async (req ,res) => {

    const validator = Joi.object({
        fullname: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        device_name: Joi.string().required(),
    });

    try{
        let data = await validator.validateAsync(req.body , {abortEarly: false});

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
            console.log(checkUser)
            return res.status(400).json({error: 'User already exists'});
        }

        // create user

        let hashed_password = await hashPasswod(data.password);

        let user = await db.users.create({
            userId : generateUserId(),
            fullname: data.fullname,
            phone: data.phone,
            email: data.email,
            password: hashed_password
        });

        // generate token
        const token = generateToken(data.email);

        // save token
        await db.access_tokens.create({
            token: token,
            user_id: user.id,
            device: data.device_name
        });

        // return user
        return res.status(200).json({
            user: user,
            token: token
        });


    }catch(err){
        return res.status(400).json({
            error: err.message
        });
    }


});

module.exports = router;