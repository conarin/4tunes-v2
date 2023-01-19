const Discord = require('discord.js');
const path = require("path");
const fs = require("fs");
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

client.colors = {
    success: 0x43b581,
    warning: 0xfaa61a,
    danger: 0xf04747,
    info: 0x3498db
};

const initPath = path.join(__dirname, './init');
const initFiles = fs.readdirSync(initPath).filter(file => file.endsWith('.js'));
for (const file of initFiles) {
    const filePath = path.join(initPath, file);
    require(filePath).execute();
}