const replyInteraction = require('../../utils/replyInteraction.js');
module.exports = {
    name: 'button',
    async execute(interaction) {
        const handle = interaction.client.buttonHandles.get(interaction.customId);

        if (!handle) {
            console.log(`No handle matching ${interaction.customId} was found.`);
            return;
        }

        try {
            await handle.execute(interaction);
        } catch (error) {
            console.error(error);
            await replyInteraction.reply(interaction, {
                embeds: [{
                    color: client.colors.danger,
                    title: '予期せぬエラーが発生しました',
                }],
                ephemeral: true
            }).catch(error => console.error(error));
        }
    }
};