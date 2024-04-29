module.exports = (sequelize, type) => {
    return sequelize.define("logsroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}