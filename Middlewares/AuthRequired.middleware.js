const jwt = require('jsonwebtoken');
const db = require("../Database");

const AuthRequired = () => {

    return async (req , res , next) => {

        const token = req.headers['authorization'];
        
        if(!token){
            return res.status(401).send({error: 'Unauthenticated 1'});
        }

        try{

            let checkExists = await db.access_tokens.findOne({
                where: {
                    token: token
                }
            });
            
            if(!checkExists){
                return res.status(401).send({error: 'Unauthenticated'})
            }

            if(checkExists.blocked){
                return res.status(401).send({error: 'Unauthenticated'})
            }

        }catch(err){
            return res.status(401).send({error: 'Unauthenticated'})
        }
        

        jwt.verify(token, process.env.JWT_SECRET, async(err, userObject) => {
        
            if (err) return res.status(403).json({message: 'Unauthenticated'});
        
            try{
                
                // deselect the password from the user object
                let user = await db.users.findOne({
                    where: {
                        email: userObject.email
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });

                const userObjects = {
                    user: user,
                }

                if(!user){
                    return res.status(403).json({message: 'Unauthenticated'});
                }
                
                req.user = userObjects;
                next();

            }catch(err){
                return res.status(401).send({error: 'Unauthenticateds'})
            }

        })

    }

}

module.exports = AuthRequired;