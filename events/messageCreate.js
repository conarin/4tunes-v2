const Discord = require("discord.js");
module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(message) {
        [...client.messageHandles.values()].forEach(handle => {
            handle.execute(message);
        });
    }
};