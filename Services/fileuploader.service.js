const fs = require('fs');

module.exports = {

    uploadFile(file , occassion){

        let filePath = null;
        let maxSize = 0;

        switch(occassion){
            case 'profile-picture':
                filePath = `./uploads/profile-pictures/${file.filename}`;
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
            default:
                allowedExtensions = ['jpg' , 'jpeg' , 'png'];
                break;
        }

        // return new Promise((resolve , reject) => {
        //     file.mv(filePath , (err) => {
        //         if(err){
        //             reject(err);
        //         }
        //         resolve(filePath);
        //     });
        // });

        return new Promise((resolve , reject) => {
            try{
                let err = false;
                // check if file size is valid
                if(file.size > maxSize){
                    reject('File size exceeded');
                    err = true;
                }


                if(!err){
                    let filePath = '/propic/' + file.filename

                    fstream = fs.createWriteStream(process.cwd() + '/uploads/propic/' + file.filename);
                    file.pipe(fstream);

                    fstream.on('close', function () {
                        resolve(filePath);
                    });
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