const Discord = require("discord.js");
const guildLog = require("../utils/guildLog");
module.exports = {
    name: Discord.Events.MessageDelete,
    once: false,
    async execute(message) {
        if (message.guild && message.guild.available) await guildLog.messageDeleted(message);
    }
};