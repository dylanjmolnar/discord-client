module.exports = (sequelize, type) => {
    return sequelize.define("expelledguildsroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}