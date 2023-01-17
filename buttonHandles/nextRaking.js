const ranking = require("../utils/ranking.js");
module.exports = {
    name: 'nextRanking',
    async execute(interaction) {
        await ranking.pagination(interaction);
    }
};