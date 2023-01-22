const Message = require("./message");
module.exports = {
    async execute(message, logChannelId, color) {
        if (!logChannelId) return;

        const iconURL = message.guild.iconURL({format: 'png', dynamic: true, size: 128}),
            channelName = message.channel.name,
            guildName = message.guild.name;

        const timestamp = Math.floor(Date.now() / 1000);

        const contentEmbed = [{
            color: color,
            description: `[${message.content}](${message.url})`,
            author: {
                name: `${message.author.tag}\n(${message.author.id})`,
                icon_url: message.author.displayAvatarURL({format: 'png', dynamic: true, size:128})
            },
            footer: {
                text: `${channelName} in ${guildName}\n<t:${timestamp}:d> <t:${timestamp}:T>`,
                icon_url: iconURL
            }
        }];

        const options = {
            embeds: contentEmbed.concat(message.embeds),
            files: [...message.attachments.values()] || null,
            components: message.components || null,
            stickers: [...message.stickers.values()] || null
        };

        const logChannel = await client.channels.fetch(logChannelId).catch(error => {
            if (error.status !== 404) console.error(error);
        });
        if (!logChannel) return;

        await Message.send(message, logChannel, options);
    }
};
