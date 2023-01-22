const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {table} = require("table");
const RE2 = require('re2');
const exp = require("./exp");
const fourTunesAPI = require("./4TunesAPI");
const Interaction = require('./interaction.js');
module.exports = {
    limit: 10,
    types: [
        {type: 'point', name: 'ポイント'},
        {type: 'message', name: 'メッセージ'},
        {type: 'exp', name: '経験値'}
    ],
    async table(ranks, type, currentPage = 1, limit = this.limit) {
        let offset = 0;
        if (currentPage) offset = (currentPage - 1) * limit;
        if (ranks.length <= offset) {
            offset = (Math.ceil(ranks.length / limit) - 1) * limit;
        }

        const rows = (await Promise.all(
            ranks
                .slice(offset, offset + limit)
                .map(async rank => {
                    const user = await client.users.fetch(rank.user_id).catch(error => console.error(error));

                    let score;
                    if (type === 'point') score = rank.point_balance;
                    else if (type === 'message') score = rank.message_count;
                    else if (type === 'exp') score = `${rank.exp}(Lv${exp.toLevel(rank.exp)})`;
                    return [rank.rank, `${user?.username || '削除済みのユーザー'}\n${score}`];
                })
        ));

        return table(rows, {
            border: {
                topBody: '',
                topJoin: '',
                topLeft: '',
                topRight: '',

                bottomBody: '',
                bottomJoin: '',
                bottomLeft: '',
                bottomRight: '',

                bodyLeft: '',
                bodyRight: '',
                bodyJoin: '│',

                joinBody: `─`,
                joinLeft: '',
                joinRight: '',
                joinJoin: '┼',
                joinMiddleDown: '',
                joinMiddleUp: '',
                joinMiddleLeft: '',
                joinMiddleRight: '',
            }
        });
    },
    async pagination(interaction) {
        const rankingType = this.types.find(type => interaction.message.embeds[0].title.startsWith(type.name)) || this.types[0];

        const ranks = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/ranking`, rankingType.type);
        if (!ranks || !ranks?.length) {
            await Interaction.update(interaction, {
                embeds: [{
                    title: `${rankingType.name}ランキング`,
                    description: `メンバーのデータがまだありません`,
                    footer: {text: '1/1'},
                    color: client.colors.blue
                }]
            });
            return;
        }

        const totalPages = Math.ceil(ranks.length / this.limit);

        let currentPage = Number(interaction.message.embeds[0].footer.text.match(new RE2(/^[0-9]*/g))[0]) || 1;
        if (interaction.customId === 'previousRanking') currentPage--;
        else if (interaction.customId === 'nextRanking') currentPage++;
        if (currentPage <= 0) currentPage = totalPages;
        else if (currentPage > totalPages) currentPage = 1;

        const resTable = await this.table(ranks, rankingType.type, currentPage);

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

        await Interaction.update(interaction, {
            embeds: [{
                title: `${rankingType.name}ランキング`,
                description: '```\n‌' + resTable + '\n```',
                footer: {text: `${currentPage}/${Math.ceil(ranks.length / this.limit)}`},
                color: client.colors.blue
            }],
            components: [row]
        });
    }
};
