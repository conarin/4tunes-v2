const { SlashCommandBuilder } = require('discord.js');
const replyInteraction = require('../utils/replyInteraction.js');
const fourTunesAPI = require("../utils/4TunesAPI");
const exp = require("../utils/exp.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('メンバーの経験値や発言数などを表示する')
        .addUserOption(option => option
            .setName('member')
            .setDescription('表示したいメンバー')
            .setRequired(false)
        )
        .setDMPermission(false),
    async execute(interaction) {
        let user = interaction.options.getUser('member');
        if (!user) user = interaction.user;

        const memberData = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/members`, user.id);
        if (memberData === undefined) {
            await replyInteraction.reply(interaction, {
                embeds: [{
                    color: client.colors.warning,
                    title: 'メンバーデータがありません',
                    description: `${user.tag}のデータはまだありません`
                }]
            });
        } else {
            await replyInteraction.reply(interaction, {
                embeds: [{
                    author: {
                        name: user.tag,
                        icon_url: user.displayAvatarURL({format: 'png', dynamic: true, size: 128}),
                    },
                    fields: [
                        {
                            name: 'ポイント',
                            value: memberData.point_balance,
                            inline: true,
                        },
                        {
                            name: '発言数',
                            value: memberData.message_count,
                            inline: true,
                        },
                        {
                            name: '経験値',
                            value: `${memberData.exp} (Lv${exp.toLevel(memberData.exp)})`,
                            inline: true,
                        },
                        {
                            name: '連続ログイン日数',
                            value: memberData.chain_login,
                            inline: true,
                        }
                    ]
                }]
            });
        }
    }
};