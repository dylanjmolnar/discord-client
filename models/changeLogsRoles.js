module.exports = (sequelize, type) => {
    return sequelize.define("changelogsroles", {
        guildID : {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}