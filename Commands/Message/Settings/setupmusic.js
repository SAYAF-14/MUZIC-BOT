const { Message, ChannelType, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  aliases: ["setmusic", "setup"],
  description: `setup music channel in server`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Settings",
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
    let channel = await client.music.get(`${message.guild.id}.music.channel`);
    let oldChannel = message.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} ${oldChannel} تم إعداد قناة طلب الموسيقى بالفعل احذف أولاً والإعداد مرة أخرى**`
      );
    } else {
      message.guild.channels
        .create({
          name: `🎼〢𝐌𝐔𝐒𝐈𝐂`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `ميوزك بوت`,
          topic: `<a:Disco:633219596106596352><a:ff4109:694048323534979119> <a:emoji_65:706572811396841513> <a:headphone:705611629039059024> | <a:mcap:705629499949056071><a:u_:705629683051528242><a:s_:705629641624387656><a:i_:705629425261084743><a:c_:705629369472909332><a:emoji_34:706559882626859039><a:Disco:633219596106596352>`,
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(message.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(message.guild)],
                  components: [client.buttons(true)],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${message.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    message,
                    `**${ch} تم بنجاح إعداد الروم الخاص بالموسيقى ${client.config.emoji.SUCCESS}**`
                  );
                });
            });
        });
    }
  },
};
