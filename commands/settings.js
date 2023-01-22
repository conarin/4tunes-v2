const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Interaction = require('../utils/interaction.js');
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('ギルドの設定')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommandGroup(option => option
            .setName('set')
            .setDescription('設定する')
            .addSubcommand(option => option
                .setName('log')
                .setDescription('メッセージ、入退出のログを記録する')
                .addIntegerOption(option => option
                    .setName('choices')
                    .setDescription('通知の送信先の設定')
                    .setRequired(true)
                    .addChoices(
                        {name: '❌送信しない', value: 0},
                        {name: '指定したチャンネル', value: 1}
                    )
                )
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('送信先チャンネル(「指定したチャンネル」を選択した場合のみ)')
                    .addChannelTypes(ChannelType.GuildText)
                )
            )
            .addSubcommand(option => option
                .setName('level_up')
                .setDescription('レベルアップ通知')
                .addIntegerOption(option => option
                    .setName('choices')
                    .setDescription('通知の送信先の設定')
                    .setRequired(true)
                    .addChoices(
                        {name: '❌送信しない', value: 0},
                        {name: '指定したチャンネル', value: 1},
                        {name: '同じチャンネル', value: 2}
                    )
                )
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('送信先チャンネル(「指定したチャンネル」を選択した場合のみ)')
                    .addChannelTypes(ChannelType.GuildText)
                )
            )
        )
        .addSubcommand(option => option
            .setName('show')
            .setDescription('設定を表示する')
        ),
    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const choicesNumber = interaction.options.getInteger('choices');
        let channel = interaction.options.getChannel('channel');

        if (subcommandGroup === 'set') {
            let replyMessage;
            if (choicesNumber === 0) { // 送信しない
                channel = null;
                replyMessage = '`送信しない`';
            } else if (choicesNumber === 1) { // 指定したチャンネル
                if (!channel) {
                    await Interaction.reply(interaction, {
                        embeds: [{
                            title: 'チャンネルが指定されていません',
                            description: '送信先のチャンネルを指定してください',
                            color: client.colors.orange
                        }]
                    });
                    return;
                }
                channel = channel.id;
                replyMessage = `<#${channel}>`;
            } else if (choicesNumber === 2) { // 同じチャンネル
                channel = '1';
                replyMessage = '`同じチャンネル`';
            }

            if (subcommand === 'log') {
                await fourTunesAPI.patch(`/guilds/${interaction.guild.id}`, {
                    log_channel_id: channel
                });
                replyMessage = 'ログの送信先を' + replyMessage;
            } else if (subcommand === 'level_up') {
                await fourTunesAPI.patch(`/guilds/${interaction.guild.id}`, {
                    level_up_notice_channel_id: channel
                });
                replyMessage = 'レベルアップの通知先を' + replyMessage;
            }

            await Interaction.reply(interaction, {
                embeds: [{
                    title: '設定完了',
                    description: `${replyMessage}に設定しました`,
                    color: client.colors.green
                }]
            });
        } else if (subcommand === 'show') {
            const guildData = await fourTunesAPI.fetch('/guilds', interaction.guild.id, {
                guild_id: interaction.guild.id
            });
            if (guildData === undefined) return;

            const logChannel = guildData.log_channel_id === null ? '送信しない' : `<#${guildData.log_channel_id}>`;
            const levelUpChannel = guildData.level_up_notice_channel_id === null ? '送信しない' :
                guildData.level_up_notice_channel_id === '1' ? '同じチャンネル' : `<#${guildData.level_up_notice_channel_id}>`;

            await Interaction.reply(interaction, {
                embeds: [{
                    author: {
                        name: interaction.guild.name,
                        icon_url: interaction.guild.iconURL({format: 'png', dynamic: true, size: 128}),
                    },
                    fields: [
                        {
                            name: 'ログ',
                            value: logChannel,
                            inline: true,
                        },
                        {
                            name: 'レベルアップ',
                            value: levelUpChannel,
                            inline: true,
                        }
                    ],
                    color: client.colors.blue
                }]
            });
        }
    }
};