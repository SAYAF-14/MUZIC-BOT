const { cooldown, check_dj, databasing } = require("../handlers/functions");
const client = require("..");
const { PREFIX: botPrefix, emoji } = require("../settings/config");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  await databasing(message.guildId, message.author.id);
  let settings = await client.music.get(message.guild.id);
  let prefix = settings?.prefix || botPrefix;
  let mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) {
    if (nprefix.includes(client.user.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              ` ${emoji.SUCCESS} To See My All Commands Type  \`/help\` or \`${prefix}help\``
            ),
        ],
      });
    }
  }
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    let queue = client.distube.getQueue(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    let botChannel = message.guild.members.me.voice.channel;
    let checkDJ = await check_dj(client, message.member, queue?.songs[0]);

    if (
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      return client.embed(
        message,
        `**\`${command.name}\` انت لا تمتلك الصلاحية الازمة لإستخدام هذا الامر **`
      );
    } else if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      return client.embed(
        message,
        `**\`${command.name}\` ليس لدي صلاحية لإستخدام الامر **`
      );
    } else if (cooldown(message, command)) {
      return client.embed(
        message,
        `ثواني \`${cooldown(
          message,
          command
        ).toFixed()}\` أنت في فترة التهدئة ، انتظر**`
      );
    } else if (command.inVoiceChannel && !voiceChannel) {
      return client.embed(
        message,
        `**تحتاج لاإنضمام إلى روم صوتي ${emoji.ERROR}**`
      );
    } else if (
      command.inSameVoiceChannel &&
      botChannel &&
      !botChannel?.equals(voiceChannel)
    ) {
      return client.embed(
        message,
        `**${botChannel} يجب انت تكون معي في هذا الروم ${emoji.ERROR}**`
      );
    } else if (command.Player && !queue) {
      return client.embed(message, `**لا يوجد أغنية قيد التشغيل ${emoji.ERROR}**`);
    } else if (command.djOnly && checkDJ) {
      return client.embed(
        message,
        `** أنت لست دي جي  أيضًا لست من طلب الأغنية ..${emoji.ERROR}**`
      );
    } else {
      command.run(client, message, args, nprefix, queue);
    }
  }
});

function escapeRegex(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
