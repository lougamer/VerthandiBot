
import { logger } from '../utils/logger.js';

module.exports = {
  // =========================
  // BOT PRESENCE (what users see under the bot name)
  // =========================
  // `status` options:
  // - "online"    = green dot
  // - "idle"      = yellow moon
  // - "dnd"       = red do-not-disturb
  // - "invisible" = appears offline
  presence: {
    // Current online state shown on Discord.
    status: "online",

    // Activity lines shown under the bot name.
    // `type` number mapping from Discord:
    // 0 = Playing
    // 1 = Streaming
    // 2 = Listening
    // 3 = Watching
    // 4 = Custom
    // 5 = Competing
    activities: [
      {
        name: "Custom Status", // required by Discord API, not shown in the client
        state: "stalking",     // this is what people actually see
        type: 4,               // Custom
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    // Bot owner user IDs (comma-separated in OWNER_IDS env var).
    // Owners can access owner/admin-level bot commands.
    owners: process.env.OWNER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) || [],

    // Default wait time between command uses (in seconds).
    defaultCooldown: 3,

    // If true, old commands are removed before re-registering.
    deleteCommands: false,

    // Optional server ID retained for tutorial compatibility; not used for command registration.
    testGuildId: process.env.TEST_GUILD_ID,

    // When true (or MAINTENANCE_MODE=true), only bot owners can run commands.
    maintenanceMode: process.env.MAINTENANCE_MODE === "true",

    // Command prefix for text-based commands (e.g., "!" for "!ping").
    // Supports both slash commands and prefix commands.
    prefix: process.env.PREFIX || "!",
  },

  // =========================
  // AI CHATBOT SETTINGS
  // =========================
  aiChat: {
    // Toggles the conversational AI features completely.
    enabled: !!process.env.GEMINI_API_KEY,

    // Default target engine processing raw string variables.
    model: "gemini-1.5-flash",

    // System instruction prompt modifying how the AI constructs replies.
    personality: "You are a helpful, witty, and intelligent assistant named Verthandi. Keep your responses engaging and clear.",

    // Maximum characters allowed in a single reply window before trimming.
    maxOutputLength: 2000,
  },

  // =========================
  // APPLICATIONS SYSTEM
  // =========================
  applications: {
    // Default questions shown when someone fills out an application.
    defaultQuestions: [
      { question: "What is your name?", required: true },
      { question: "How old are you?", required: true },
      { question: "Why do you want to join?", required: true },
    ],

    // Embed colors by application status.
    statusColors: {
      pending: "#FFA500",
      approved: "#00FF00",
      denied: "#FF0000",
    },

    // How long users must wait before submitting another application (hours).
    applicationCooldown: 24,

    // Auto-delete denied applications after this many days.
    deleteDeniedAfter: 7,

    // Auto-delete approved applications after this many days.
    deleteApprovedAfter: 30,

    // Role IDs allowed to manage applications.
    managerRoles: [], // Will be populated from environment or database
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  // IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all bot colors
  embeds: {
    colors: {
      // Main brand colors.
      primary: "#336699",
      secondary: "#2F3136",

      // Standard status colors for success/error/warning/info messages.
      success: "#57F287",
      error: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",

      // Neutral utility colors.
      light: "#FFFFFF",
      dark: "#202225",
      gray: "#99AAB5",

      // Discord-style palette shortcuts.
      blurple: "#5865F2",
      green: "#57F287",
      yellow: "#FEE75C",
      fuchsia: "#EB459E",
      red: "#ED4245",
      black: "#000000",

      // Feature-specific colors.
      giveaway: {
        active: "#57F287",
        ended: "#ED4245",
      },
      ticket: {
        open: "#57F287",
        claimed: "#FAA61A",
        closed: "#ED4245",
        pending: "#99AAB5",
      },
      economy: "#F1C40F",
      birthday: "#E91E63",
      moderation: "#9B59B6",

      // Ticket priority color mapping.
      priority: {
        none: "#95A5A6",
        low: "#3498db",
        medium: "#2ecc71",
        high: "#f1c40f",
        urgent: "#e74c3c",
      },
    },
    footer: {
      // Default footer text used in bot embeds.
      text: "Titan Bot",
      // Footer icon URL (null = no icon).
      icon: null,
    },
    // Default thumbnail URL for embeds (null = no thumbnail).
    thumbnail: null,
    author: {
      // Optional default embed author block.
      name: null,
      icon: null,
      url: null,
    },
  },

  // =========================
  // ECONOMY SETTINGS
  // =========================
  economy: {
    currency: {
      // Currency display name.
      name: "coins",
      // Plural display name.
      namePlural: "coins",
      // Currency symbol shown in balances.
      symbol: "$",
    },

    // Starting balance for new users.
    startingBalance: 0,

    // Maximum bank amount before upgrades (if upgrades are used).
    baseBankCapacity: 100000,

    // Daily reward amount.
    dailyAmount: 100,

    // Work command random payout range.
    workMin: 10,
    workMax: 100,

    // Beg command random payout range.
    begMin: 5,
    begMax: 50,

    // Command cooldowns (milliseconds).
    cooldowns: {
      daily: 24 * 60 * 60 * 1000,
      work: 60 * 60 * 1000,
      crime: 2 * 60 * 60 * 1000,
      rob: 4 * 60 * 60 * 1000,
    },

    // Chance to succeed when robbing (0.4 = 40%).
    robSuccessRate: 0.4,

    // Jail time after failed rob (milliseconds).
    // 3600000 = 1 hour.
    robFailJailTime: 3600000,
  },

  // =========================
  // SHOP SETTINGS
  // =========================
  shop: {},

  // =========================
  // TICKET SYSTEM
  // =========================
  tickets: {
    // Category ID where new tickets are created (null = no forced category).
    defaultCategory: null,

    // Role IDs allowed to manage/support tickets.
    supportRoles: [],

    // Priority options users/staff can assign.
    priorities: {
      none: {
        emoji: "⚪",
        color: "#95A5A6",
        label: "None",
      },
      low: {
        emoji: "🟢",
        color: "#2ECC71",
        label: "Low",
      },
      medium: {
        emoji: "🟡",
        color: "#F1C40F",
        label: "Medium",
      },
      high: {
        emoji: "🔴",
        color: "#E74C3C",
        label: "High",
      },
      urgent: {
        emoji: "🚨",
        color: "#E91E63",
        label: "Urgent",
      },
    },

    // Default priority for new tickets.
    defaultPriority: "none",

    // Category ID where closed tickets are archived.
    archiveCategory: null,

    // Channel ID where ticket logs are sent.
    logChannel: null,
  },

  // =========================
  // GIVEAWAY SETTINGS
  // =========================
  giveaways: {
    // Default giveaway duration in milliseconds.
    // 86400000 = 24 hours.
    defaultDuration: 86400000,

    // Allowed winner count range.
    minimumWinners: 1,
    maximumWinners: 10,

    // Allowed giveaway duration range in milliseconds.
    // 300000 = 5 minutes.
    minimumDuration: 300000,
    // 2592000000 = 30 days.
    maximumDuration: 2592000000,

    // Role IDs allowed to host giveaways.
    allowedRoles: [],

    // Role IDs that bypass giveaway restrictions.
    bypassRoles: [],
  },

  // =========================
  // BIRTHDAY SETTINGS
  // =========================
  birthday: {
    // Role ID given to users on their birthday.
    defaultRole: null,

    // Channel ID where birthday announcements are posted.
    announcementChannel: null,

    // Timezone used to calculate birthday dates.
    timezone: "UTC",
  },

  // =========================
  // VERIFICATION SETTINGS
  // =========================
  verification: {
    // Message shown when posting the verification panel.
    defaultMessage: "Click the button below to verify yourself and gain access to the server!",

    // Text on the verification button.
    defaultButtonText: "Verify",

    // Automatic verification configuration settings.
    autoVerify: {
      // Options: "none" (immediate approve), "account_age" (checks time threshold), "captcha" (bot filter).
      mode: "none",
      
      // Mandatory account survival timeline benchmark values (in hours).
      minimumAccountAgeHours: 24
    }
  }
};
