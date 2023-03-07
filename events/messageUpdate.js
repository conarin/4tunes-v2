const Discord = require("discord.js");
const guildLog = require("../utils/guildLog");
module.exports = {
    name: Discord.Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage) {
        if (newMessage.guild && newMessage.guild.available) await guildLog.messageUpdated(newMessage);
    }
};