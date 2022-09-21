const express = require('express');
const router = express.Router();

const checkUserId = async (id, next) => {
    const user_id = id?.toString().match(regex.id);
    if (!user_id) {
        next();
        return null;
    }

    return await client.users.fetch(user_id[1])
        .then(() => {
            return user_id[1];
        })
        .catch(err => {
            if (err.httpStatus === 404) {
                return null;
            } else {
                next(err);
                return null;
            }
        });
}

router.get('/:user_id/minecraft', async (req, res, next) => {
    const user_id = await checkUserId(req.params.user_id, next);
    if (!user_id) return next();

    pool.query('SELECT * FROM `minecraft` WHERE `user_id` = ?', [user_id])
        .then(([results]) => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:user_id/guilds', async (req, res, next) => {
    const user_id = await checkUserId(req.params.user_id, next);
    if (!user_id) return next();

    pool.query('SELECT `guild_id` FROM `members` WHERE `user_id` = ?', [user_id])
        .then(([results]) => {
            res.json(results.map(guild => guild.guild_id));
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;