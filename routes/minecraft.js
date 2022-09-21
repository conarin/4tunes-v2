const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    const uuid = req.body.uuid?.toString().toLowerCase().match(regex.uuid);
    const user_id = req.body.user_id?.toString().match(regex.id);
    if (!uuid || !user_id) return badRequest(res, 'Invalid request body');


    const data = {
        uuid: `${uuid[1]}-${uuid[2]}-${uuid[3]}-${uuid[4]}-${uuid[5]}`,
        user_id: user_id[1]
    };

    pool.query('INSERT INTO `minecraft` SET ?', data)
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

router.get('/:uuid', (req, res, next) => {
    const uuid = req.params.uuid?.toLowerCase().match(regex.uuid);
    if (!uuid) return next();

    pool.query('SELECT * FROM `minecraft` WHERE `uuid` = ?', [`${uuid[1]}-${uuid[2]}-${uuid[3]}-${uuid[4]}-${uuid[5]}`])
        .then(([results]) => {
            if (results.length) res.json(results[0]);
            else next();
        })
        .catch(err => {
            next(err);
        });
});

router.delete('/:uuid', (req, res, next) => {
    const uuid = req.params.uuid?.toLowerCase().match(regex.uuid);
    if (!uuid) return next();

    pool.query('DELETE FROM `minecraft` WHERE `uuid` = ?', [`${uuid[1]}-${uuid[2]}-${uuid[3]}-${uuid[4]}-${uuid[5]}`])
        .then(([results]) => {
            if (results.affectedRows) res.status(204).end();
            else next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;