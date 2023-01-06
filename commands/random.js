const { SlashCommandBuilder } = require('discord.js');
const replyInteraction = require('../utils/replyInteraction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('指定したロールからメンバーをランダムに抽出する')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('抽出元のロール')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('抽出する最大人数')
            .setMinValue(1)
            .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.guild.members.fetch();

        const role = interaction.options.getRole('role');
        const number = interaction.options.getInteger('number');
        const roleMemberIds = role.members.map(member => member.id);

        let samples = [];
        if (number < role.members.size) {
            for (let n = 0; n < number; n++) {
                const index = Math.floor(Math.random() * roleMemberIds.length);
                samples.push(roleMemberIds.splice(index, 1)[0]);
            }
        } else {
            samples = roleMemberIds.concat();
        }

        await replyInteraction.reply(interaction, {
            embeds: [{
                color: client.colors.info,
                title: `${role.name}から最大${number}人抽出`,
                description: samples.map(id => `<@${id}>`).join('\n')
            }]
        });
    },
};