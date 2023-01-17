const ranking = require("../utils/ranking.js");
module.exports = {
    name: 'previousRanking',
    async execute(interaction) {
        await ranking.pagination(interaction);
    }
};