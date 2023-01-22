const Discord = require("discord.js");
const guildMessageLog = require("../utils/guildMessageLog");
module.exports = {
    name: Discord.Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage) {
        await guildMessageLog.edited(newMessage);
    }
};