const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Interaction = require('../utils/interaction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('メッセージを指定数削除する')
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('削除する件数')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const number = Math.floor(interaction.options.getInteger('number'));

        interaction.channel.bulkDelete(number, true)
            .then(messages => {
                Interaction.reply(interaction, {
                    embeds: [{
                        title: '成功しました',
                        description: `${messages.size} 件のメッセージを削除しました`,
                        color: client.colors.success
                    }],
                    ephemeral: true
                });
            })
            .catch(error => {
                console.error(error);
                Interaction.reply(interaction, {
                    embeds: [{
                        title: '失敗しました',
                        description: error.status === 403 ?
                            'メッセージ管理権限がないため削除できませんでした' : '適切な権限が付与されているか確認してください',
                        color: client.colors.danger
                    }],
                    ephemeral: true
                });
            });
    },
};