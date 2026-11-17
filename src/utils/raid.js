const raidMode = new Map(); // guildId -> expiry timestamp (or Infinity)

module.exports = {
  setRaidMode(guildId, on, durationMs = Infinity) {
    if (on) raidMode.set(guildId, durationMs === Infinity ? Infinity : Date.now() + durationMs);
    else raidMode.delete(guildId);
  },
  isRaidMode(guildId) {
    const exp = raidMode.get(guildId);
    if (exp === undefined) return false;
    if (Date.now() > exp) { raidMode.delete(guildId); return false; }
    return true;
  },
};
