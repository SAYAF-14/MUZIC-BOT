const {
  Message,
  EmbedBuilder,
  version,
  PermissionFlagsBits,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { msToDuration, formatBytes } = require("../../../handlers/functions");
const os = require("systeminformation");

module.exports = {
  name: "stats",
  aliases: ["botinfo"],
  description: `see stats of bot`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();
    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle("__**Stats:**__")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `> ** Made by [\` ALSHAMI \`](https://www.instagram.com/sayaf_14) **`
          )
          .addFields([
            {
              name: `⏳ استخدام الذاكرة`,
              value: `\`${UsageRam}\` / \`${TotalRam}\``,
            },
            {
              name: `⌚️ مدة التشغيل`,
              // value: `<t:${Math.floor(
              //   Date.now() / 1000 - client.uptime / 1000
              // )}:R>`,
              value: `\`${msToDuration(client.uptime)}\``,
            },
            {
              name: `📁 المستخدمون`,
              value: `\`${client.guilds.cache.size} \``,
              inline: true,
            },
            {
              name: `📁 الخوادم`,
              value: `\`${client.guilds.cache.size}\``,
              inline: true,
            },
            {
              name: `📁 القنوات`,
              value: `\`${client.channels.cache.size}\``,
              inline: true,
            },
            {
              name: `👾 Discord.JS`,
              value: `\`v${version}\``,
              inline: true,
            },
            {
              name: `🤖 Node`,
              value: `\`${process.version}\``,
              inline: true,
            },
            {
              name: `🏓 Ping`,
              value: `\`${client.ws.ping}ms\``,
              inline: true,
            },
            {
              name: `🤖 استخدام المعالج`,
              value: `\`${Math.floor(cpuUsage)}%\``,
              inline: true,
            },
            {
              name: `🤖 Arch`,
              value: `\`${osInfo.arch}\``,
              inline: true,
            },
            {
              name: `💻 منصة`,
              value: `\`\`${osInfo.platform}\`\``,
              inline: true,
            },
            {
              name: `🤖 وحدة المعالجة المركزية`,
              value: `\`\`\`fix\n${cpu.brand}\`\`\``,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
