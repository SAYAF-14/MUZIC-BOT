const client = require("../index");
const { cooldown, check_dj, databasing } = require("../handlers/functions");
const { emoji } = require("../settings/config");
const {
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply().catch((e) => {});
    await databasing(interaction.guildId, interaction.user.id);
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd)
      return client.embed(
        interaction,
        `**\`${interaction.commandName}\` لم يتم العثور على الإمر ${emoji.ERROR}**`
      );
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    if (cmd) {
      // checking user perms
      let queue = client.distube.getQueue(interaction.guild.id);
      let voiceChannel = interaction.member.voice.channel;
      let botChannel = interaction.guild.members.me.voice.channel;
      let checkDJ = await check_dj(client, interaction.member, queue?.songs[0]);
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.resolve(cmd.userPermissions)
        )
      ) {
        return client.embed(
          interaction,
          `**${cmd.name} انت لا تمتلك الصلاحية الازمة لإستخدام هذا الامر **`
        );
      } else if (
        !interaction.guild.members.me.permissions.has(
          PermissionsBitField.resolve(cmd.botPermissions)
        )
      ) {
        return client.embed(
          interaction,
          `**\`${cmd.name}\` ليس لدي صلاحية لإستخدام الامر **`
        );
      } else if (cooldown(interaction, cmd)) {
        return client.embed(
          interaction,
          `ثواني \`${cooldown(
            interaction,
            cmd
          ).toFixed()}\` أنت في فترة التهدئة ، انتظر`
        );
      } else if (cmd.inVoiceChannel && !voiceChannel) {
        return client.embed(
          interaction,
          `**تحتاج لاإنضمام إلى روم صوتي ${emoji.ERROR}**`
        );
      } else if (
        cmd.inSameVoiceChannel &&
        botChannel &&
        !botChannel?.equals(voiceChannel)
      ) {
        return client.embed(
          interaction,
          `**${botChannel} يجب انت تكون معي في هذا الروم ${emoji.ERROR}**`
        );
      } else if (cmd.Player && !queue) {
        return client.embed(interaction, `**لا يوجد أغنية قيد التشغيل ${emoji.ERROR}**`);
      } else if (cmd.djOnly && checkDJ) {
        return client.embed(
          interaction,
          `** أنت لست دي جي  أيضًا لست من طلب الأغنية ..${emoji.ERROR}**`
        );
      } else {
        cmd.run(client, interaction, args, queue);
      }
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => {});
    const command = client.commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

  // button handling
  if (interaction.isButton()) {
    await interaction.deferUpdate().catch((e) => {});
  }
  // menu handling
  if (interaction.isAnySelectMenu()) {
    await interaction.deferUpdate().catch((e) => {});
  }
});
