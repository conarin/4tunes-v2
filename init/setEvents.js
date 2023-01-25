const path = require("path");
const fs = require("fs");
require('dotenv').config();
const env = process.env;
module.exports = {
    execute() {
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, async (...args) => {
                    try {
                        event.execute(...args)
                    } catch (error) {
                        console.error(error);
                        console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);
                    }
                });
            } else {
                client.on(event.name, async (...args) => {
                    try {
                        event.execute(...args)
                    } catch (error) {
                        console.error(error);
                        console.log(`<@${env.CLIENT_APP_OWNER_ID}>`);
                    }
                });
            }
        }
    }
};
