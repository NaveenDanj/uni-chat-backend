const fs = require('fs');

module.exports = {

    uploadFile(file , occassion){
        let maxSize = 0;

        switch(occassion){
            case 'profile-picture':
                // allow only 1mb in kb
                maxSize = 1024;
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
                maxSize = 1024 * 25;
                allowedExtensions = ['*'];
            default:
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
        }

        return new Promise((resolve , reject) => {
            try{
                let err = false;
                // check if file size is valid
                if(file.size > maxSize){
                    reject('File size exceeded');
                    err = true;
                }


                if(!err){

                    
                    if(occassion == 'post-file'){

                        let filePath = '/files/' + file.filename
    
                        fstream = fs.createWriteStream(process.cwd() + '/uploads/files/' + file.filename);
                        file.pipe(fstream);
    
                        fstream.on('close', function () {
                            resolve(filePath);
                        });

                    }else if(occassion == 'profile-picture'){

                        let filePath = '/propic/' + file.filename
    
                        fstream = fs.createWriteStream(process.cwd() + '/uploads/propic/' + file.filename);
                        file.pipe(fstream);
    
                        fstream.on('close', function () {
                            resolve(filePath);
                        });
                    }


                }
                
            }catch(err){
                reject(err);
            }

        });
    },


    deleteOldFile(){
        return
    }
   
};