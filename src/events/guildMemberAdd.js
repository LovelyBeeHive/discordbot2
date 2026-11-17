const cfg = require('../config').raid;
const { modLog } = require('../utils/log');
const { setRaidMode, isRaidMode } = require('../utils/raid');

const joins = new Map(); // guildId -> [timestamps]

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (!cfg.enabled || member.user.bot) return;
    const { guild } = member;
    const now = Date.now();
    const list = (joins.get(guild.id) ?? []).filter(t => now - t < cfg.intervalMs);
    list.push(now);
    joins.set(guild.id, list);

    if (list.length >= cfg.joins && !isRaidMode(guild.id)) {
      setRaidMode(guild.id, true, 10 * 60000); // auto-expires after 10 min
      modLog(guild, { title: 'RAID MODE ENABLED', color: 0xe74c3c,
        description: `${list.length} accounts joined within ${cfg.intervalMs / 1000}s. New accounts will be kicked for 10 minutes. Use /raidmode to change.` });
    }

    const ageDays = (now - member.user.createdTimestamp) / 86400000;
    if (ageDays < cfg.minAccountAgeDays) {
      if (cfg.kickNewAccountsDuringRaid && isRaidMode(guild.id) && member.kickable) {
        await member.kick('Raid mode: new account').catch(() => {});
        modLog(guild, { title: 'Raid kick', fields: [{ name: 'User', value: `${member.user.tag} (${member.id})` }, { name: 'Account age', value: `${ageDays.toFixed(1)} days` }] });
      } else {
        modLog(guild, { title: 'New account joined', color: 0xf1c40f,
          fields: [{ name: 'User', value: `${member.user.tag} (${member.id})` }, { name: 'Account age', value: `${ageDays.toFixed(1)} days` }] });
      }
    }
  },
};
