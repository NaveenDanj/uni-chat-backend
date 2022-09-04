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
                user_id: req.user.user.id,
                contact_id: checkUser.id
            }
        });

        if(checkContact){
            return res.status(400).json({error: 'Contact already exists'});
        }

        // check if contact is user himself
        if(req.user.user.userId == data.contactId){
            return res.status(400).json({error: 'You can not add yourself as contact'});
        }

        // check if user is in contact's block list
        let checkBlock = await db.contacts.findOne({
            where: {
                user_id: checkUser.id,
                contact_id: req.user.user.id,
                blocked: true
            }
        });

        if(checkBlock){
            return res.status(400).json({error: 'User has blocked you'});
        }

        // create contact
        let contact = await db.contacts.create({
            user_id: req.user.user.id,
            contact_id: checkUser.id,
            contact_name: data.contactName,
            room_id: req.user.user.id > checkUser.id ? req.user.user.id+'' + "-" + checkUser.id+'' : checkUser.id+'' + '-' + req.user.user.id
        });

        return res.status(200).json({
            message: 'Contact created',
            contact: contact
        });


    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }


});

router.get('/get_current_user_contact' , async (req , res) => {

    try{

        // get current user contacts and get user data using relations
        let contacts = await db.contacts.findAll({
            where: {
                user_id: req.user.user.id
            },
            // get user data using relations without password
            include: [{
                model: db.users,
                attributes: {
                    exclude: ['password']
                }
            }]
        });
        
        return res.status(200).json({
            message: 'Contacts fetched',
            contacts: contacts
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });
    }

});

router.post('/add_to_favourite' , async (req , res) => {

    // validation object
    const validator = Joi.object({
        contactId: Joi.string().required(),
    })

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if contact exists
        let checkContact = await db.contacts.findOne({
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });

        if(!checkContact){
            return res.status(400).json({error: 'Contact not found'});
        }
        
        // check if contact is already favourite
        if(checkContact.is_favorite){
            return res.status(400).json({error: 'Contact is already favourite'});
        }
        
        // update contact
        let contact = await db.contacts.update({
            is_favorite: true
        },{
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });
        
        return res.status(200).json({
            message: 'Contact added to favourite',
            contact: contact
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }

});

router.delete('/remove_from_favourite' , async (req , res) => {

    // validation object
    const validator = Joi.object({
        contactId: Joi.string().required(),
    })

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if contact exists
        let checkContact = await db.contacts.findOne({
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });

        if(!checkContact){
            return res.status(400).json({error: 'Contact not found'});
        }
        
        // check if contact is already favourite
        if(!checkContact.is_favorite){
            return res.status(400).json({error: 'Contact is not favourite'});
        }
        
        // update contact
        let contact = await db.contacts.update({
            is_favorite: false
        },{
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });
        
        return res.status(200).json({
            message: 'Contact removed from favourite',
            contact: contact
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }



});

router.post('/delete' , async (req , res) => {

    console.log('delete handled!');

    // validation object
    const validator = Joi.object({
        contactId: Joi.string().required(),
    })

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if contact exists
        let checkContact = await db.contacts.findOne({
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });

        if(!checkContact){
            return res.status(400).json({error: 'Contact not found'});
        }
        
        // delete contact
        let contact = await db.contacts.destroy({
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });
        
        return res.status(200).json({
            message: 'Contact deleted',
            contact: contact
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }


});

router.post('/block' , async (req , res) => {

    // validation object
    const validator = Joi.object({
        contactId: Joi.string().required(),
    })

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if contact exists
        let checkContact = await db.contacts.findOne({
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });

        if(!checkContact){
            return res.status(400).json({error: 'Contact not found'});
        }
        
        // check if contact is already blocked
        if(checkContact.blocked){
            return res.status(400).json({error: 'Contact is already blocked'});
        }
        
        // update contact
        let contact = await db.contacts.update({
            blocked: true
        },{
            where: {
                user_id: req.user.user.id,
                contact_id: data.contactId
            }
        });
        
        return res.status(200).json({
            message: 'Contact blocked',
            contact: contact
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }


});

module.exports = router;