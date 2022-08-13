const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');

router.get('/get_user_messages' , async (req , res) => {
    
    const contact_id = req.query.contact_id;
    const room_id = req.query.room_id;
    const page = req.query.page || 1;
    const limit = 15;
    const offset = (page - 1) * limit;

    if (!contact_id || !room_id) {
        return res.status(400).send({ error: 'Invalid request' });
    }

    try{

        const messages = await db.chat.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        from_user_id: contact_id,
                        to_user_id: req.user.id,
                    },
                    {
                        from_user_id: req.user.id,
                        to_user_id: contact_id
                    }
                ],
                room_id: room_id
            },
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });
    
        return res.json({
            messages: messages
        });

    }catch(err){

        return res.status(500).json({
            error: err.message
        });

    }

    

});

module.exports = router;