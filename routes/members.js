const express = require('express');
const router = express.Router();
const RE2 = require('re2');

let guild_id;

router.use((req, res, next) => {
    guild_id = req.baseUrl
        .replace('/guilds/', '')
        .replace('/members', '')
        .match(regex.id);
    next();
});

router.post('/', async (req, res, next) => {
    if (!guild_id) return next();

    const user_id = req.body.user_id?.toString().match(regex.id);
    if (!user_id) return badRequest(res, 'Invalid request body');

    pool.query('INSERT INTO `members` (`guild_id`, `user_id`) VALUES (?, ?)', [guild_id[1], user_id[1]])
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

router.get('/', async (req, res, next) => {
    if (!guild_id) return next();

    pool.query('SELECT members.user_id, members.guild_id, members.is_notify, members.chain_login, IFNULL(point_balance, 0) AS point_balance, IFNULL(exp, 0) AS exp, IFNULL(message_count, 0) AS message_count, members.created_at, GREATEST(IFNULL(members.updated_at, CAST(0 AS DATETIME)), IFNULL(point_updated_at, CAST(0 AS DATETIME)), IFNULL(exp_updated_at, CAST(0 AS DATETIME)), IFNULL(message_updated_at, CAST(0 AS DATETIME))) AS updated_at FROM `members` ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS point_balance, MAX(created_at) AS point_updated_at FROM `points` GROUP BY user_id, guild_id) AS points ON members.user_id = points.user_id AND members.guild_id = points.guild_id ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS exp, MAX(created_at) AS exp_updated_at FROM `experience_points` GROUP BY user_id, guild_id) AS exp ON members.user_id = exp.user_id AND members.guild_id = exp.guild_id  ' +
        'LEFT JOIN (SELECT user_id, guild_id, COUNT(user_id) AS message_count, MAX(created_at) AS message_updated_at FROM `messages` GROUP BY user_id, guild_id) AS messages ON members.user_id = messages.user_id AND members.guild_id = messages.guild_id ' +
        'WHERE members.guild_id = ?', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:user_id', async (req, res, next) => {
    if (!guild_id) return next();

    const user_id = req.params.user_id?.toString().match(regex.id);
    if (!user_id) return next();

    pool.query('SELECT members.user_id, members.guild_id, members.is_notify, members.chain_login, IFNULL(point_balance, 0) AS point_balance, IFNULL(exp, 0) AS exp, IFNULL(message_count, 0) AS message_count, members.created_at, GREATEST(IFNULL(members.updated_at, CAST(0 AS DATETIME)), IFNULL(point_updated_at, CAST(0 AS DATETIME)), IFNULL(exp_updated_at, CAST(0 AS DATETIME)), IFNULL(message_updated_at, CAST(0 AS DATETIME))) AS updated_at FROM `members` ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS point_balance, MAX(created_at) AS point_updated_at FROM `points` GROUP BY user_id, guild_id) AS points ON members.user_id = points.user_id AND members.guild_id = points.guild_id ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS exp, MAX(created_at) AS exp_updated_at FROM `experience_points` GROUP BY user_id, guild_id) AS exp ON members.user_id = exp.user_id AND members.guild_id = exp.guild_id  ' +
        'LEFT JOIN (SELECT user_id, guild_id, COUNT(user_id) AS message_count, MAX(created_at) AS message_updated_at FROM `messages` GROUP BY user_id, guild_id) AS messages ON members.user_id = messages.user_id AND members.guild_id = messages.guild_id ' +
        'WHERE members.guild_id = ? AND members.user_id = ?', [guild_id[1], user_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results[0]);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.patch('/:user_id', async (req, res, next) => {
    const user_id = req.params.user_id?.toString().match(regex.id);
    if (!guild_id || !user_id) return next();

    const data = {};

    if (req.body.is_notify === true || req.body.is_notify === false) {
        data.is_notify = Boolean(req.body.is_notify);
    }

    const chain_login = req.body.chain_login?.toString().match(new RE2(/^\d+$/));
    if (chain_login) data.chain_login = Number(chain_login[0]);

    if (!Object.keys(data).length) return badRequest(res, 'Invalid request body');

    pool.query('UPDATE `members` SET ? WHERE `guild_id` = ? AND `user_id` = ?', [data, guild_id[1], user_id[1]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.use('/:user_id/roles', require('./roles.js'));
router.use('/:user_id/points', require('./points.js'));
router.use('/:user_id/messages', require('./messages.js'));
router.use('/:user_id/exp', require('./exp.js'));

module.exports = router;