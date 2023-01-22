const Discord = require("discord.js");
const guildLog = require("../utils/guildLog");
module.exports = {
    name: Discord.Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage) {
        await guildLog.messageUpdated(newMessage);
    }
};