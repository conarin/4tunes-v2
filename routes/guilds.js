const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    const guild_id = req.body.guild_id?.toString().match(regex.id);
    if (!guild_id) return badRequest(res, 'Invalid request body');

    pool.query('INSERT INTO `guilds` (`guild_id`) VALUES (?)', [guild_id[1]])
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

router.get('/:guild_id', async (req, res, next) => {
    const guild_id = req.params.guild_id?.toString().match(regex.id);
    if (!guild_id) return next();

    pool.query('SELECT * FROM `guilds` WHERE `guild_id` = ?', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results[0]);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.patch('/:guild_id', async (req, res, next) => {
    const guild_id = req.params.guild_id?.toString().match(regex.id);
    if (!guild_id) return next();

    const data = {};

    const log_channel_id = req.body.log_channel_id?.toString().match(regex.id);
    if (log_channel_id) data.log_channel_id = log_channel_id[1];
    else if (req.body.log_channel_id === null) data.log_channel_id = null;

    const level_up_notice_channel_id = req.body.level_up_notice_channel_id?.toString().match(regex.id);
    if (level_up_notice_channel_id) data.level_up_notice_channel_id = level_up_notice_channel_id[1];
    else if (req.body.level_up_notice_channel_id === null) data.level_up_notice_channel_id = null;
    else if (req.body.level_up_notice_channel_id === '1') data.level_up_notice_channel_id = '1';

    if (req.body.should_keep_roles === true || req.body.should_keep_roles === false) {
        data.should_keep_roles = Boolean(req.body.should_keep_roles);
    }

    if (!Object.keys(data).length) return badRequest(res, 'Invalid request body');

    pool.query('UPDATE `guilds` SET ? WHERE `guild_id` = ?', [data, guild_id[1]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.use('/:guild_id/members', require('./members.js'));
router.use('/:guild_id/ranking', require('./ranking.js'));

module.exports = router;