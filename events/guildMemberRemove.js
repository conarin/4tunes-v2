const Discord = require("discord.js");
const guildLog = require("../utils/guildLog");
module.exports = {
    name: Discord.Events.GuildMemberRemove,
    once: false,
    async execute(member) {
        await guildLog.guildMemberRemoved(member);
    }
};