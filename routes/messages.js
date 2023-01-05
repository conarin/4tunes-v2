const express = require('express');
const router = express.Router();
const checkMember = require('../routes/checkMember.js');

let guild_id, user_id, is_existing_user, query_error;

router.use(async (req, res, next) => {
    ({guild_id, user_id, is_existing_user, query_error} = await checkMember(req.baseUrl));
    if (query_error) next(query_error);
    else next();
});

router.get('/', async (req, res, next) => {
    if (!guild_id || !user_id || !is_existing_user) return next();

    pool.query('SELECT `channel_id`, `message_id`, `created_at` FROM `messages` WHERE messages.guild_id = ? AND messages.user_id = ? ' +
        'ORDER BY `created_at` DESC', [guild_id[1], user_id[1]])
        .then(([results]) => {
            res.json(results)
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    if (!guild_id || !user_id || !is_existing_user) return next();

    const data = {
        user_id: user_id[1],
        guild_id: guild_id[1],
        channel_id: null,
        message_id: null
    };

    const channel_id = req.body.channel_id?.toString().match(regex.id);
    if (!channel_id) return badRequest(res, 'Invalid request body');
    else data.channel_id = channel_id[1];

    const message_id = req.body.message_id?.toString().match(regex.id);
    if (!message_id) return badRequest(res, 'Invalid request body');
    else data.message_id = message_id[1];

    pool.query('INSERT INTO `messages` SET ?', [data])
        .then(() => {
            res.status(201).end();
        })
        .catch(err => {
            if (err.errno === 1062) {
                res.status(409).end();
            } else {
                next(err);
            }
        });
});

module.exports = router;