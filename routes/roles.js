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

    pool.query('SELECT * FROM `roles` WHERE roles.guild_id = ? AND roles.user_id = ?', [guild_id[1], user_id[1]])
        .then(([results]) => {
            console.log(results);
            res.json(results)
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    if (!guild_id || !user_id || !is_existing_user) return next();

    const role_id = req.body.role_id?.toString().match(regex.id);
    if (!role_id) return badRequest(res, 'Invalid request body');

    pool.query('INSERT INTO `roles` (`guild_id`, `user_id`, `role_id`) VALUES (?, ?, ?)', [guild_id[1], user_id[1], role_id[1]])
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

router.delete('/:role_id', (req, res, next) => {
    const role_id = req.params.role_id?.toLowerCase().match(regex.id);
    if (!role_id) return next();

    pool.query('DELETE FROM `roles` WHERE `guild_id` = ? AND `user_id` = ? AND `role_id` = ?', [guild_id[1], user_id[1], role_id[1]])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;