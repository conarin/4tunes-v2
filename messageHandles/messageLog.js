const guildMessageLog = require('../utils/guildMessageLog.js');
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    name: 'messageLog',
    guildOnly: true,
    async execute(message, data) {
        await fourTunesAPI.post(`/guilds/${message.guild.id}/members/${message.author.id}/messages`, {
            channel_id: message.channel.id,
            message_id: message.id
        });

        await guildMessageLog.execute(message, data.guildData.log_channel_id, client.colors.success);
    }
};
