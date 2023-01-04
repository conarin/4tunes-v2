const { SlashCommandBuilder } = require('discord.js');
const replyInteraction = require('../utils/replyInteraction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pongを返します'),
    async execute(interaction) {
        await replyInteraction.reply(interaction, {
            content: `Pong!\n**${Math.round(client.ws.ping)}** ms`
        });
    },
};