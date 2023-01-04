const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const sharp = require('sharp');
const replyInteraction = require('../utils/replyInteraction.js');

const hex2rgb = hex => {
    if (hex.slice(0, 1) === '#') hex = hex.slice(1);
    if (hex.length === 3) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3);

    return [hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 )].map(str => {
        return parseInt(str, 16) || 0;
    });
};

const rgb2hex = rgb => {
    return rgb.map(value => {
        return ('0' + value.toString(16)).slice(-2);
    }).join('');
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('指定したHEXカラーコードの画像を作成する')
        .addStringOption(option => option
            .setName('hex')
            .setDescription('HEXカラーコード(#000000)を入力')
            .setRequired(true)
        ),
    async execute(interaction) {
        let hex = interaction.options.getString('hex');

        const rgb = hex2rgb(hex);
        hex = rgb2hex(rgb);

        const buffer = await sharp({
            create: {
                width: 128,
                height: 128,
                channels: 4,
                background: { r: rgb[0], g: rgb[1], b: rgb[2], alpha: 1 }
            }
        }).png().toBuffer();

        const file = new AttachmentBuilder(buffer, {name: `${hex}.png`});

        await replyInteraction.reply(interaction, {
            content: `#${hex}`,
            files: [file]
        });
    },
};