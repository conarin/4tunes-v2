const { SlashCommandBuilder } = require('discord.js');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const RE2 = require('re2');
const Interaction = require('../utils/interaction.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('snowflake')
        .setDescription('snowflakeの作成・日時への変換を行う')
        .addSubcommand(option => option
            .setName('generate')
            .setDescription('snowflakeを作成する')
        )
        .addSubcommand(option => option
            .setName('date')
            .setDescription('snowflakeから日時を求める')
            .addStringOption(option => option
                .setName('snowflake')
                .setDescription('snowflake')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'generate') {
            await Interaction.reply(interaction, {
                content: DiscordSnowflake.generate()
            });
        } else if (subcommand === 'date') {
            let snowflake = interaction.options.getString('snowflake');

            if (!new RE2(/^\d+$/).test(snowflake)) {
                await Interaction.reply(interaction, {
                    embeds: [{
                        title: '無効な値',
                        description: 'snowflakeの形式で入力してください',
                        color: client.colors.warning
                    }]
                });
                return;
            }

            const timestamp = Math.floor(Number(DiscordSnowflake.deconstruct(snowflake).timestamp) / 1000);
            await Interaction.reply(interaction, {
                content: `<t:${timestamp}:d> <t:${timestamp}:T>`
            });
        }
    }
};