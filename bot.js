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
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Channel
    ]
});
client.login(env.DISCORD_TOKEN);

client.colors = {
    green: 0x43b581,
    orange: 0xfaa61a,
    red: 0xf04747,
    blue: 0x3498db,
    purple: 0x9b59b6
};

const initPath = path.join(__dirname, './init');
const initFiles = fs.readdirSync(initPath).filter(file => file.endsWith('.js'));
for (const file of initFiles) {
    const filePath = path.join(initPath, file);
    require(filePath).execute();
}