const Uuid = require('uuid');

module.exports = {

    checkAllowedExtension(file , occassion){

        let allowedExtensions = [];

        switch(occassion){
            case 'profile-picture':
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
            case 'cover-picture':
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
            case 'post-image':
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
            case 'post-video':
                allowedExtensions = ['mp4' , 'mkv' , 'avi'];
                break;
            default:
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
        }

        let fileExtension = file.filename.split('.').pop();

        if(allowedExtensions.includes(fileExtension)){
            return true;
        }else{
            return false;
        }


    },

    generateFileName(file){
        let fileExtension = file.filename.split('.').pop();
        return Uuid.v4() + '.' + fileExtension;
    }


};