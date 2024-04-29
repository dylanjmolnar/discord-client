module.exports = (sequelize, type) => {
    return sequelize.define("automuteroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}