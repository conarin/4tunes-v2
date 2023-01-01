const Discord = require('discord.js');
module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        for (const handle of [...client.messageHandles.values()]) {
            await handle.execute(message);
        }
    }
};