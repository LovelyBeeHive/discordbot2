const { PermissionFlagsBits } = require('discord.js');
const cfg = require('../config').automod;
const { modLog } = require('../utils/log');
const store = require('../utils/store');

const history = new Map(); // `${guild}:${user}` -> [{content, at}]
const strikes = new Map(); // `${guild}:${user}` -> { count, at }
const INVITE = /(discord\.gg|discord(?:app)?\.com\/invite|dsc\.gg)\/[\w-]+/i;

async function punish(message, reason) {
  const { guild, member, author } = message;
  const key = `${guild.id}:${author.id}`;

  // Clean up their recent messages
  const recent = history.get(key) ?? [];
  const cutoff = Date.now() - 15000;
  const msgs = message.channel.messages.cache.filter(m => m.author.id === author.id && m.createdTimestamp > cutoff);
  await message.channel.bulkDelete(msgs, true).catch(() => message.delete().catch(() => {}));
  history.set(key, []);

  const s = strikes.get(key);
  const count = s && Date.now() - s.at < 3600000 ? s.count + 1 : 1;
  strikes.set(key, { count, at: Date.now() });

  let action;
  try {
    if (count >= cfg.strikesBeforeKick && member.kickable) {
      await member.kick(`Automod: ${reason}`);
      action = 'Kicked';
    } else if (member.moderatable) {
      await member.timeout(cfg.timeoutMinutes * 60000, `Automod: ${reason}`);
      action = `Timed out ${cfg.timeoutMinutes}m`;
    } else action = 'Messages deleted (could not punish: role too high)';
  } catch { action = 'Messages deleted (punishment failed)'; }

  modLog(guild, { title: 'Automod', fields: [
    { name: 'User', value: `${author.tag} (${author.id})` }, { name: 'Reason', value: reason },
    { name: 'Action', value: action }, { name: 'Strike', value: String(count) },
    { name: 'Channel', value: `<#${message.channel.id}>` }] });
}

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!cfg.enabled || !message.guild || message.author.bot || !message.member) return;
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const list = (history.get(key) ?? []).filter(e => now - e.at < 60000);
    list.push({ content: message.content, at: now });
    history.set(key, list);

    if (cfg.blockInvites && INVITE.test(message.content))
      return punish(message, 'Posted a Discord invite link');

    const mentions = message.mentions.users.size + message.mentions.roles.size;
    if (mentions > cfg.maxMentions || message.mentions.everyone && !message.member.permissions.has(PermissionFlagsBits.MentionEveryone))
      return punish(message, `Mass mentions (${mentions})`);

    if (list.filter(e => now - e.at < cfg.spam.intervalMs).length > cfg.spam.maxMessages)
      return punish(message, 'Message spam');

    if (message.content.length > 3) {
      const dupes = list.filter(e => e.content === message.content && now - e.at < cfg.duplicates.windowMs).length;
      if (dupes >= cfg.duplicates.maxDuplicates) return punish(message, 'Repeated identical messages');
    }
  },
};
