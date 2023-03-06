const Interaction = require("../utils/interaction");
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    name: 'rolePanel',
    async execute(interaction) {
        // Discord側で検証されているのであれば不要？
        const rolePanels = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}`, 'role-panels');
        const panel = rolePanels.find(panel =>
            panel.channel_id === interaction.channel.id && panel.message_id === interaction.message.id
        );
        if (!panel) {
            await Interaction.reply(interaction, {
                embeds: [{
                    color: client.colors.orange,
                    title: 'ロールパネルが見つかりません。',
                }],
                ephemeral: true
            });
            return;
        }

        const roleId = interaction.values[0];

        const roles = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/role-panels`, panel.id);
        if (!roles || !roles.includes(roleId)) {
            await Interaction.reply(interaction, {
                embeds: [{
                    color: client.colors.orange,
                    description: '指定されたロールは登録されていません。'
                }],
                ephemeral: true
            });
            return;
        }

        const isRoleAdded = Boolean(interaction.member.roles.cache.get(roleId));
        try {
            if (isRoleAdded) {
                await interaction.member.roles.remove(roleId, 'ロールパネルを使用');
            } else {
                await interaction.member.roles.add(roleId, 'ロールパネルを使用');
            }
        } catch (error) {
            if (error.status === 404) {
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.orange,
                        description: '削除済みのロールです。'
                    }],
                    ephemeral: true
                });
            } else if (error.status === 403) {
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.orange,
                        description: '権限がありません。`ロールの管理`権限を与えてください。'
                    }],
                    ephemeral: true
                });
            } else {
                console.error(error);
                await Interaction.reply(interaction, {
                    embeds: [{
                        color: client.colors.red,
                        description: `<@&${roleId}>の${isRoleAdded ? '剥奪' : '付与'}に失敗しました。`
                    }],
                    ephemeral: true
                });
            }
            return;
        }

        await Interaction.reply(interaction, {
            embeds: [{
                color: client.colors.green,
                description: `<@&${roleId}>を${isRoleAdded ? '剥奪' : '付与'}しました。`
            }],
            ephemeral: true
        });
    }
};