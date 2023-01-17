const { SlashCommandBuilder } = require('discord.js');
const Interaction = require('../utils/interaction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pongを返す'),
    async execute(interaction) {
        await Interaction.reply(interaction, {
            content: `Pong!\n**${Math.round(client.ws.ping)}** ms`
        });
    },
};