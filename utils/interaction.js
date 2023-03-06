module.exports = {
    async reply(interaction, options) {
        if (!options) return;

        await interaction.reply({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            ephemeral: options.ephemeral === true
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
        });
    },
    async editReply(interaction, options) {
        if (!options) return;

        await interaction.editReply({
            content: options.content !== undefined ? String(options.content) : null,
            embeds: options.embeds !== undefined && typeof options.embeds === 'object' ? options.embeds : null,
            files: options.files !== undefined && typeof options.files === 'object' ? options.files : null,
            components: options.components !== undefined && typeof options.components === 'object' ? options.components : null,
            allowedMentions: {repliedUser: false}
        });
    },
    async deferReply(interaction, options) {
        if (!options) return;

        return await interaction.deferReply({
            ephemeral: options.ephemeral === true,
            fetchReply: options.fetchReply === true
        });
    }
};