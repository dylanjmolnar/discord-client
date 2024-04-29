module.exports = (sequelize, type) => {
    return sequelize.define("purgeroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}