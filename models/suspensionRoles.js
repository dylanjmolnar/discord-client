module.exports = (sequelize, type) => {
    return sequelize.define("suspensionroles", {
        messageID: {
            type: type.STRING
        },
        roleID: {
            type: type.STRING
        }
    });
}