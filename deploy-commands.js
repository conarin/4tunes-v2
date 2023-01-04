const Discord = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();
const env = process.env;

const deleteCommands = [
    // {id: 'commandId', guildId: null}
];

const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push({
        data: command.data.toJSON(),
        guilds: command.guilds
    });
}

const applicationCommands = commands.filter(command => !command.guilds).map(command => command.data);
console.log('application commands: ' + JSON.stringify(applicationCommands, null, 2));

let applicationGuildCommands = {};
commands.filter(command => command.guilds).forEach(command => {
    command.guilds.map(guildId => {
        if (!applicationGuildCommands[guildId]) applicationGuildCommands[guildId] = [];
        applicationGuildCommands[guildId].push(command.data);
    });
});
for (const guildId in applicationGuildCommands) {
    console.log(guildId + ': ' + JSON.stringify(applicationGuildCommands[guildId], null, 2));
}

const rest = new Discord.REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        if (applicationCommands.length) {
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Discord.Routes.applicationCommands(env.CLIENT_ID),
                {body: applicationCommands},
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }

        if (Object.keys(applicationGuildCommands).length) {
            for (const guildId in applicationGuildCommands) {
                const data = await rest.put(
                    Discord.Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                    { body: applicationGuildCommands[guildId] },
                );
                console.log(`Successfully reloaded ${data.length} application guild (/) commands.`);
            }
        }
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

deleteCommands.forEach(command => {
    if (command.guildId) {
        rest.delete(Discord.Routes.applicationGuildCommand(env.CLIENT_ID, command.guildId, command.id))
            .then(() => console.log(`Successfully deleted application command: ${command.id}`))
            .catch(console.error);
    } else {
        rest.delete(Discord.Routes.applicationCommand(env.CLIENT_ID, command.id))
            .then(() => console.log(`Successfully deleted application command: ${command.id}`))
            .catch(console.error);
    }
});