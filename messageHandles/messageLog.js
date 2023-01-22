const guildLog = require('../utils/guildLog.js');
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    name: 'messageLog',
    guildOnly: true,
    async execute(message) {
        await fourTunesAPI.post(`/guilds/${message.guild.id}/members/${message.author.id}/messages`, {
            channel_id: message.channel.id,
            message_id: message.id
        });

        await guildLog.messageCreated(message);
    }
};
