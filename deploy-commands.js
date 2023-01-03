const Discord = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();
const env = process.env;

const deleteCommandIds = [];

const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new Discord.REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            // Discord.Routes.applicationGuildCommands(env.CLIENT_ID, env.DEV_GUILD_ID),
            Discord.Routes.applicationGuildCommands(env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

deleteCommandIds.forEach(id => {
    rest.delete(Discord.Routes.applicationCommand(env.CLIENT_ID, id))
        .then(() => console.log('Successfully deleted application command'))
        .catch(console.error);
});