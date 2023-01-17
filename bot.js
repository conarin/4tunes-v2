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
require("./init/setButtonHandles.js").execute();

client.colors = {
    success: 0x43b581,
    warning: 0xfaa61a,
    danger: 0xf04747,
    info: 0x3498db
};