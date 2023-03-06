require('dotenv').config();
const env = process.env;
const Interaction = require('../../utils/interaction.js');
module.exports = {
    name: 'selectMenu',
    async execute(interaction) {
        const handle = interaction.client.selectMenuHandles.get(interaction.customId);

        if (!handle) {
            console.log(`No handle matching ${interaction.customId} was found.`);
            return;
        }

        try {
            await handle.execute(interaction);
        } catch (error) {
            console.error(error);
            console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);
            await Interaction.reply(interaction, {
                embeds: [{
                    color: client.colors.red,
                    title: '予期せぬエラーが発生しました',
                }],
                ephemeral: true
            }).catch(error => console.error(error));
        }
    }
};