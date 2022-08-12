const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');

router.post('/create', async (req , res) => {

    // validation object
    const validator = Joi.object({
        contactId: Joi.string().required(),
        contactName : Joi.string().required(),
    })

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if user exists by user unique id
        let checkUser = await db.users.findOne({
            where: {
                userId: data.contactId
            }
        });

        if(!checkUser){
            return res.status(400).json({error: 'User not found'});
        }

        // check if contact already exists
        let checkContact = await db.contacts.findOne({
            where: {
                userId: req.user.user.id,
                contactId: data.contactId
            }
        });

        if(checkContact){
            return res.status(400).json({error: 'Contact already exists'});
        }


        // check if user is in contact's block list
        let checkBlock = await db.contacts.findOne({
            where: {
                userId: data.contactId,
                contactId: req.user.user.id,
                blocked: true
            }
        });

        if(checkBlock){
            return res.status(400).json({error: 'User has blocked you'});
        }

        // create contact
        let contact = await db.contacts.create({
            user_id: req.user.user.id,
            contact_id: data.contactId,
            contact_name: data.contactName
        });

        return res.status(200).json({message: 'Contact created'});


    }catch(err){
        return res.status(400).json({error: err.message});
    }


});

module.exports = router;