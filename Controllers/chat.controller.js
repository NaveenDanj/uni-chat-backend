const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Config/validater.config');
const CheckAccessToMessages = require('../Middlewares/CheckAccessToMessage.middleware');
const {checkAllowedExtension , generateFileName , getFileType} = require('../Services/filevalidity.service');
const {uploadFile} = require('../Services/fileuploader.service');
require('dotenv').config()

router.get('/get_user_messages' , CheckAccessToMessages() , async (req , res) => {
    
    const contact_id = req.query.contact_id;
    const room_id = req.query.room_id;
    const page = req.query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    if (!contact_id || !room_id) {
        return res.status(400).send({ error: 'Invalid request' });
    }

    try{

        const messages = await db.chat.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        from_user_id: contact_id,
                        to_user_id: req.user.user.id,
                    },
                    {
                        from_user_id: req.user.user.id,
                        to_user_id: contact_id
                    }
                ],
            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });

        // get the count of all messages
        const count = await db.chat.count({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        from_user_id: contact_id,
                        to_user_id: req.user.user.id,
                    },
                    {
                        from_user_id: req.user.user.id,
                        to_user_id: contact_id
                    }
                ],
            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });

    
        return res.json({
            messages: messages,
            page : page,
            limit : limit,
            offset : offset,
            total : count
        });

    }catch(err){

        return res.status(500).json({
            error: err.message
        });

    }

    

});


router.post('/upload-file' , async (req , res) => {

    if(!req.busboy){
        return res.status(400).json({error: 'No file uploaded'});
    }

    if(!req.query.to_user){
        return res.status(400).json({error: 'Bad Request'});
    }

    req.pipe(req.busboy);

    req.busboy.on('file', async function (fieldname, file, filename) {

        if (!file){
            return res.status(400).json({error: 'No file uploaded'});
        }

        // check if file is valid
        let isValid = checkAllowedExtension(filename , 'post-file');
    
        if(!isValid){
            return res.status(400).json({error: 'Invalid file extension'});
        }

        try{

            // check if user exists
            let check_user = await db.users.findOne({
                where : {
                    id : req.query.to_user
                }
            });

            if(!check_user){
                return res.status(404).json({error: 'User not found'});
            }

            // generate a unique name for the file
            let original_filename = filename.filename;
            let fileName = generateFileName(filename);
            file.filename = fileName;
            file.size = req.headers['content-length'] / 1024;

            // move the file to the uploads folder
            let filePath = await uploadFile(file , 'post-file');

            let uploaded_file = await db.uploaded_files.create({
                user_id: req.user.user.id,
                to_id : req.query.to_user,
                file_original_name: original_filename,
                file_name: fileName,
                file_path: process.env.HOST_NAME + filePath,
                file_type : getFileType(fileName),
                file_size: file.size,
                file_extension : fileName.split('.').pop()
            });

            return res.json({
                file: uploaded_file
            });

        }catch(err){

            return res.status(400).json({
                error: err.message
            });

        }

    });

});

router.get('/get-user-media' , async (req , res) => {

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 3;
    const offset = (page - 1) * limit;
    const type = req.query.type || 'all';

    try{

        
        if(type == 'all'){

            const files = await db.uploaded_files.findAll({
                where: {
                    user_id: req.user.user.id,
    
                },
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit
            });
    
            // get the count of all files
            const count = await db.uploaded_files.count({
                where: {
                    user_id: req.user.user.id,
                },
                order: [
                    ['id', 'DESC']
                ],
                offset: offset,
                limit: limit
            });
    
        
            return res.json({
                files: files,
                page : page,
                limit : limit,
                offset : offset,
                total : count
            });

        }

        const files = await db.uploaded_files.findAll({
            where: {
                user_id: req.user.user.id,
                file_type : type

            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });

        // get the count of all files
        const count = await db.uploaded_files.count({
            where: {
                user_id: req.user.user.id,
                file_type : type
            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });

    
        return res.json({
            files: files,
            page : page,
            limit : limit,
            offset : offset,
            total : count
        });

    }catch(err){

        return res.status(500).json({
            error: err.message
        });

    }

});


module.exports = router;