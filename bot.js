const Discord = require('discord.js');
require('dotenv').config();
const env = process.env;

global.client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel
    ]
});
client.login(env.DISCORD_TOKEN);
require("./init/setCommands.js").execute();
require("./init/setEvents.js").execute();
require("./init/setMessageHandles.js").execute();

client.colors = {
    green: 0x43b581,
    orange: 0xfaa61a,
    red: 0xf04747,
    blue: 0x3498db
};