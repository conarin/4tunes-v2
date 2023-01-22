const fourTunesAPI = require("./4TunesAPI");
const Message = require("./message");
require('date-utils');
module.exports = {
    async fetchGuildData(message) {
        if (message.guild && message.guild?.available) {
            return await fourTunesAPI.fetch('/guilds', message.guild.id, {
                guild_id: message.guild.id
            });
        }
    },
    async fetchChannel(channelId) {
        return await client.channels.fetch(channelId).catch(error => {
            if (error.status !== 404) console.error(error);
        });
    },
    createFooter(message) {
        const iconURL = message.guild.iconURL({format: 'png', dynamic: true, size: 128}),
            channelName = message.channel.name,
            guildName = message.guild.name;

        return {
            text: `${channelName} in ${guildName}\n${new Date().toFormat('YYYY/MM/DD HH24:MI:SS')}`,
            icon_url: iconURL
        };
    },
    async send(message, options) {
        const guildData = await this.fetchGuildData(message);
        if (!guildData || !guildData.log_channel_id) return;

        const logChannel = await this.fetchChannel(guildData.log_channel_id);
        if (!logChannel) return;

        await Message.send(message, logChannel, options);
    },
    async createdOrUpdated(message, color) {
        const contentEmbed = [{
            color: color,
            description: `[${message.content}](${message.url})`,
            author: {
                name: `${message.author.tag}\n(${message.author.id})`,
                icon_url: message.author.displayAvatarURL({format: 'png', dynamic: true, size: 128})
            },
            footer: this.createFooter(message)
        }];

        const options = {
            embeds: contentEmbed.concat(message.embeds),
            files: [...message.attachments.values()] || null,
            components: message.components || null,
            stickers: [...message.stickers.values()] || null
        };

        await this.send(message, options);
    },
    async messageCreated(message) {
        await this.createdOrUpdated(message, client.colors.green);
    },
    async messageUpdated(message) {
        await this.createdOrUpdated(message, client.colors.orange);
    },
    async messageDeleted(message) {
        const options = {
            embeds: [{
                color: client.colors.red,
                title: 'messageDelete',
                description: `[${message.id}](${message.url})`,
                footer: this.createFooter(message)
            }]
        };

        await this.send(message, options);
    }
};
