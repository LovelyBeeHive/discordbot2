// Tweak these to taste. Per-server log channel is set with /setlog.
module.exports = {
  automod: {
    enabled: true,
    // Spam: more than `maxMessages` messages in `intervalMs`
    spam: { maxMessages: 5, intervalMs: 5000 },
    // Same message repeated `maxDuplicates` times in `duplicateWindowMs`
    duplicates: { maxDuplicates: 3, windowMs: 30000 },
    // Messages with more than this many unique user/role mentions
    maxMentions: 5,
    // Delete Discord invite links (users with ManageMessages are exempt)
    blockInvites: true,
    // Timeout length applied to spammers (minutes)
    timeoutMinutes: 10,
    // Strikes before the automod escalates from a timeout to a kick
    strikesBeforeKick: 3,
  },
  raid: {
    enabled: true,
    // If `joins` accounts join within `intervalMs`, trigger raid mode alert
    joins: 8,
    intervalMs: 10000,
    // Accounts younger than this (days) are flagged in the log when they join
    minAccountAgeDays: 3,
    // Kick accounts younger than minAccountAgeDays while raid mode is active
    kickNewAccountsDuringRaid: true,
  },
};
