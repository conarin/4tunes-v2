const Discord = require("discord.js");
const replyInteraction = require('../utils/replyInteraction.js');
module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await replyInteraction.reply(interaction, {
                embeds: [{
                    color: 0xf04747,
                    title: '予期せぬエラーが発生しました',
                }]
            }).catch(error => console.error(error));
        }
    }
};