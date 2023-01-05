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

    pool.query('SELECT `channel_id`, `message_id`, `amount`, `reason`, `created_at` FROM `experience_points` AS exp WHERE exp.guild_id = ? AND exp.user_id = ? ' +
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
        message_id: null,
        amount: null,
        reason: null
    };

    const amount = req.body.amount?.toString().match(/^[+-]?\d+$/);
    if (!amount) return badRequest(res, 'Invalid request body');
    else data.amount = amount[0];

    const channel_id = req.body.channel_id?.toString().match(regex.id);
    if (channel_id) data.channel_id = channel_id[1];

    const message_id = req.body.message_id?.toString().match(regex.id);
    if (message_id) data.message_id = channel_id[1];

    const reason = req.body.reason?.toString().match(/^.{1,100}$/);
    if (reason) data.reason = reason[0];

    pool.query('INSERT INTO `experience_points` SET ?', [data])
        .then(() => {
            res.status(201).end();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;