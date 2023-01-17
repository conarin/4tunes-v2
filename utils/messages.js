const RE2 = require('re2');
module.exports = {
    async fetch(content) {
        const urls = content
            .split(new RE2(/(?:https|http):\/\/(?:[a-z]+\.|)(?:discord|discordapp)\.com\/channels((?:\/[0-9]+){3})/g))
            .filter(element => new RE2(/(\/[0-9]+){3}/).test(element));

        if (!urls.length) return [];

        return (await Promise.all(urls.map(async url => {
            const match = url
                .match(new RE2(/(\/[0-9]+){3}/))[0]
                .split('/');

            const guildId = match[1],
                channelId = match[2],
                messageId = match[3];

            const guild = await client.guilds.fetch(guildId).catch(error => {
                if (error.status !== 403) console.log('quoteGuildFetchError: ' + error);
            });
            if (!guild) return;

            const channel = await client.channels.fetch(channelId).catch(error => {
                if (error.status !== 404) console.log('quoteChannelFetchError: ' + error);
            });
            if (!channel) return;

            let message = await channel.messages.fetch(messageId).catch(error => {
                if (error.status !== 404) console.log('quoteMessageFetchError: ' + error);
            });
            if (!message) return;

            return message;
        }))).filter(message => message);
    }
};
