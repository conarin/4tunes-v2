const Discord = require('discord.js');
require('dotenv').config();
const env = process.env;
module.exports = {
    name: 'sendMessage',
    async send(message, sendChannel, options) {
        if (!options) return;

        // 送信元チャンネルと送信先チャンネルが同じかつ
        // DMチャンネルまたはギルドチャンネルでメッセージ履歴の権限があれば
        let replyOptions = false;
        if (message.channel.id === sendChannel.id &&
            (message.channel.type === Discord.ChannelType.DM ||
                message.channel.permissionsFor(client.user).has(Discord.PermissionsBitField.Flags.ReadMessageHistory))
        ) replyOptions = {messageReference: message.id, failIfNotExists: false};

        await sendChannel.send({
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

            const logChannel = await client.channels.fetch(env.LOG_CHANNEL_ID).catch(error => console.error(error));
            const clientApplication = await client.application.fetch();
            if (logChannel) await logChannel
                .send({content:`<@${clientApplication.owner.ownerId || clientApplication.owner.id}>`, embeds: [embed]})
                .catch(error => console.error(error));

            await sendChannel.send({embeds: [{
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