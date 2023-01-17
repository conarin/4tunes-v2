const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const replyInteraction = require('../utils/replyInteraction.js');
const ranking = require("../utils/ranking.js");
const fourTunesAPI = require("../utils/4TunesAPI");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('ランキング')
        .setDMPermission(false)
        .addSubcommand(option => option
            .setName('point')
            .setDescription('ポイントランキングを表示する')
            .addIntegerOption(option => option
                .setName('page')
                .setDescription('表示するページ番号')
                .setMinValue(1)
            )
        )
        .addSubcommand(option => option
            .setName('message')
            .setDescription('発言数ランキングを表示する')
            .addIntegerOption(option => option
                .setName('page')
                .setDescription('表示するページ数')
                .setMinValue(1)
            )
        )
        .addSubcommand(option => option
            .setName('exp')
            .setDescription('経験値ランキングを表示する')
            .addIntegerOption(option => option
                .setName('page')
                .setDescription('表示するページ数')
                .setMinValue(1)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const rankingName = ranking.types.find(type => type.type === subcommand)?.name || '？？？';
        const currentPage = interaction.options.getInteger('page') || 1;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previousRanking')
                    .setEmoji('◀')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('nextRanking')
                    .setEmoji('▶')
                    .setStyle(ButtonStyle.Primary)
            );

        const ranks = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/ranking`, subcommand);
        if (!ranks || !ranks?.length) {
            await replyInteraction.reply(interaction, {
                embeds: [{
                    title: `${rankingName}ランキング`,
                    description: `メンバーのデータがまだありません`,
                    footer: {text: '1/1'},
                    color: client.colors.info
                }],
                components: [row]
            });
            return;
        }

        const resTable = await ranking.table(ranks, subcommand, currentPage, ranking.limit);

        await replyInteraction.reply(interaction, {
            embeds: [{
                title: `${rankingName}ランキング`,
                description: '```\n‌' + resTable + '\n```',
                footer: {text: `${currentPage}/${Math.ceil(ranks.length / ranking.limit)}`},
                color: client.colors.info
            }],
            components: [row]
        });
    }
};