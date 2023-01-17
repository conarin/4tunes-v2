require('dotenv').config();
const env = process.env;
const Interaction = require('../../utils/interaction.js');
module.exports = {
    name: 'chatInputCommand',
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);
            await Interaction.reply(interaction, {
                embeds: [{
                    color: client.colors.danger,
                    title: '予期せぬエラーが発生しました',
                }]
            }).catch(error => console.error(error));
        }
    }
};