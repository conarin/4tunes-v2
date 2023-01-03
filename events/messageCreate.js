const Discord = require('discord.js');
const fourTunesAPI = require('../utils/4TunesAPI.js');
module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        const data = {};
        if (message.guild && message.guild?.available) {
            data.guildData = await fourTunesAPI.fetch('/guilds', message.guild.id, {
                guild_id: message.guild.id
            });
            if (data.guildData === undefined) return;

            data.memberData = await fourTunesAPI.fetch(`/guilds/${message.guild.id}/members`, message.author.id, {
                user_id: message.author.id
            });
            if (data.memberData === undefined) return;
        }

        for (const handle of [...client.messageHandles.values()]) {
            try {
                if (handle.guildOnly && !message.guild && !message.guild?.available) continue;
                await handle.execute(message, data);
            } catch (error) {
                console.error(error);
            }
        }
    }
};