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

        const logChannel = await client.channels.fetch(guildData.log_channel_id).catch(error => {
            if (error.status !== 404) console.error(error);
        });
        if (!logChannel) return;

        await Message.send(message, logChannel, options);
    },
    async createdOrEdited(message, color) {
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
    async created(message) {
        await this.createdOrEdited(message, client.colors.success);
    },
    async edited(message) {
        await this.createdOrEdited(message, client.colors.warning);
    },
    async deleted(message) {
        const options = {
            embeds: [{
                color: client.colors.danger,
                title: 'messageDelete',
                description: `[${message.id}](${message.url})`,
                footer: this.createFooter(message)
            }]
        };

        await this.send(message, options);
    }
};
