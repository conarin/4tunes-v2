const Discord = require("discord.js");
const guildMessageLog = require("../utils/guildMessageLog");
module.exports = {
    name: Discord.Events.MessageDelete,
    once: false,
    async execute(message) {
        await guildMessageLog.deleted(message);
    }
};