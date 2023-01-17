const Message = require('../utils/message.js');
const fourTunesAPI = require("../utils/4TunesAPI");
module.exports = {
    name: 'messageLog',
    guildOnly: true,
    async execute(message, data) {
        await fourTunesAPI.post(`/guilds/${message.guild.id}/members/${message.author.id}/messages`, {
            channel_id: message.channel.id,
            message_id: message.id
        });

        if (!data.guildData.log_channel_id) return;

        const iconURL = message.guild.iconURL({format: 'png', dynamic: true, size: 128}),
            channelName = message.channel.name,
            guildName = message.guild.name;

        const contentEmbed = [{
            color: client.colors.success,
            description: `[${message.content}](${message.url})`,
            author: {
                name: `${message.author.tag}\n(${message.author.id})`,
                icon_url: message.author.displayAvatarURL({format: 'png', dynamic: true, size:128})
            },
            footer: {
                text: `${channelName} in ${guildName}`,
                icon_url: iconURL
            },
            timestamp: message.createdAt
        }];

        const options = {
            embeds: contentEmbed.concat(message.embeds),
            files: [...message.attachments.values()] || null,
            components: message.components || null,
            stickers: [...message.stickers.values()] || null
        };

        const logChannel = await client.channels.fetch(data.guildData.log_channel_id).catch(error => {
            if (error.status !== 404) console.error(error);
        });
        if (!logChannel) return;

        await Message.send(message, logChannel, options);
    }
};
