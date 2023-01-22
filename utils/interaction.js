const Discord = require('discord.js');
require('dotenv').config();
const env = process.env;
module.exports = {
    async reply(interaction, options) {
        if (!options) return;

        await interaction.reply({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            ephemeral: options.ephemeral === true
        }).catch(async error => {
            console.error(error);
            console.log('options: ' + JSON.stringify(options, null, 2));
            console.log('interaction.options: ' + JSON.stringify(interaction.options, null, 2));
            console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);

            // let iconURL = client.user.displayAvatarURL({format: 'png', dynamic: true, size: 128}),
            //     channelName = client.user.username,
            //     guildName = 'DM';
            //
            // if (interaction.channel.type !== Discord.ChannelType.DM) {
            //     iconURL = interaction.guild.iconURL({format: 'png', dynamic: true, size: 128});
            //     channelName = interaction.channel.name;
            //     guildName = interaction.guild.name;
            // }
            //
            // const embed = {
            //     color: client.colors.red,
            //     title: `例外発生`,
            //     author: {
            //         name: interaction.user.tag,
            //         icon_url: interaction.user.displayAvatarURL({format: 'png', dynamic: true, size: 128}),
            //         url: interaction.user.displayAvatarURL({format: 'png', dynamic: true, size: 128}),
            //     },
            //     description: `${interaction.commandName}\n\`\`\`${error.stack}\`\`\``,
            //     timestamp: new Date(),
            //     footer: {
            //         text: `\n${channelName} in ${guildName}`,
            //         icon_url: iconURL
            //     }
            // };
            //
            // const logChannel = await client.channels.fetch(env.LOG_CHANNEL_ID).catch(error => console.error(error));
            // const clientApplication = await client.application.fetch();
            // if (logChannel) await logChannel
            //     .send({content:`<@${clientApplication.owner.ownerId || clientApplication.owner.id}>`, embeds: [embed]})
            //     .catch(error => console.error(error));

            await interaction.reply({embeds: [{
                    color: client.colors.red,
                    title: '予期せぬエラーが発生しました',
                }]
            }).catch(err => {
                if (err.message !== 'Missing Permissions') console.log(err.stack);
            });
        });
    },
    async update(interaction, options) {
        if (!options) return;

        await interaction.update({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            ephemeral: options.ephemeral === true,
            allowedMentions: {repliedUser: false}
        }).catch(async error => {
            console.error(error);
            console.log('options: ' + JSON.stringify(options, null, 2));
            console.log('interaction.options: ' + JSON.stringify(interaction.options, null, 2));
            console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);

            await interaction.reply({embeds: [{
                    color: client.colors.red,
                    title: '予期せぬエラーが発生しました',
                }],
                ephemeral: true
            }).catch(err => {
                if (err.message !== 'Missing Permissions') console.log(err.stack);
            });
        });
    }
};