const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');
const AuthRequired = require('../../Middlewares/AuthRequired.middleware');
const {checkAllowedExtension , generateFileName} = require('../../Services/filevalidity.service');
const {uploadFile} = require('../../Services/fileuploader.service');

router.post('/get-user' , async (req ,res) => {

});

router.post('/upload-profile-picture' , AuthRequired() , async (req ,res) => {

    if (!req.avatar){
        return res.status(400).json({error: 'No file uploaded'});
    }

    let file = req.files.avatar;

    if(!file){
        return res.status(400).json({error: 'No file uploaded'});
    }

    // check if file is valid
    let isValid = checkAllowedExtension(file , 'profile-picture');

    if(!isValid){
        return res.status(400).json({error: 'Invalid file extension'});
    }

    // generate a unique name for the file
    let fileName = generateFileName(file);
    file.name = fileName;

    try{
        // move the file to the uploads folder
        let filePath = await uploadFile(file , 'profile-picture');

        // update the user profile picture
        let user = await db.users.update({
            profile_picture: filePath
        } , {
            where: {
                id: req.user.user.id
            }
        });

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            user : user
        });


    }catch(err){
        return res.status(500).json({error: 'Error uploading file'});
    }

});

module.exports = router;