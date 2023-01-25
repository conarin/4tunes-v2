const fourTunesAPI = require("./4TunesAPI");
const Message = require("./message");
require('date-utils');
module.exports = {
    // 共通処理
    async fetchGuildData(guildId) {
        return await fourTunesAPI.fetch('/guilds', guildId, {
            guild_id: guildId
        });
    },
    async fetchChannel(channelId) {
        return await client.channels.fetch(channelId).catch(error => {
            if (error.status !== 404) console.error(error);
        });
    },
    async send(message, options) {
        const guildData = await this.fetchGuildData(message.guild.id);
        if (!guildData || !guildData.log_channel_id) return;

        const logChannel = await this.fetchChannel(guildData.log_channel_id);
        if (!logChannel) return;

        await Message.send(message, logChannel, options);
    },

    // 以下message関連のイベント
    messageFooter(message) {
        const iconURL = message.guild.iconURL({format: 'png', dynamic: true, size: 128}),
            channelName = message.channel.name,
            guildName = message.guild.name;

        return {
            text: `${channelName} in ${guildName}\n${new Date().toFormat('YYYY/MM/DD HH24:MI:SS')}`,
            icon_url: iconURL
        };
    },
    async createdOrUpdated(message, color) {
        const contentEmbed = [{
            color: color,
            description: `[${message.content}](${message.url})`,
            author: {
                name: `${message.author.tag}\n(${message.author.id})`,
                icon_url: message.author.displayAvatarURL({format: 'png', dynamic: true, size: 128})
            },
            footer: this.messageFooter(message)
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
                footer: this.messageFooter(message)
            }]
        };

        await this.send(message, options);
    },

    // 以下guildMember関連のイベント
    async guildMember(member, title, color) {
        console.log(member);
        const options = {
            embeds: [{
                color: color,
                title: title,
                author: {
                    name: `${member.user.tag}\n(${member.id})`,
                    icon_url: member.displayAvatarURL({format: 'png', dynamic: true, size: 128}),
                },
                footer: {
                    text: new Date().toFormat('YYYY/MM/DD HH24:MI:SS'),
                    icon_url: member.guild.iconURL({format: 'png', dynamic: true, size: 128}),
                }
            }]
        };

        await this.send({guild: member.guild}, options);
    },
    async guildMemberAdded(member) {
        await this.guildMember(member, 'GuildMemberAdd', client.colors.blue);
    },
    async guildMemberRemoved(member) {
        await this.guildMember(member, 'GuildMemberRemove', client.colors.purple);
    }
};
