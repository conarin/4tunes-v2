const Discord = require("discord.js");
module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        [...client.messageHandles.values()].forEach(handle => {
            handle.execute(message);
        });
    }
};