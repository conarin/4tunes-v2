const Discord = require('discord.js');
module.exports = {
    async send(message, sendChannel, options) {
        if (!options) return;

        // 送信元チャンネルと送信先チャンネルが同じかつ
        // DMチャンネルまたはギルドチャンネルでメッセージ履歴の権限があれば
        let replyOptions = false;
        if (message && message.channel?.id === sendChannel.id &&
            (message.channel?.type === Discord.ChannelType.DM ||
                message.channel?.permissionsFor(client.user).has(Discord.PermissionsBitField.Flags.ReadMessageHistory))
        ) replyOptions = {messageReference: message.id, failIfNotExists: false};

        await sendChannel.send({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            stickers: options.stickers !== undefined && typeof options.stickers === 'object' ? options.stickers : null,
            reply: replyOptions,
            allowedMentions: {repliedUser: false}
        });
    },
    async edit(message, options) {
        if (!options) return;

        await message.edit({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            allowedMentions: {repliedUser: false}
        });
    }
};