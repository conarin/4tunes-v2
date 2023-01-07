const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const replyInteraction = require('../utils/replyInteraction.js');
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('point')
        .setDescription('メンバーのポイントを設定する')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(option => option
            .setName('set')
            .setDescription('指定したポイント数に設定する')
            .addUserOption(option => option
                .setName('member')
                .setDescription('メンバー')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('point')
                .setDescription('設定するポイント数')
                .setRequired(true)
            )
        )
        .addSubcommand(option => option
            .setName('add')
            .setDescription('指定したポイント数加算する')
            .addUserOption(option => option
                .setName('member')
                .setDescription('メンバー')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('point')
                .setDescription('加算するポイント数')
                .setMinValue(1)
                .setRequired(true)
            )
        )
        .addSubcommand(option => option
            .setName('sub')
            .setDescription('指定したポイント数減算する')
            .addUserOption(option => option
                .setName('member')
                .setDescription('メンバー')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('point')
                .setDescription('減算するポイント数')
                .setMinValue(1)
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        let point = interaction.options.getInteger('point');
        const user = interaction.options.getUser('member');

        const memberData = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/members`, user.id, {
            user_id: user.id
        });

        let amount = point;
        if (subcommand === 'set') amount -= memberData.point_balance;
        else if (subcommand === 'sub') amount = -amount;

        await fourTunesAPI.post(`/guilds/${interaction.guild.id}/members/${interaction.user.id}/points`, {
            channel_id: interaction.channel.id,
            message_id: null,
            amount: amount,
            reason: `pointコマンド(${subcommand} ${point})`
        });

        await replyInteraction.reply(interaction, {
            embeds: [{
                color: client.colors.success,
                title: '更新完了',
                description: `${user.tag}のポイントを **${memberData.point_balance}** → **${memberData.point_balance + amount}** に更新しました`
            }]
        });
    }
};