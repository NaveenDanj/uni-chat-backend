const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Config/validater.config');
const CheckAccessToMessages = require('../Middlewares/CheckAccessToMessage.middleware');
const {checkAllowedExtension , generateFileName} = require('../Services/filevalidity.service');
const {uploadFile} = require('../Services/fileuploader.service');



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

        // generate a unique name for the file
        let fileName = generateFileName(filename);
        file.filename = fileName;
        file.size = req.headers['content-length'] / 1024;

        // move the file to the uploads folder
        let filePath = await uploadFile(file , 'post-file');

        // update the user profile picture
        // let user = await db.users.update({
        //     profile_image: filePath
        // } , {
        //     where: {
        //         id: req.user.user.id
        //     }
        // });


    });

});


module.exports = router;