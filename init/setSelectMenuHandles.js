const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
module.exports = {
    execute() {
        client.selectMenuHandles = new Discord.Collection();
        const handlesPath = path.join(__dirname, '../selectMenuHandles');
        const handleFiles = fs.readdirSync(handlesPath).filter(file => file.endsWith('.js'));

        for (const file of handleFiles) {
            const filePath = path.join(handlesPath, file);
            const handle = require(filePath);
            client.selectMenuHandles.set(handle.name, handle);
        }
    }
};
