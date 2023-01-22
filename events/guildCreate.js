const Discord = require("discord.js");
module.exports = {
    name: Discord.Events.GuildCreate,
    once: false,
    execute(guild) {
        console.log(`id: ${guild.id}\nid: ${guild.id})\nownerId: ${guild.ownerId}`);
    }
};