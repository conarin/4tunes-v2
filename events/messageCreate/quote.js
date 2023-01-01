const fetchMessages = require('../../utils/fetchMessages.js');
const sendMessage = require('../../utils/sendMessage.js');
module.exports = {
    name: 'quote',
    async execute(message) {
        const messages = await fetchMessages.fetch(message.content);

        for (const msg of messages) {
            const reactions = [];
            for (const reaction of [...msg.reactions.cache.values()]){
                const emoji = reaction.emoji.name,
                    count = reaction.count;
                reactions.push(emoji + count);
            }

            const contentEmbed = [{
                title: '引用機能',
                description: msg.content || null,
                author: {
                    name: msg.author.tag,
                    icon_url: msg.author.avatarURL({format: 'png', dynamic: true, size:128}) ?
                        msg.author.avatarURL({format: 'png', dynamic: true, size:128}) :
                        msg.author.defaultAvatarURL
                },
                fields: reactions.length ? [{
                    name: 'reactions',
                    value: reactions.join(' '),
                }] : null,
                footer: {
                    text: `${msg.channel.name} in ${msg.guild.name}`,
                    icon_url: msg.guild.iconURL({format: 'png', dynamic: true, size:128})
                },
                timestamp: msg.createdAt
            }];

            const options = {
                embeds: contentEmbed.concat(msg.embeds),
                files: [...msg.attachments.values()] || null,
                components: msg.components || null,
                stickers: [...msg.stickers.values()] || null
            };

            await sendMessage.send(message, options);
        }
    }
};
