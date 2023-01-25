const Discord = require("discord.js");
const guildLog = require("../utils/guildLog");
module.exports = {
    name: Discord.Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        await guildLog.guildMemberAdded(member);
    }
};