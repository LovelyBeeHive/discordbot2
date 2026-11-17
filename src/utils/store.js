const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'data', 'db.json');
let db = { warnings: {}, logChannels: {} };

try {
  db = { ...db, ...JSON.parse(fs.readFileSync(FILE, 'utf8')) };
} catch {}

function save() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

module.exports = {
  addWarning(guildId, userId, entry) {
    const key = `${guildId}:${userId}`;
    (db.warnings[key] ??= []).push({ ...entry, at: Date.now() });
    save();
    return db.warnings[key].length;
  },
  getWarnings: (guildId, userId) => db.warnings[`${guildId}:${userId}`] ?? [],
  clearWarnings(guildId, userId) {
    delete db.warnings[`${guildId}:${userId}`];
    save();
  },
  setLogChannel(guildId, channelId) {
    db.logChannels[guildId] = channelId;
    save();
  },
  getLogChannel: (guildId) => db.logChannels[guildId],
};
