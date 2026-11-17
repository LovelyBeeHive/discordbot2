const { EmbedBuilder } = require('discord.js');
const store = require('./store');

async function modLog(guild, { title, color = 0xe67e22, fields = [], description }) {
  const id = store.getLogChannel(guild.id);
  if (!id) return;
  const channel = await guild.channels.fetch(id).catch(() => null);
  if (!channel?.isTextBased()) return;
  const embed = new EmbedBuilder().setTitle(title).setColor(color).setTimestamp();
  if (description) embed.setDescription(description);
  if (fields.length) embed.addFields(fields);
  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { modLog };
