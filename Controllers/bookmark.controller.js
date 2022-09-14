const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Config/validater.config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/' , async(req , res) => {

    const page = req.query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    try{

        // get current user contacts and get user data using relations
        let bookmarks = await db.bookmarks.findAll({
            where: {
                user_id: req.user.user.id
            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });
        
        return res.status(200).json({
            message: 'Bookmarks fetched',
            bookmarks: bookmarks
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });
    }


});

router.post('/add' , async(req , res) => {

    // validation object
    const validator = Joi.object({
        stored_in : Joi.string().required(),
        chat_id : Joi.number().required(),
    });

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if chat is exits
        let _chat = await db.chat.findOne({
            where : {
                id : data.chat_id
            }
        });

        if (!_chat){
            return res.status(400).json({error: 'Chat not found'});
        }

        let bookmark_check = await db.bookmarks.findOne({
            where : {
                chat_id : data.chat_id,
                user_id : req.user.user.id
            }
        });

        if(bookmark_check){
            return res.status(400).json({error: 'Already added to the bookmark'});
        }

        let _bookmark = await db.bookmarks.create({
            user_id : req.user.user.id,
            type : _chat.message_type,
            stored_in : data.stored_in,
            chat_id : _chat.id,
            message : _chat.message
        });

        return res.status(201).json({
            message : "Bookmark added!",
            bookmark : _bookmark
        });

    }catch(err){
        return res.status(400).json({
            error: err.message
        });
    }

});

router.post('/remove' , async(req , res) => {

    const validator = Joi.object({
        bookmark_id : Joi.number().required(),
    });

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if bookmark is exits
        let _bookmark = await db.bookmarks.findOne({
            where : {
                id : data.bookmark_id,
                user_id : req.user.user.id
            }
        });

        if (!_bookmark){
            return res.status(400).json({error: 'Bookmark not found'});
        }

        let __bookmark = await db.bookmarks.destroy({
            where: {
                id: data.bookmark_id,
                user_id: req.user.user.id
            }
        });

        return res.status(200).json({
            message : "Bookmark deleted!",
        });


    }catch(err){
        return res.status(400).json({
            error: err.message
        });
    }

});

router.get('/search' , async(req , res) => {

    const query = req.query.query;
    const limit = 20;

    try{

        // get current user contacts and get user data using relations
        let bookmarks = await db.bookmarks.findAll({
            where: {
                user_id: req.user.user.id,
                name: {
                    [Op.message]: `%${query}%`
                }

            },
            order: [
                ['id', 'DESC']
            ],
            limit: limit
        });
        
        return res.status(200).json({
            message: 'Bookmarks fetched',
            bookmarks: bookmarks
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });
    }


});

module.exports = router;