const fs = require('fs');

module.exports = {

    uploadFile(file , occassion){

        let filePath = null;

        switch(occassion){
            case 'profile-picture':
                filePath = `./uploads/profile-pictures/${file.name}`;
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
                let filepath = '/uploads/propic/' + file.filenam
                fstream = fs.createWriteStream(process.cwd() + '/uploads/propic/' + file.filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    resolve(filePath);
                });
            }catch(err){
                reject(err);
            }

        });
    }
   
};