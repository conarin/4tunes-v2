const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
module.exports = {
    execute() {
        client.buttonHandles = new Discord.Collection();
        const handlesPath = path.join(__dirname, '../buttonHandles');
        const handleFiles = fs.readdirSync(handlesPath).filter(file => file.endsWith('.js'));

        for (const file of handleFiles) {
            const filePath = path.join(handlesPath, file);
            const handle = require(filePath);
            client.buttonHandles.set(handle.name, handle);
        }
    }
};
