const db = require("../Database");

const CheckAccessToMessages = () => {

    return async (req , res , next) => {

        let contact_id = req.query.contact_id;
        let room_id = req.query.room_id;

        if(!contact_id || !room_id){
            return res.status(400).send({error: 'Invalid request'});
        }

        // check if user is in other user's contact list
        try{
                
            let checkExists_1 = await db.contacts.findOne({
                where: {
                    user_id: req.user.id,
                    contact_id: contact_id
                }
            });

            let checkExists_2 = await db.contacts.findOne({
                where: {
                    user_id: contact_id,
                    contact_id: req.user.id
                }
            });
            
            if(!checkExists_1 || !checkExists_2){
                return res.status(403).send({error: 'Unauthenticated'});
            }

            // check if room_id is correct
            if(checkExists_1.room_id !== room_id || checkExists_2.room_id !== room_id){
                return res.status(403).send({error: 'Unauthenticated'});
            }
            
            next();
    
        }catch(err){
            return res.status(500).send({error: 'Unauthenticated'});
        }

    }

}

module.exports = CheckAccessToMessages;