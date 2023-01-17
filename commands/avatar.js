const { SlashCommandBuilder } = require('discord.js');
const Interaction = require('../utils/interaction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('指定したユーザーのアバターを表示する')
        .addUserOption(option => option
            .setName('user')
            .setDescription('表示したいユーザー')
            .setRequired(false)
        ),
    async execute(interaction) {
        let user = interaction.options.getUser('user');
        if (!user) user = interaction.user;

        await Interaction.reply(interaction, {
            embeds: [{
                author: {
                    name: `${user.tag}\n(${user.id})`
                },
                image: {
                    url: user.displayAvatarURL({ format: 'png', dynamic: true, size:2048 })
                },
            }]
        });
    },
};