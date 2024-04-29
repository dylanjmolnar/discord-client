const os = require("os");
const process = require('process');

module.exports = {
    aliases: [],
    description: "Lists some computer stats.",
    use: `process`,
    cooldown: 1,
    type: "private",
    dms: false,
    public: false,
    premium: false,
    allChannels: true,
    channels: [],
    roles: [],
    async execute(client, message, settings, guilds, guildMembers) {
        let upTime = os.uptime();
        let memoryUsage = process.memoryUsage();
        message.channel.send(`Uptime: ${upTime}
Total Memory of System: ${Math.ceil(os.totalmem() / 100000)} MB
Free Memory: ${Math.ceil(os.freemem() / 100000)} MB
Used Memory: ${Math.ceil((os.totalmem() - os.freemem()) / 100000)} MB
Mem: ${Math.ceil(memoryUsage.heapTotal / 100000) + Math.ceil(memoryUsage.rss / 100000) + Math.ceil(memoryUsage.external / 100000)}
Mem Used: ${Math.ceil(memoryUsage.heapUsed / 100000) + Math.ceil(memoryUsage.rss / 100000) + Math.ceil(memoryUsage.external / 100000)}
Mem Left Over: ${Math.ceil(memoryUsage.heapTotal / 100000) - Math.ceil(memoryUsage.heapUsed / 100000)}`).catch(e => {});
    }
}