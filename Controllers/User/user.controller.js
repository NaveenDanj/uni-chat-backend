const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');
const AuthRequired = require('../../Middlewares/AuthRequired.middleware');
const {checkAllowedExtension , generateFileName} = require('../../Services/filevalidity.service');
const {uploadFile} = require('../../Services/fileuploader.service');
const fs = require('fs');
const path = require('path');

router.post('/get-user' , async (req ,res) => {

});

router.post('/upload-profile-picture' ,  AuthRequired() , async (req ,res) => {

    if(!req.busboy){
        return res.status(400).json({error: 'No file uploaded'});
    }

    req.pipe(req.busboy);

    req.busboy.on('file', async function (fieldname, file, filename) {

        if (!file){
            return res.status(400).json({error: 'No file uploaded'});
        }
    
        // check if file is valid
        let isValid = checkAllowedExtension(filename , 'profile-picture');
    
        if(!isValid){
            return res.status(400).json({error: 'Invalid file extension'});
        }

        // generate a unique name for the file
        let fileName = generateFileName(filename);
        file.filename = fileName;
        file.size = req.headers['content-length'] / 1024;

        // check if file size is valid
        if(file.size > 1024){
            return res.status(400).json({error: 'File size too large'});
        }
    
        try{

            // remove the old profile picture
            let propic_user = await db.users.findOne({
                where: {
                    id: req.user.user.id
                }
            });


            if(propic_user.profile_image){
                let oldPropic = propic_user.profile_image;
                let oldPropicPath = path.join(process.cwd()  , '/uploads/' + oldPropic);
                
                if(fs.existsSync(oldPropicPath) && propic_user.profile_image != '/propic/default.png'){
                    fs.unlinkSync(oldPropicPath);
                }

            }
            
            // move the file to the uploads folder
            let filePath = await uploadFile(file , 'profile-picture');

            // update the user profile picture
            let user = await db.users.update({
                profile_image: filePath
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
            return res.status(500).json({
                error: 'Error uploading file',
                error : err
            });
        }

    });

});

router.post('/edit-profile' , AuthRequired() , async(req , res) => {

    // validation object
    const validator = Joi.object({
        profileName: Joi.string().required(),
        designation : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
    });

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        let user = await db.users.update({
            fullname : data.profileName,
            designation : data.designation,
            about : data.description,
            location : data.location
        } , {
            where : {
                id: req.user.user.id
            }
        });

        return res.status(200).json({
            message: 'User updated successfully',
            user: user
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }

});

router.get('/update-profile-photo-privacy' , AuthRequired() , async(req , res) => {

    let validator = Joi.object({
        status: Joi.string().valid(...['Public','Private']),
    });


    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // update status
        await db.users.update({
            profile_image_public : data.status == 'Public' ? true : false,
        } , {
            where : {
                id: req.user.user.id
            }
        });

        return res.status(200).json({
            message : "Privacy settings updated successfully."
        });
        

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }


});

router.get('/update-online-privacy' , AuthRequired() , async(req , res) => {

    let validator = Joi.object({
        status: Joi.boolean()
    });


    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // update status
        await db.users.update({
            is_online : data.status,
        } , {
            where : {
                id: req.user.user.id
            }
        });

        return res.status(200).json({
            message : "Privacy settings updated successfully."
        });
        

    }catch(err){

        return res.status(400).json({
            error: err.message
        });

    }


});

module.exports = router;