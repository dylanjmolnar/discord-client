module.exports = (sequelize, type) => {
    return sequelize.define("expelledguilds", {
        guildID : {
            type: type.STRING
        },
        guildName: {
            type: type.STRING
        }
    });
}