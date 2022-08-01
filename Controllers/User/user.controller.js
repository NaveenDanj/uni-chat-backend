const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');
const AuthRequired = require('../../Middlewares/AuthRequired.middleware');
const {checkAllowedExtension , generateFileName} = require('../../Services/filevalidity.service');

router.post('/get-user' , async (req ,res) => {

});

router.post('/upload-profile-picture' , AuthRequired() , async (req ,res) => {

    // get the uploaded file
    let file = req.files.file;

    // check if file is valid
    let isValid = checkAllowedExtension(file , 'profile-picture');

    if(!isValid){
        return res.status(400).json({error: 'Invalid file extension'});
    }

    // generate a unique name for the file
    let fileName = generateFileName(file);
    file.name = fileName;

    // move the file to the uploads folder
    file.mv(`./uploads/profile-pictures/${fileName}` , async (err) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: 'Something went wrong'});
        }

        // update the profile picture
        await db.users.update({
            profile_picture: fileName
        } , {
            where: {
                id: req.user.id
            }
        });

        return res.status(200).json({message: 'Profile picture updated successfully'});

    });

});

module.exports = router;