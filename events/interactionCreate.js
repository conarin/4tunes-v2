const Discord = require("discord.js");
const chatInputCommand = require('../events/interactionCreate/chatInputCommand.js');
const button = require('../events/interactionCreate/button.js');
const selectMenu = require('./interactionCreate/selectMenu.js');
module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) await chatInputCommand.execute(interaction);
        else if (interaction.isButton()) await button.execute(interaction);
        else if (interaction.isStringSelectMenu()) await selectMenu.execute(interaction);
    }
};