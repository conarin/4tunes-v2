const RE2 = require('re2');
module.exports = async (baseUrl) => {
    const data = {
        guild_id: null,
        user_id: null,
        is_existing_user: false,
        error: null
    }

    data.guild_id = baseUrl.match(new RE2(/\/guilds\/([0-9]{17,19})\//));
    data.user_id = baseUrl.match(new RE2(/\/members\/([0-9]{17,19})\//));

    if (!data.guild_id || !data.user_id) return data;

    await pool.query('SELECT members.user_id FROM `members` WHERE members.guild_id = ? AND members.user_id = ?', [data.guild_id[1], data.user_id[1]])
        .then(([results]) => {
            data.is_existing_user = Boolean(results.length);
        })
        .catch(err => {
            data.error = err;
        });

    return data;
}