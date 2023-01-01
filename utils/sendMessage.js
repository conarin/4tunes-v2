const Discord = require('discord.js');
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
        });
    }
};