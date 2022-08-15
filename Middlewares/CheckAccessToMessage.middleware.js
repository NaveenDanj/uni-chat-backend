const db = require("../Database");

const CheckAccessToMessages = () => {

    return async (req , res , next) => {

        let contact_id = req.query.contact_id;
        let room_id = req.query.room_id;

        if(!contact_id || !room_id){
            return res.status(400).json({error: 'Invalid request'});
        }

        // check if user is in other user's contact list
        try{
            

            let checkExists_1 = await db.contacts.findOne({
                where: {
                    user_id: req.user.user.id,
                    contact_id: contact_id
                }
            });

            let checkExists_2 = await db.contacts.findOne({
                where: {
                    user_id: contact_id,
                    contact_id: req.user.user.id
                }
            });
            
            if(!checkExists_1 && !checkExists_2){
                return res.status(403).json({error: 'Unauthenticated'});
            }else{

                // check if room_id is correct
                if (checkExists_1.room_id == room_id || checkExists_2.room_id == room_id){
                    console.log('done!')
                    return next();
                }else{
                    return res.status(403).json({error: 'Unauthenticated'});
                }
                
            }

    
        }catch(err){
            console.log("the error is: " + err);
            return res.status(400).json({
                error: err
            });
        }

    }

}

module.exports = CheckAccessToMessages;