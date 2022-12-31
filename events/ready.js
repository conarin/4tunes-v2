const Discord = require("discord.js");
module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    execute() {
        console.log('ready: 4Tunes');
        require('../api.js');
    }
};