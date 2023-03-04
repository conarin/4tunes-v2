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

            const results = {
                guildId: match[1],
                channelId: match[2],
                messageId: match[3],
                status: 500
            };

            const guild = await client.guilds.fetch(results.guildId).catch(error => {
                results.status = error.status;
                if (error.status !== 403) console.error('GuildFetchError: ' + error);
            });
            if (!guild) return results;

            const channel = await client.channels.fetch(results.channelId).catch(error => {
                results.status = error.status;
                if (error.status !== 404) console.error('ChannelFetchError: ' + error);
            });
            if (!channel) return results;

            let message = await channel.messages.fetch(results.messageId).catch(error => {
                results.status = error.status;
                if (error.status !== 404) console.error('MessageFetchError: ' + error);
            });
            if (!message) return results;

            results.message = message;
            results.status = 200;

            return results;
        }))).filter(message => message);
    }
};
