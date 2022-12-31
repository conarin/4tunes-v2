const Discord = require('discord.js');
require('dotenv').config();
const env = process.env;

global.client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel
    ]
});
client.login(env.DISCORD_TOKEN);
require("./init/setCommands.js").execute();
require("./init/setEvents.js").execute();