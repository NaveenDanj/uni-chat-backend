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
            case 'post-file':
                allowedExtensions = ['*'];
                break;
            default:
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
        }

        let fileExtension = file.filename.split('.').pop();

        if(allowedExtensions[0] == '*'){
            return true;
        }

        if(allowedExtensions.includes(fileExtension)){
            return true;
        }else{
            return false;
        }


    },

    generateFileName(file){
        let fileExtension = file.filename.split('.').pop();
        return Uuid.v4() + '.' + fileExtension;
    },

    getFileType(file){

        let fileExtension = file.filename.split('.').pop();

        if(['jpg' , 'jpeg' , 'png'].includes(fileExtension)){
            return 'image';
        }else if(['mp4' , 'mkv' , 'avi'].includes(fileExtension)){
            return 'video';
        }else{
            return 'file';
        }

    }


};