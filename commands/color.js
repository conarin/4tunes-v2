const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const sharp = require('sharp');
const Interaction = require('../utils/interaction.js');
const color = require('../utils/color.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('指定したHEXカラーコードの画像を作成する')
        .addStringOption(option => option
            .setName('hex')
            .setDescription('HEXカラーコード(#000000)')
            .setMaxLength(7)
            .setRequired(true)
        ),
    async execute(interaction) {
        let hex = interaction.options.getString('hex');

        const rgb = color.hex2rgb(hex);
        hex = color.rgb2hex(rgb);

        const buffer = await sharp({
            create: {
                width: 128,
                height: 128,
                channels: 4,
                background: { r: rgb[0], g: rgb[1], b: rgb[2], alpha: 1 }
            }
        }).png().toBuffer();

        const file = new AttachmentBuilder(buffer, {name: `${hex}.png`});

        await Interaction.reply(interaction, {
            content: `#${hex}`,
            files: [file]
        });
    },
};