const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder  } = require('discord.js');
const Interaction = require('../utils/interaction.js');
const fourTunesAPI = require("../utils/4TunesAPI.js");
const Color = require("../utils/color.js");
const Message = require('../utils/message.js');
const Messages = require('../utils/messages.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolepanel')
        .setDescription('ロールパネルを設定する')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(option => option
            .setName('create')
            .setDescription('ロールパネルを作成する')
            .addStringOption(option => option
                .setName('title')
                .setDescription('タイトル')
                .setMaxLength(256)
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('color')
                .setDescription('HEXカラーコード(#000000)')
                .setMaxLength(7)
                .setRequired(false)
            )
        )
        .addSubcommand(option => option
            .setName('edit')
            .setDescription('ロールパネルを編集する')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ロールパネルID')
                .setMinValue(1)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('title')
                .setDescription('タイトル')
                .setMaxLength(256)
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('color')
                .setDescription('HEXカラーコード(#000000)')
                .setMaxLength(7)
                .setRequired(false)
            )
        )
        .addSubcommand(option => option
            .setName('add')
            .setDescription('ロールを追加する')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ロールパネルID')
                .setMinValue(1)
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('追加するロール')
                .setRequired(true)
            )
        )
        .addSubcommand(option => option
            .setName('remove')
            .setDescription('ロールを除去する')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ロールパネルID')
                .setMinValue(1)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('number')
                .setDescription('除去するロール番号(1~15)')
                .setMinValue(1)
                .setMaxValue(15)
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const id = interaction.options.getInteger('id');
        let title = interaction.options.getString('title')?.toString().trim();
        let color = interaction.options.getString('color')?.toString().trim();

        if (subcommand === 'create') {
            if (!title) title = 'Role Panel'
            color = Color.rgb2hex(Color.hex2rgb(color || '1e1f22'));

            const replyMessage = await Interaction.deferReply(interaction, {fetchReply: true});

            const status = await fourTunesAPI.post(`/guilds/${interaction.guild.id}/role-panels`, {
                channel_id: interaction.channel.id,
                message_id: replyMessage.id,
                title: title || null,
                color: color || null
            });

            if (status !== 201) {
                await Interaction.editReply(interaction, {
                    embeds: [{
                        color: client.colors.red,
                        title: '作成失敗',
                        description: `ロールパネルの作成に失敗しました。`
                    }],
                    ephemeral: true
                });
                return;
            }

            const rolePanels = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}`, 'role-panels');
            const panel = rolePanels.find(panel => panel.channel_id === interaction.channel.id && panel.message_id === replyMessage.id);

            await Interaction.editReply(interaction, {
                embeds: [{
                    color: parseInt(color.toString(), 16) || 0,
                    title: title,
                    description: '設定されているロールはありません。',
                    footer: {text: `id: ${panel.id}`}
                }]
            });
        } else {
            let rolePanels = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}`, 'role-panels');
            let panel = rolePanels.find(panel => panel.id === id);
            if (!panel) {
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.orange,
                        title: 'ロールパネルの操作ができません',
                        description: `指定されたid(${id})のロールパネルはありません。`
                    }],
                    ephemeral: true
                });
                return;
            }

            const res = (await Messages.fetch(`https://discord.com/channels/${panel.guild_id}/${panel.channel_id}/${panel.message_id}`))[0];
            if (res.status !== 200) {
                console.log('rolePanel');
                console.log(res);
                const reason = res.status === 404 ? 'が削除されています' :
                    res.status === 403 ? 'を取得する権限がありません' : 'の取得に失敗しました';
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.orange,
                        title: 'ロールパネルの操作ができません',
                        description: `ロールパネルのメッセージ${reason}。`
                    }],
                    ephemeral: true
                });
                return;
            }

            const message = res.message;

            if (interaction.guild.id !== panel.guild_id || !message.editable) {
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.orange,
                        title: 'ロールパネルの操作ができません',
                        description: 'ロールパネルのメッセージを編集することができません。'
                    }],
                    ephemeral: true
                });
                return;
            }

            if (subcommand === 'edit') {
                if (!title && !color) {
                    await Interaction.reply(interaction, {
                        embeds: [{
                            color: client.colors.orange,
                            title: 'オプションを入力してください',
                            description: '`title`か`color`のいずれか1つ以上は入力してください。'
                        }],
                        ephemeral: true
                    });
                    return;
                }

                await fourTunesAPI.patch(`/guilds/${interaction.guild.id}/role-panels/${id}`, {
                    title: title,
                    color: color
                });
            } else if (subcommand === 'add') {
                const roles = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/role-panels`, panel.id);
                if (roles && roles.length >= 15) {
                    await Interaction.reply(interaction, {
                        embeds: [{
                            color: client.colors.orange,
                            description: `15個より多く設定することはできません。`
                        }],
                        ephemeral: true
                    });
                    return;
                }

                const role = interaction.options.getRole('role');
                const status = await fourTunesAPI.post(`/guilds/${interaction.guild.id}/role-panels/${id}`, {
                    role_id: role.id
                });

                if (status === 409) {
                    await Interaction.reply(interaction, {
                        embeds: [{
                            color: client.colors.orange,
                            description: `<@&${role.id}>は既に追加されています。`
                        }],
                        ephemeral: true
                    });
                    return;
                }
            } else if (subcommand === 'remove') {
                const removeNumber = interaction.options.getInteger('number');
                const roles = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/role-panels`, panel.id);
                if (!roles || removeNumber > roles.length) {
                    await Interaction.reply(interaction, {
                        embeds: [{
                            color: client.colors.orange,
                            description: `${removeNumber}番目のロールは設定されていません。`
                        }],
                        ephemeral: true
                    });
                    return;
                }

                await fourTunesAPI.delete(`/guilds/${interaction.guild.id}/role-panels/${id}/${roles[removeNumber - 1]}`);
            }

            rolePanels = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}`, 'role-panels');
            panel = rolePanels.find(panel => panel.id === id);

            const emoji = [
                '1⃣', '2⃣', '3⃣', '4⃣', '5⃣',
                '6⃣', '7⃣', '8⃣', '9⃣', '🔟',
                '<:eleven:1082260217292660797>',
                '<:twelve:1082260282929328138>',
                '<:thirteen:1082260280265937008>',
                '<:fourteen:1082260350579245058>',
                '<:fifteen:1082260353888559155>'
            ];
            const panelRoles = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/role-panels`, panel.id);
            const guildRoles = await interaction.guild.roles.fetch().catch(console.error);
            const options = [];
            const description = panelRoles?.map((roleId, index) => {
                options.push({
                    label: guildRoles.get(roleId)?.name || '削除済みのロール',
                    emoji: emoji[index],
                    value: roleId,
                });
                return `${emoji[index]}<@&${roleId}>`;
            }).join('\n');

            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('rolePanel')
                    .setPlaceholder('付与/剥奪するロールを選択')
                    .addOptions(...options)
            );

            await Message.edit(message, {
                embeds: [{
                    color: parseInt(panel.color, 16) || 0,
                    title: panel.title,
                    description: description || '設定されているロールはありません。',
                    footer: {text: `id: ${panel.id}`}
                }],
                components: [row]
            });

            await Interaction.reply(interaction, {
                embeds: [{
                    color: client.colors.green,
                    title: '更新完了',
                    description: `[ロールパネル](https://discord.com/channels/${panel.guild_id}/${panel.channel_id}/${panel.message_id})を更新しました。`
                }],
                ephemeral: true
            });
        }
    }
};