const Discord = require('discord.js');
const fourTunesAPI = require('../utils/4TunesAPI.js');
const Message = require("../utils/message");
require('dotenv').config();
const env = process.env;
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
                console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);
                try {
                    await Message.send(message, message.channel, {
                        embeds: [{
                            color: client.colors.red,
                            title: '予期せぬ例外が発生しました',
                        }]
                    });
                } catch (err) {
                    if (err.message !== 'Missing Permissions') console.log(err.stack);
                }
            }
        }
    }
};