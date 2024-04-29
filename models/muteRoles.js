module.exports = (sequelize, type) => {
    return sequelize.define("muteroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}