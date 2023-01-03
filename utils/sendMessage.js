const Discord = require('discord.js');
require('dotenv').config();
const env = process.env;
module.exports = {
    name: 'sendMessage',
    async send(message, options) {
        if (!options) return;

        const replyOptions = message.channel.type === Discord.ChannelType.DM ?
            {messageReference: message.id, failIfNotExists: false} :
            message.channel.permissionsFor(client.user).has(Discord.PermissionsBitField.Flags.ReadMessageHistory) ?
                {messageReference: message.id, failIfNotExists: false} : false;

        await message.channel.send({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            stickers: options.stickers !== undefined && typeof options.stickers === 'object' ? options.stickers : null,
            reply: replyOptions,
            allowedMentions: {repliedUser: false}
        }).catch(async error => {
            console.error(error);
            console.log('options: ' + JSON.stringify(options, null, 2));

            let iconURL = client.user.avatarURL({format: 'png', dynamic: true, size: 128}),
                channelName = client.user.username,
                guildName = 'DM';

            if (message.channel.type !== Discord.ChannelType.DM) {
                iconURL = message.guild.iconURL({format: 'png', dynamic: true, size: 128});
                channelName = message.channel.name;
                guildName = message.guild.name;
            }

            const embed = {
                color: 0xf04747,
                title: `例外発生`,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 128}),
                    url: message.author.avatarURL({format: 'png', dynamic: true, size: 128}),
                },
                description: `${message.content}\n\`\`\`${error.stack}\`\`\``,
                timestamp: new Date(),
                footer: {
                    text: `\n${channelName} in ${guildName}`,
                    icon_url: iconURL
                }
            };
            console.log(embed);

            const logChannel = await client.channels.fetch(env.LOG_CHANNEL_ID);
            const clientApplication = await client.application.fetch();
            if (logChannel) await logChannel
                .send({content:`<@${clientApplication.owner.ownerId || clientApplication.owner.id}>`, embeds: [embed]})
                .catch(error => console.error(error));

            await message.channel.send({embeds: [{
                    color: 0xf04747,
                    title: '予期しない例外が発生しました',
                }],
                reply: replyOptions,
                allowedMentions: {repliedUser: false}
            }).catch(err => {
                if (err.message !== 'Missing Permissions') console.log(err.stack);
            });
        });
    }
};