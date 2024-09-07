const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} Is Online`);

  // تعيين حالة البوت إلى "عدم الإزعاج"
  client.user.setPresence({ status: "online" });

  // تعيين نشاط البوت على "الاستماع" إلى ➺𝐍𝐄𝐕 𝐌𝐔𝐒𝐈𝐂 ⭐
  client.user.setActivity({
    name: `➺ 𝐀𝐋𝐒𝐇𝐀𝐌𝐈 ⭐`,
    type: ActivityType.Listening,
  });

  // تحميل قاعدة البيانات وتهيئتها
  await require("../handlers/Database")(client);

  // تحميل لوحة المعلومات الرسومية (إن وجدت)
  require("../server");

  // تحديث "إمبد" البوت لكل خادم (سيرفر)
  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild);
  });
});

module.exports = client;
