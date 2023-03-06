const express = require('express');
const router = express.Router();
const RE2 = require('re2');
const Color = require('../utils/color.js');

let guild_id;

router.use((req, res, next) => {
    guild_id = req.baseUrl
        .replace('/guilds/', '')
        .replace('/role-panels', '')
        .match(regex.id);
    next();
});

router.get('/', async (req, res, next) => {
    if (!guild_id) return next();

    pool.query('SELECT * FROM role_panels WHERE guild_id = ? ORDER BY created_at ASC', [guild_id[1]])
        .then(([results]) => {
            if (results.length) res.json(results);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    if (!guild_id) return next();

    const data = {
        guild_id: guild_id[1],
        channel_id: null,
        message_id: null,
        title: null,
        color: null
    };

    const channel_id = typeof req.body.channel_id === 'string' && req.body.channel_id?.toString().match(regex.id);
    if (channel_id) data.channel_id = channel_id[1];
    else return badRequest(res, 'Invalid request body');

    const message_id = typeof req.body.message_id === 'string' && req.body.message_id?.toString().match(regex.id);
    if (message_id) data.message_id = message_id[1];
    else return badRequest(res, 'Invalid request body');

    const title = typeof req.body.title === 'string' && req.body.title?.toString().trim().match(new RE2(/^.{1,256}$/));
    if (title) data.title = title[0];

    data.color = Color.rgb2hex(Color.hex2rgb(typeof req.body.color === 'string' && req.body.color?.toString().trim() || '1e1f22'));

    pool.query('INSERT INTO `role_panels` SET ?', [data])
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

router.get('/:panel_id', async (req, res, next) => {
    if (!guild_id) return next();

    const panel_id = typeof req.params.panel_id === 'string' && req.params.panel_id?.toString().match(new RE2(/^\d+$/));
    if (!panel_id) return next();

    pool.query('SELECT rp.id, rpd.role_id FROM role_panels AS rp ' +
        'INNER JOIN role_panel_details AS rpd ON rp.id = rpd.id ' +
        'WHERE rp.guild_id = ? AND rp.id = ? ' +
        'ORDER BY rpd.created_at ASC', [guild_id[1], panel_id[0]])
        .then(([results]) => {
            if (results.length) res.json(results.map(row => row.role_id));
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.post('/:panel_id', async (req, res, next) => {
    if (!guild_id) return next();

    const panel_id = typeof req.params.panel_id === 'string' && req.params.panel_id?.toString().match(new RE2(/^\d+$/));
    if (!panel_id) return next();

    const data = {
        id: Number(panel_id),
        role_id: null
    };

    const role_id = typeof req.body.role_id === 'string' && req.body.role_id?.toString().match(regex.id);
    if (role_id) data.role_id = role_id[1];
    else return badRequest(res, 'Invalid request body');

    pool.query('INSERT INTO `role_panel_details` SET ?', [data])
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

router.patch('/:panel_id', async (req, res, next) => {
    const panel_id = typeof req.params.panel_id === 'string' && req.params.panel_id?.toString().match(new RE2(/^\d+$/));
    if (!guild_id || !panel_id) return next();

    const data = {};

    const title = typeof req.body.title === 'string' && req.body.title?.toString().trim().match(new RE2(/^.{1,256}$/));
    if (title) data.title = title[0];

    const color = typeof req.body.color === 'string' && req.body.color?.toString().trim().match(regex.hexColor);
    if (color) data.color = Color.rgb2hex(Color.hex2rgb(color[0] || '1e1f22'));

    if (!Object.keys(data).length) return badRequest(res, 'Invalid request body');

    pool.query('UPDATE `role_panels` SET ? WHERE `guild_id` = ? AND `id` = ?', [data, guild_id[1], panel_id[0]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.delete('/:panel_id', async (req, res, next) => {
    const panel_id = typeof req.params.panel_id === 'string' && req.params.panel_id?.toString().match(new RE2(/^\d+$/));
    if (!guild_id || !panel_id) return next();

    pool.query('DELETE FROM `role_panels` WHERE `guild_id` = ? AND `id` = ?', [guild_id[1], panel_id[0]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.delete('/:panel_id/:role_id', async (req, res, next) => {
    const panel_id = typeof req.params.panel_id === 'string' && req.params.panel_id?.toString().match(new RE2(/^\d+$/));
    const role_id = typeof req.params.role_id === 'string' && req.params.role_id?.toString().match(regex.id);
    if (!guild_id || !panel_id || !role_id) return next();

    pool.query('DELETE FROM `role_panel_details` WHERE `id` = ? AND `role_id` = ?', [panel_id[0], role_id[1]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;