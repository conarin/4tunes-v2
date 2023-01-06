const express = require('express');
const router = express.Router();

let guild_id;

router.use((req, res, next) => {
    guild_id = req.baseUrl
        .replace('/guilds/', '')
        .replace('/ranking', '')
        .match(regex.id);
    next();
});

router.get('/point', async (req, res, next) => {
    if (!guild_id) return next();

    pool.query('SELECT members.user_id, IFNULL(point_balance, 0) AS point_balance, RANK() OVER w AS `rank` FROM `members` ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS point_balance, MAX(created_at) AS point_updated_at FROM `points` GROUP BY user_id, guild_id) AS points ON members.user_id = points.user_id AND members.guild_id = points.guild_id ' +
        'WHERE members.guild_id = ? WINDOW w AS (ORDER BY point_balance DESC)', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.get('/message', async (req, res, next) => {
    if (!guild_id) return next();

    pool.query('SELECT members.user_id, IFNULL(message_count, 0) AS message_count, RANK() OVER w AS `rank` FROM `members` ' +
        'LEFT JOIN (SELECT user_id, guild_id, COUNT(user_id) AS message_count, MAX(created_at) AS message_updated_at FROM `messages` GROUP BY user_id, guild_id) AS messages ON members.user_id = messages.user_id AND members.guild_id = messages.guild_id ' +
        'WHERE members.guild_id = ? WINDOW w AS (ORDER BY message_count DESC)', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.get('/exp', async (req, res, next) => {
    if (!guild_id) return next();

    pool.query('SELECT members.user_id, IFNULL(exp, 0) AS exp, RANK() OVER w AS `rank` FROM `members` ' +
        'LEFT JOIN (SELECT user_id, guild_id, SUM(amount) AS exp, MAX(created_at) AS exp_updated_at FROM `experience_points` GROUP BY user_id, guild_id) AS exp ON members.user_id = exp.user_id AND members.guild_id = exp.guild_id  ' +
        'WHERE members.guild_id = ? WINDOW w AS (ORDER BY exp DESC)', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;